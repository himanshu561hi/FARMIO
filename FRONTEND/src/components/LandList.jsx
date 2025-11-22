import React, { useState, useEffect } from "react";
import axios from "axios";
import LandMap from "./LandMap";
import LandContactModal from "./LandContactModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- HELPER: Distance Calculation ---
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
  const [lands, setLands] = useState([]);
  const [filteredLands, setFilteredLands] = useState([]);
  const [selectedLandForDetails, setSelectedLandForDetails] = useState(null);
  const [selectedLandForContact, setSelectedLandForContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Slideshow State ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roadDistance, setRoadDistance] = useState(null);
  const [roadDuration, setRoadDuration] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  useEffect(() => {
    fetchLands();
  }, []);

  // Reset Image Index & Road Data when popup opens/closes
  useEffect(() => {
    setRoadDistance(null);
    setRoadDuration(null);
    setCurrentImageIndex(0); // Reset slideshow to first image
  }, [selectedLandForDetails]);

  // ✅ NEW: Auto-Play Slideshow (3 Seconds)
  useEffect(() => {
    let intervalId;

    // Only run if modal is open AND there are multiple images
    if (
      selectedLandForDetails &&
      selectedLandForDetails.images &&
      selectedLandForDetails.images.length > 1
    ) {
      intervalId = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % selectedLandForDetails.images.length
        );
      }, 3000); // 3000ms = 3 seconds
    }

    // Cleanup interval on close or manual change
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedLandForDetails]);

  // Search Filter
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

  const fetchLands = () => {
    setLoading(true);
    axios
      .get("http://localhost:5001/api/lands")
      .then((res) => {
        const landData = res.data.lands || res.data.data || res.data;
        let validData = Array.isArray(landData) ? landData : [];
        validData = validData; // Newest first
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

  // --- SLIDESHOW HANDLERS (Manual) ---
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

  // --- STYLES ---
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
    },
    headerSection: { textAlign: "center", marginBottom: "2rem" },
    header: {
      color: "#2c3e50",
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "10px",
    },
    actionBar: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "15px",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
    },
    searchInput: {
      padding: "12px 20px",
      fontSize: "1rem",
      border: "1px solid #ddd",
      borderRadius: "50px",
      width: "300px",
      outline: "none",
    },
    btn: {
      padding: "12px 25px",
      border: "none",
      borderRadius: "50px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "0.2s",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    btnPrimary: { backgroundColor: "#27ae60", color: "white" },
    btnSecondary: { backgroundColor: "#3498db", color: "white" },
    btnOutline: {
      backgroundColor: "#fff",
      color: "#7f8c8d",
      border: "1px solid #ccc",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "2rem",
    },

    card: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      overflow: "hidden",
      transition: "transform 0.3s ease",
      display: "flex",
      flexDirection: "column",
      border: "1px solid #f1f1f1",
      position: "relative",
    },
    cardSold: {
      opacity: 0.75,
      filter: "grayscale(100%)",
      pointerEvents: "none",
    },
    soldBadge: {
      position: "absolute",
      top: "15px",
      right: "15px",
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "0.85rem",
      fontWeight: "bold",
      zIndex: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    cardImage: { width: "100%", height: "200px", objectFit: "cover" },
    cardContent: {
      padding: "1.2rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      flexGrow: 1,
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#2c3e50",
      marginBottom: "5px",
    },
    cardPrice: { color: "#27ae60", fontSize: "1.3rem", fontWeight: "bold" },
    viewBtn: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "auto",
    },

    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: "20px",
    },
    modalContent: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "700px",
      borderRadius: "20px",
      overflow: "hidden",
      position: "relative",
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
    },
    modalBody: { padding: "2rem", overflowY: "auto" },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "20px",
      background: "#f1f1f1",
      color: "#333",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      fontSize: "1.5rem",
      zIndex: 10,
    },

    // Slideshow Styles
    slideshowContainer: {
      position: "relative",
      width: "100%",
      height: "350px",
      backgroundColor: "#f0f0f0",
      borderRadius: "12px",
      overflow: "hidden",
      marginBottom: "15px",
    },
    slideImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "opacity 0.3s ease-in-out",
    },
    navBtn: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "rgba(0,0,0,0.6)",
      color: "white",
      border: "none",
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      zIndex: 10,
      transition: "0.2s",
    },
    dotsContainer: {
      position: "absolute",
      bottom: "15px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "8px",
      zIndex: 10,
    },
    dot: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.5)",
      cursor: "pointer",
      transition: "0.2s",
    },
    activeDot: { backgroundColor: "white", transform: "scale(1.2)" },

    travelSection: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#f0f9ff",
      borderRadius: "12px",
      border: "1px solid #bae6fd",
    },
    travelGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginBottom: "15px",
    },
    travelCard: {
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    travelLabel: {
      fontSize: "0.8rem",
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "5px",
    },
    travelValue: { fontSize: "1.4rem", fontWeight: "bold", color: "#0284c7" },
    directionsBtn: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#fff",
      color: "#0284c7",
      border: "1px solid #0284c7",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    checkDistBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0284c7",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    contactBtnInModal: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",
    },
    tagContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
      marginTop: "5px",
    },
    miniTag: {
      fontSize: "0.75rem",
      backgroundColor: "#e0f7fa",
      color: "#006064",
      padding: "2px 8px",
      borderRadius: "10px",
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
          >
            ×
          </button>

          {/* Slideshow */}
          <div style={styles.slideshowContainer}>
            <img
              src={
                images.length > 0
                  ? `http://localhost:5001${images[currentImageIndex]}`
                  : "https://via.placeholder.com/500x300?text=No+Image"
              }
              style={styles.slideImg}
              alt={`Slide ${currentImageIndex}`}
            />

            {hasMultiple && (
              <>
                <button
                  style={{ ...styles.navBtn, left: "15px" }}
                  onClick={(e) => prevImage(e, images)}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0,0,0,0.8)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0,0,0,0.6)")
                  }
                >
                  ‹
                </button>
                <button
                  style={{ ...styles.navBtn, right: "15px" }}
                  onClick={(e) => nextImage(e, images)}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "rgba(0,0,0,0.8)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "rgba(0,0,0,0.6)")
                  }
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

          <div style={styles.modalBody}>
            <h2 style={{ color: "#2c3e50", marginBottom: "5px" }}>
              {land.title}
            </h2>
            <p style={styles.cardPrice}>
              ₹{parseInt(land.price).toLocaleString("en-IN")}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px 0",
                color: "#555",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <span>📍 {land.location}</span>
              <span>📐 {land.area}</span>
            </div>
            {land.tags && land.tags.length > 0 && (
              <div
                style={{ marginBottom: "15px", display: "flex", gap: "8px" }}
              >
                {land.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.miniTag,
                      fontSize: "0.9rem",
                      padding: "5px 10px",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div style={styles.travelSection}>
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1.1rem",
                  color: "#0f172a",
                  marginBottom: "15px",
                }}
              >
                🚗 Road Travel Info
              </h3>
              {roadDistance ? (
                <>
                  <div style={styles.travelGrid}>
                    <div style={styles.travelCard}>
                      <div style={styles.travelLabel}>Distance</div>
                      <div style={styles.travelValue}>{roadDistance}</div>
                    </div>
                    <div style={styles.travelCard}>
                      <div style={styles.travelLabel}>Duration</div>
                      <div style={styles.travelValue}>{roadDuration}</div>
                    </div>
                  </div>
                  <button
                    style={styles.directionsBtn}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${land.coordinates.lat},${land.coordinates.lng}`,
                        "_blank"
                      )
                    }
                  >
                    🗺️ Open Navigation
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ marginBottom: "10px", color: "#64748b" }}>
                    Check driving distance.
                  </p>
                  <button
                    style={styles.checkDistBtn}
                    onClick={() => handleCheckDistance(land)}
                    disabled={calculatingRoute}
                  >
                    {calculatingRoute ? "Calculating..." : "📍 Check Distance"}
                  </button>
                </div>
              )}
            </div>
            <p style={{ color: "#666", lineHeight: "1.6", marginTop: "15px" }}>
              {land.description}
            </p>
            <div
              style={{
                height: "200px",
                marginTop: "20px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <LandMap land={land} />
            </div>
            <button
              style={styles.contactBtnInModal}
              onClick={() => {
                setSelectedLandForContact(land);
                setSelectedLandForDetails(null);
              }}
            >
              📞 Contact Seller
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <ToastContainer style={{ zIndex: 100000 }} />

      <div style={styles.headerSection} className="mt-20">
        <h2 style={styles.header}>Featured Lands</h2>
        <p style={{ color: "#7f8c8d" }}>
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
            style={{ ...styles.btn, ...styles.btnOutline }}
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

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!loading && filteredLands.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>No lands found.</p>
      )}

      <div style={styles.grid}>
        {filteredLands.map((land) => (
          <div
            key={land._id}
            style={{
              ...styles.card,
              ...(land.status === "sold" ? styles.cardSold : {}),
            }}
          >
            <div
              style={{
                overflow: "hidden",
                height: "200px",
                position: "relative",
              }}
            >
              {land.status === "sold" && (
                <div style={styles.soldBadge}>SOLD OUT</div>
              )}
              <img
                src={
                  land.images?.[0]
                    ? `${land.images[0]}`
                    : "https://via.placeholder.com/300x200"
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
              <div style={{ color: "#7f8c8d", fontSize: "0.95rem" }}>
                📍 {land.location}
              </div>
              {land.tags && land.tags.length > 0 && (
                <div style={styles.tagContainer}>
                  {land.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} style={styles.miniTag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {land.status === "sold" ? (
              <button
                style={{
                  ...styles.viewBtn,
                  backgroundColor: "#95a5a6",
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
              padding: "2rem",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                ...styles.closeBtn,
                top: "10px",
                right: "10px",
                position: "relative",
                float: "right",
              }}
              onClick={() => setSelectedLandForContact(null)}
            >
              ×
            </button>
            <h2 style={{ textAlign: "center", marginTop: "0" }}>
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
