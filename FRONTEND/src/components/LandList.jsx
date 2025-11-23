import React, { useState, useEffect } from "react";
import axios from "axios";
import LandMap from "./LandMap";
import LandContactModal from "./LandContactModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from '../config';

// --- HELPER: Distance Calculation (Logic Same) ---
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const LandList = () => {
  // --- States (Logic Same) ---
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [selectedLandForDetails, setSelectedLandForDetails] = useState(null);
  const [selectedLandForContact, setSelectedLandForContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roadDistance, setRoadDistance] = useState(null);
  const [roadDuration, setRoadDuration] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // --- Effects (Logic Same) ---
  useEffect(() => {
    fetchLands();
  }, []);

  useEffect(() => {
    setRoadDistance(null);
    setRoadDuration(null);
    setCurrentImageIndex(0);
  }, [selectedLandForDetails]);

  useEffect(() => {
    let intervalId;
    if (
      selectedLandForDetails &&
      selectedLandForDetails.images &&
      selectedLandForDetails.images.length > 1
    ) {
      intervalId = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % selectedLandForDetails.images.length
        );
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedLandForDetails]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredLands(lands);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = lands.filter(
        (land) =>
          land.title.toLowerCase().includes(lowerTerm) ||
          land.location.toLowerCase().includes(lowerTerm) ||
          (land.tags &&
            land.tags.some((tag) => tag.toLowerCase().includes(lowerTerm)))
      );
      setFilteredLands(filtered);
    }
  }, [searchTerm, lands]);

  // --- Functions (Logic Same) ---
  const fetchLands = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/lands`)
      .then((res) => {
        const landData = res.data.lands || res.data.data || res.data;
        let validData = Array.isArray(landData) ? landData : [];
        setLands(validData);
        setFilteredLands(validData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lands:", err);
        toast.error("Failed to load lands.");
        setLoading(false);
      });
  };

  const nextImage = (e, images) => {
    e.stopPropagation();
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e, images) => {
    e.stopPropagation();
    if (images && images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const getUserLocation = (callback) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    toast.info("📍 Detecting location...", { autoClose: 1500 });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        if (callback) callback(coords);
      },
      (err) => {
        console.error(err);
        toast.error("Location denied.");
      }
    );
  };

  const handleNearMe = () => {
    getUserLocation((userLoc) => {
      const nearbyLands = lands.filter((land) => {
        if (!land.coordinates || !land.coordinates.lat) return false;
        const dist = getDistanceFromLatLonInKm(
          userLoc.lat,
          userLoc.lng,
          land.coordinates.lat,
          land.coordinates.lng
        );
        return dist <= 50;
      });
      if (nearbyLands.length === 0) toast.warn("No lands found within 50km.");
      else toast.success(`Found ${nearbyLands.length} lands near you!`);
      setFilteredLands(nearbyLands);
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredLands(lands);
    toast.info("Filters reset.");
  };

  const calculateRoadRoute = (userLoc, landLoc) => {
    if (!window.google || !window.google.maps) {
      toast.error("Map script loading...");
      return;
    }
    setCalculatingRoute(true);
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [userLoc],
        destinations: [landLoc],
        travelMode: "DRIVING",
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (res, status) => {
        setCalculatingRoute(false);
        if (status === "OK" && res.rows[0].elements[0].status === "OK") {
          setRoadDistance(res.rows[0].elements[0].distance.text);
          setRoadDuration(res.rows[0].elements[0].duration.text);
        } else {
          toast.error("Route calc failed.");
        }
      }
    );
  };

  const handleCheckDistance = (land) => {
    getUserLocation((userLoc) => {
      if (land && land.coordinates)
        calculateRoadRoute(userLoc, land.coordinates);
      else toast.warn("Land coordinates missing.");
    });
  };

  // --- REDESIGNED STYLES ---
  const styles = {
    // ... (Main page styles remain mostly the same)
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
    },
    headerSection: { textAlign: "center", marginBottom: "2.5rem" },
    header: {
      color: "#1e293b",
      fontSize: "2.8rem",
      fontWeight: "800",
      marginBottom: "10px",
      letterSpacing: "-0.5px",
    },
    actionBar: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "40px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      border: "1px solid #e2e8f0",
    },
    searchInput: {
      padding: "14px 24px",
      fontSize: "1rem",
      border: "2px solid #f1f5f9",
      borderRadius: "50px",
      width: "350px",
      outline: "none",
      transition: "all 0.3s",
      backgroundColor: "#f8fafc",
    },
    btn: {
      padding: "12px 28px",
      border: "none",
      borderRadius: "50px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    btnPrimary: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
    },
    btnSecondary: {
      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      color: "white",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "2.5rem",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #f1f5f9",
      position: "relative",
    },
    cardImage: { width: "100%", height: "220px", objectFit: "cover" },
    cardContent: {
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.8rem",
      flexGrow: 1,
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "2px",
    },
    cardPrice: { color: "#10b981", fontSize: "1.4rem", fontWeight: "800" },
    viewBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#f8fafc",
      color: "#334155",
      border: "none",
      borderTop: "1px solid #e2e8f0",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "auto",
      transition: "background 0.2s",
    },

    // --- MODAL & POPUP STYLES (REDESIGNED) ---
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px",
      animation: "fadeIn 0.2s ease-out",
    },
    modalContent: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "950px", // Slightly wider for 2-column layout
      borderRadius: "24px",
      overflow: "hidden",
      position: "relative",
      maxHeight: "95vh",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "rgba(0, 0, 0, 0.5)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      fontSize: "1.5rem",
      zIndex: 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
      transition: "transform 0.2s, background 0.2s",
    },

    // Slideshow - IMAGE SMALLER HERE
    slideshowContainer: {
      position: "relative",
      width: "100%",
      height: "280px", // ✅ CHANGED: Reduced height from 400px to 280px
      backgroundColor: "#e2e8f0",
    },
    slideImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    navBtn: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(0,0,0,0.3)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.5)",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      zIndex: 20,
      transition: "all 0.2s",
      backdropFilter: "blur(2px)",
    },
    dotsContainer: {
      position: "absolute",
      bottom: "15px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
      zIndex: 20,
      padding: "6px 10px",
      background: "rgba(0,0,0,0.4)",
      borderRadius: "20px",
      backdropFilter: "blur(4px)",
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.4)",
      cursor: "pointer",
      transition: "0.3s",
    },
    activeDot: { backgroundColor: "white", transform: "scale(1.2)" },

    // NEW: Two-Column Layout Styles
    modalBodyGrid: {
      display: "grid",
      gridTemplateColumns: "3fr 2fr", // Left column wider, right column narrower
      gap: "30px",
      padding: "30px",
      overflowY: "auto",
      alignItems: "start",
      backgroundColor: "#f8fafc",
       // Responsive fix for smaller screens
       '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr",
      }
    },
    modalMainContent: {
      // Left column styles
    },
    modalSidebar: {
      position: "sticky",
      top: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },

    // Content Styles
    modalTitle: { fontSize: "2.2rem", color: "#0f172a", margin: 0, lineHeight: 1.2, fontWeight: 800 },
    modalDate: { color: "#64748b", marginTop: "8px", fontSize: "0.95rem" },
    modalPrice: { fontSize: "2.2rem", fontWeight: "800", color: "#16a34a", marginTop: "10px" },

    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "15px",
      margin: "25px 0",
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
    featureCard: {
      textAlign: "center",
    },
    featureLabel: { fontSize: "0.85rem", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" },
    featureValue: { fontSize: "1.2rem", fontWeight: "700", color: "#334155" },

    sectionTitle: { fontSize: "1.1rem", color: "#1e293b", marginBottom: "12px", fontWeight: 700 },
    descriptionText: { color: "#475569", lineHeight: "1.8", fontSize: "1rem", whiteSpace: "pre-line" },

    tagContainer: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "5px" },
    miniTag: {
      fontSize: "0.85rem",
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
      padding: "6px 12px",
      borderRadius: "20px",
      fontWeight: "600",
      border: "1px solid #bae6fd"
    },

    // Sidebar Elements
    mapContainer: { height: "220px", borderRadius: "16px", overflow: "hidden", border: "2px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
    
    travelSection: {
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    },
    travelHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px",
      color: "#1e40af",
      fontSize: "1rem",
      fontWeight: "700",
    },
    travelStats: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "15px",
      backgroundColor: "#eff6ff",
      padding: "15px",
      borderRadius: "12px",
    },
    travelStatItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    statVal: { fontSize: "1.4rem", fontWeight: "800", color: "#2563eb" },
    statLbl: { fontSize: "0.8rem", color: "#60a5fa", marginTop: "4px" },

    contactBtnInModal: {
      width: "100%",
      padding: "18px",
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      fontSize: "1.2rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 10px 15px -3px rgba(22, 163, 74, 0.3)",
      transition: "transform 0.2s, box-shadow 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },
  };

  const renderDetailsModal = () => {
    if (!selectedLandForDetails) return null;
    const land = selectedLandForDetails;
    const images = land.images || [];
    const hasMultiple = images.length > 1;

    return (
      <div
        style={styles.modalOverlay}
        onClick={() => setSelectedLandForDetails(null)}
      >
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button
            style={styles.closeBtn}
            onClick={() => setSelectedLandForDetails(null)}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            ×
          </button>

          {/* Slideshow (Reduced Height) */}
          <div style={styles.slideshowContainer}>
            <img
              src={
                images.length > 0
                  ? `${images[currentImageIndex]}`
                  : "https://via.placeholder.com/800x400?text=No+Image"
              }
              style={styles.slideImg}
              alt={`Slide ${currentImageIndex}`}
            />

            {hasMultiple && (
              <>
                <button
                  style={{ ...styles.navBtn, left: "20px" }}
                  onClick={(e) => prevImage(e, images)}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")}
                >
                  ‹
                </button>
                <button
                  style={{ ...styles.navBtn, right: "20px" }}
                  onClick={(e) => nextImage(e, images)}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)")}
                >
                  ›
                </button>

                <div style={styles.dotsContainer}>
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.dot,
                        ...(idx === currentImageIndex ? styles.activeDot : {}),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* New 2-Column Grid Layout for Body */}
          <div style={styles.modalBodyGrid}>
            
            {/* --- Left Column: Main Content --- */}
            <div style={styles.modalMainContent}>
                <div>
                    <h2 style={styles.modalTitle}>{land.title}</h2>
                    <p style={styles.modalDate}>📅 Listed on {new Date(land.createdAt || Date.now()).toLocaleDateString()}</p>
                    <div style={styles.modalPrice}>
                        ₹{parseInt(land.price).toLocaleString("en-IN")}
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={styles.featureGrid}>
                    <div style={styles.featureCard}>
                        <div style={styles.featureLabel}>📍 Location</div>
                        <div style={styles.featureValue}>{land.location}</div>
                    </div>
                    <div style={{...styles.featureCard, borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0'}}>
                        <div style={styles.featureLabel}>📐 Area</div>
                        <div style={styles.featureValue}>{land.area}</div>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureLabel}>🏷️ Status</div>
                        <div style={{...styles.featureValue, color: land.status === 'sold' ? '#ef4444' : '#16a34a', textTransform: 'capitalize'}}>
                            {land.status || 'Available'}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {land.tags && land.tags.length > 0 && (
                <div style={{ marginBottom: "30px" }}>
                    <h4 style={styles.sectionTitle}>Keywords</h4>
                    <div style={styles.tagContainer}>
                    {land.tags.map((tag, i) => (
                        <span key={i} style={styles.miniTag}>#{tag}</span>
                    ))}
                    </div>
                </div>
                )}

                {/* Description */}
                <div>
                    <h3 style={styles.sectionTitle}>About this land</h3>
                    <p style={styles.descriptionText}>
                    {land.description}
                    </p>
                </div>
            </div>

            {/* --- Right Column: Sidebar (Sticky) --- */}
            <div style={styles.modalSidebar}>
                 {/* CTA Button (Moved top for better mobile experience, but sticky on desktop) */}
                <button
                style={styles.contactBtnInModal}
                onClick={() => {
                    setSelectedLandForContact(land);
                    setSelectedLandForDetails(null);
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 15px 20px -5px rgba(22, 163, 74, 0.4)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(22, 163, 74, 0.3)"; }}
                >
                <span>📞 Contact Seller</span>
                </button>

                {/* Map */}
                <div style={styles.mapContainer}>
                <LandMap land={land} />
                </div>

                {/* Travel Info Widget */}
                <div style={styles.travelSection}>
                <div style={styles.travelHeader}>
                    <span>🚗</span> Travel Estimate (Driving)
                </div>
                
                {roadDistance ? (
                    <>
                    <div style={styles.travelStats}>
                        <div style={styles.travelStatItem}>
                        <span style={styles.statVal}>{roadDistance}</span>
                        <span style={styles.statLbl}>Distance</span>
                        </div>
                        <div style={{ borderLeft: "2px solid #dbeafe", margin: "0 5px" }}></div>
                        <div style={styles.travelStatItem}>
                        <span style={styles.statVal}>{roadDuration}</span>
                        <span style={styles.statLbl}>Est. Time</span>
                        </div>
                    </div>
                    <button
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#ffffff",
                            border: "2px solid #2563eb",
                            color: "#2563eb",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "700",
                            transition: "all 0.2s"
                        }}
                        onClick={() =>
                        window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${land.coordinates.lat},${land.coordinates.lng}`,
                            "_blank"
                        )
                        }
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#eff6ff"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
                    >
                        🗺️ Open Navigation
                    </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: "0 0 15px 0", color: "#64748b", fontSize: '0.95rem' }}>
                        Calculate distance from your location.
                    </p>
                    <button
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: "700",
                            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.5)",
                            transition: "all 0.2s"
                        }}
                        onClick={() => handleCheckDistance(land)}
                        disabled={calculatingRoute}
                        onMouseOver={(e) => { !calculatingRoute && (e.currentTarget.style.backgroundColor = "#2563eb"); }}
                        onMouseOut={(e) => { !calculatingRoute && (e.currentTarget.style.backgroundColor = "#3b82f6"); }}
                    >
                        {calculatingRoute ? "Calculating..." : "📍 Check Distance Now"}
                    </button>
                    </div>
                )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ... (Rest of the main return statement for the list remains the same as the previous version)
  return (
    <div style={styles.container}>
      <ToastContainer style={{ zIndex: 100000 }} />

      <div style={styles.headerSection} className="mt-20">
        <h2 style={styles.header}>Featured Lands</h2>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          Find your perfect plot or list your own.
        </p>
      </div>

      <div style={styles.actionBar}>
        <input
          type="text"
          placeholder="Search by City, Title, Tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button
          style={{ ...styles.btn, ...styles.btnSecondary }}
          onClick={handleNearMe}
        >
          📍 Near Me (50km)
        </button>
        {(searchTerm || filteredLands.length !== lands.length) && (
          <button
            style={{ ...styles.btn, ...styles.btnOutline, border: "1px solid #cbd5e1" }}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        )}
        <button
          style={{ ...styles.btn, ...styles.btnPrimary, marginLeft: "auto" }}
          onClick={() => (window.location.href = "/list-land")}
        >
          ➕ Sell Your Land
        </button>
      </div>

      {loading && <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#64748b" }}>Loading properties...</p>}
      {!loading && filteredLands.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "1.5rem", color: "#94a3b8" }}>No lands found matching your criteria.</p>
        </div>
      )}

      <div style={styles.grid}>
        {filteredLands.map((land) => (
          <div
            key={land._id}
            style={{
              ...styles.card,
              ...(land.status === "sold" ? { opacity: 0.8, filter: "grayscale(100%)" } : {}),
            }}
            onMouseOver={(e) => {
                if(land.status !== 'sold') {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                }
            }}
            onMouseOut={(e) => {
                if(land.status !== 'sold') {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
                }
            }}
          >
            <div
              style={{
                overflow: "hidden",
                height: "220px",
                position: "relative",
              }}
            >
              {land.status === "sold" && (
                <div style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    zIndex: 10,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}>SOLD OUT</div>
              )}
              <img
                src={
                  land.images?.[0]
                    ? `${land.images[0]}`
                    : "https://via.placeholder.com/400x300"
                }
                alt={land.title}
                style={styles.cardImage}
              />
            </div>

            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{land.title}</h3>
              <p style={styles.cardPrice}>
                ₹{parseInt(land.price).toLocaleString("en-IN")}
              </p>
              <div style={{ color: "#64748b", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "5px" }}>
                📍 {land.location}
              </div>
              {land.tags && land.tags.length > 0 && (
                <div style={styles.tagContainer}>
                  {land.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} style={styles.miniTag}>
                      #{tag}
                    </span>
                  ))}
                  {land.tags.length > 2 && <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>+{land.tags.length - 2} more</span>}
                </div>
              )}
            </div>

            {land.status === "sold" ? (
              <button
                style={{
                  ...styles.viewBtn,
                  backgroundColor: "#cbd5e1",
                  color: "#64748b",
                  cursor: "not-allowed",
                }}
                disabled
              >
                🚫 Already Sold
              </button>
            ) : (
              <button
                style={styles.viewBtn}
                onClick={() => setSelectedLandForDetails(land)}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#f8fafc")}
              >
                View Details
              </button>
            )}
          </div>
        ))}
      </div>

      {renderDetailsModal()}
      {selectedLandForContact && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedLandForContact(null)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2.5rem",
              borderRadius: "20px",
              maxWidth: "500px",
              width: "100%",
              position: 'relative',
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                ...styles.closeBtn,
                top: "15px",
                right: "15px",
                position: "absolute",
                width: "35px",
                height: "35px",
                fontSize: "1.2rem",
                background: "#f1f5f9",
                color: "#334155"
              }}
              onClick={() => setSelectedLandForContact(null)}
            >
              ×
            </button>
            <h2 style={{ textAlign: "center", marginTop: "0", color: "#1e293b", fontSize: "1.8rem" }}>
              Contact Seller
            </h2>
            <LandContactModal
              land={selectedLandForContact}
              onClose={() => setSelectedLandForContact(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandList;