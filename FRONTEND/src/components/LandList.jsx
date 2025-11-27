
import React, { useState, useEffect } from "react";
import axios from "axios";
import LandMap from "./LandMap";
import LandContactModal from "./LandContactModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from '../config';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roadDistance, setRoadDistance] = useState(null);
  const [roadDuration, setRoadDuration] = useState(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

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

  const renderDetailsModal = () => {
    if (!selectedLandForDetails) return null;
    const land = selectedLandForDetails;
    const images = land.images || [];
    const hasMultiple = images.length > 1;

    return (
      <div
        className="modal-overlay"
        onClick={() => setSelectedLandForDetails(null)}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button
            className="close-btn"
            onClick={() => setSelectedLandForDetails(null)}
          >
            ×
          </button>

          <div className="slideshow-container">
            <img
              src={
                images.length > 0
                  ? `${images[currentImageIndex]}`
                  : "https://via.placeholder.com/800x400?text=No+Image"
              }
              className="slide-img"
              alt={`Slide ${currentImageIndex}`}
            />

            {hasMultiple && (
              <>
                <button
                  className="nav-btn nav-btn-left"
                  onClick={(e) => prevImage(e, images)}
                >
                  ‹
                </button>
                <button
                  className="nav-btn nav-btn-right"
                  onClick={(e) => nextImage(e, images)}
                >
                  ›
                </button>

                <div className="dots-container">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`dot ${idx === currentImageIndex ? 'active-dot' : ''}`}
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

          <div className="modal-body-grid">
            <div className="modal-main-content">
              <div>
                <h2 className="modal-title">{land.title}</h2>
                <p className="modal-date">📅 Listed on {new Date(land.createdAt || Date.now()).toLocaleDateString()}</p>
                <div className="modal-price">
                  ₹{parseInt(land.price).toLocaleString("en-IN")}
                </div>
              </div>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-label">📍 Location</div>
                  <div className="feature-value">{land.location}</div>
                </div>
                <div className="feature-card feature-card-middle">
                  <div className="feature-label">📐 Area</div>
                  <div className="feature-value">{land.area}</div>
                </div>
                <div className="feature-card">
                  <div className="feature-label">🏷️ Status</div>
                  <div className={`feature-value ${land.status === 'sold' ? 'status-sold' : 'status-available'}`}>
                    {land.status || 'Available'}
                  </div>
                </div>
              </div>

              {land.tags && land.tags.length > 0 && (
                <div className="tags-section">
                  <h4 className="section-title">Keywords</h4>
                  <div className="tag-container">
                    {land.tags.map((tag, i) => (
                      <span key={i} className="mini-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="section-title">About this land</h3>
                <p className="description-text">
                  {land.description}
                </p>
              </div>
            </div>

            <div className="modal-sidebar">
              <button
                className="contact-btn-in-modal"
                onClick={() => {
                  setSelectedLandForContact(land);
                  setSelectedLandForDetails(null);
                }}
              >
                <span>📞 Contact Seller</span>
              </button>

              <div className="map-container">
                <LandMap land={land} />
              </div>

              <div className="travel-section">
                <div className="travel-header">
                  <span>🚗</span> Travel Estimate (Driving)
                </div>

                {roadDistance ? (
                  <>
                    <div className="travel-stats">
                      <div className="travel-stat-item">
                        <span className="stat-val">{roadDistance}</span>
                        <span className="stat-lbl">Distance</span>
                      </div>
                      <div className="stat-divider"></div>
                      <div className="travel-stat-item">
                        <span className="stat-val">{roadDuration}</span>
                        <span className="stat-lbl">Est. Time</span>
                      </div>
                    </div>
                    <button
                      className="nav-button"
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
                  <div className="calc-distance-section">
                    <p className="calc-distance-text">
                      Calculate distance from your location.
                    </p>
                    <button
                      className="calc-distance-btn"
                      onClick={() => handleCheckDistance(land)}
                      disabled={calculatingRoute}
                    >
                      {calculatingRoute ? "Calculating..." : "📍 Check Distance Now"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(15, 23, 42, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 20px;
            animation: fadeIn 0.2s ease-out;
          }

          .modal-content {
            background-color: white;
            width: 100%;
            max-width: 950px;
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            max-height: 95vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 1.5rem;
            z-index: 30;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            transition: transform 0.2s, background 0.2s;
          }

          .close-btn:hover {
            background: rgba(0, 0, 0, 0.7);
            transform: scale(1.1);
          }

          .slideshow-container {
            position: relative;
            width: 100%;
            height: 280px;
            background-color: #e2e8f0;
          }

          .slide-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0,0,0,0.3);
            color: white;
            border: 1px solid rgba(255,255,255,0.5);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            z-index: 20;
            transition: all 0.2s;
            backdrop-filter: blur(2px);
          }

          .nav-btn:hover {
            background-color: rgba(0,0,0,0.6);
          }

          .nav-btn-left {
            left: 20px;
          }

          .nav-btn-right {
            right: 20px;
          }

          .dots-container {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 20;
            padding: 6px 10px;
            background: rgba(0,0,0,0.4);
            border-radius: 20px;
            backdrop-filter: blur(4px);
          }

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(255,255,255,0.4);
            cursor: pointer;
            transition: 0.3s;
          }

          .active-dot {
            background-color: white;
            transform: scale(1.2);
          }

          .modal-body-grid {
            display: grid;
            grid-template-columns: 3fr 2fr;
            gap: 30px;
            padding: 30px;
            overflow-y: auto;
            align-items: start;
            background-color: #f8fafc;
          }

          .modal-sidebar {
            position: sticky;
            top: 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .modal-title {
            font-size: 2.2rem;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
            font-weight: 800;
          }

          .modal-date {
            color: #64748b;
            margin-top: 8px;
            font-size: 0.95rem;
          }

          .modal-price {
            font-size: 2.2rem;
            font-weight: 800;
            color: #16a34a;
            margin-top: 10px;
          }

          .feature-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 25px 0;
            padding: 20px;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          .feature-card {
            text-align: center;
          }

          .feature-card-middle {
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
          }

          .feature-label {
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .feature-value {
            font-size: 1.2rem;
            font-weight: 700;
            color: #334155;
            text-transform: capitalize;
          }

          .status-sold {
            color: #ef4444;
          }

          .status-available {
            color: #16a34a;
          }

          .section-title {
            font-size: 1.1rem;
            color: #1e293b;
            margin-bottom: 12px;
            font-weight: 700;
          }

          .tags-section {
            margin-bottom: 30px;
          }

          .tag-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
          }

          .mini-tag {
            font-size: 0.85rem;
            background-color: #e0f2fe;
            color: #0369a1;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            border: 1px solid #bae6fd;
          }

          .description-text {
            color: #475569;
            line-height: 1.8;
            font-size: 1rem;
            white-space: pre-line;
          }

          .map-container {
            height: 220px;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          .travel-section {
            padding: 20px;
            background-color: white;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          .travel-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            color: #1e40af;
            font-size: 1rem;
            font-weight: 700;
          }

          .travel-stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 15px;
            background-color: #eff6ff;
            padding: 15px;
            border-radius: 12px;
          }

          .travel-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .stat-divider {
            border-left: 2px solid #dbeafe;
            margin: 0 5px;
          }

          .stat-val {
            font-size: 1.4rem;
            font-weight: 800;
            color: #2563eb;
          }

          .stat-lbl {
            font-size: 0.8rem;
            color: #60a5fa;
            margin-top: 4px;
          }

          .nav-button {
            width: 100%;
            padding: 12px;
            background-color: #ffffff;
            border: 2px solid #2563eb;
            color: #2563eb;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            transition: all 0.2s;
          }

          .nav-button:hover {
            background-color: #eff6ff;
          }

          .calc-distance-section {
            text-align: center;
          }

          .calc-distance-text {
            margin: 0 0 15px 0;
            color: #64748b;
            font-size: 0.95rem;
          }

          .calc-distance-btn {
            width: 100%;
            padding: 12px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
            transition: all 0.2s;
          }

          .calc-distance-btn:hover:not(:disabled) {
            background-color: #2563eb;
          }

          .calc-distance-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .contact-btn-in-modal {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .contact-btn-in-modal:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 20px -5px rgba(22, 163, 74, 0.4);
          }

          @media (max-width: 768px) {
            .modal-overlay {
              padding: 10px;
            }

            .modal-content {
              max-height: 98vh;
              border-radius: 16px;
            }

            .slideshow-container {
              height: 200px;
            }

            .modal-body-grid {
              grid-template-columns: 1fr;
              gap: 20px;
              padding: 20px;
            }

            .modal-sidebar {
              position: static;
            }

            .modal-title {
              font-size: 1.6rem;
            }

            .modal-price {
              font-size: 1.8rem;
            }

            .feature-grid {
              grid-template-columns: 1fr;
              gap: 12px;
              padding: 15px;
            }

            .feature-card-middle {
              border-left: none;
              border-right: none;
              border-top: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
              padding: 10px 0;
            }

            .nav-btn {
              width: 36px;
              height: 36px;
              font-size: 1.5rem;
            }

            .nav-btn-left {
              left: 10px;
            }

            .nav-btn-right {
              right: 10px;
            }

            .contact-btn-in-modal {
              font-size: 1rem;
              padding: 14px;
            }
          }

          @media (max-width: 480px) {
            .modal-title {
              font-size: 1.4rem;
            }

            .modal-price {
              font-size: 1.5rem;
            }

            .feature-label {
              font-size: 0.75rem;
            }

            .feature-value {
              font-size: 1rem;
            }

            .description-text {
              font-size: 0.95rem;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="land-list-container">

      <div className="header-section">
        <div className="header-decoration pt-5">
          <span className="crop-icon">🌾</span>
        </div>
        <h2 className="header">Discover Agricultural Lands</h2>
        <p className="subheader">
          Find your perfect farmland or list your agricultural property
        </p>
      </div>

      <div className="action-bar">
        <input
          type="text"
          placeholder="Search by City, Title, Tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button
          className="btn btn-secondary"
          onClick={handleNearMe}
        >
          📍 Near Me (50km)
        </button>
        {(searchTerm || filteredLands.length !== lands.length) && (
          <button
            className="btn btn-outline"
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        )}
        <button
          className="btn btn-primary btn-sell"
          onClick={() => (window.location.href = "/list-land")}
        >
          ➕ Sell Your Land
        </button>
      </div>

      {loading && <p className="loading-text">Loading properties...</p>}
      {!loading && filteredLands.length === 0 && (
        <div className="no-results">
          <p>No lands found matching your criteria.</p>
        </div>
      )}

      <div className="land-grid">
        {filteredLands.map((land) => (
          <div
            key={land._id}
            className={`land-card ${land.status === "sold" ? "land-card-sold" : ""}`}
          >
            <div className="card-image-wrapper">
              {land.status === "sold" && (
                <div className="sold-badge">SOLD OUT</div>
              )}
              <img
                src={
                  land.images?.[0]
                    ? `${land.images[0]}`
                    : "https://via.placeholder.com/400x300"
                }
                alt={land.title}
                className="card-image"
              />
            </div>

            <div className="card-content">
              <h3 className="card-title">{land.title}</h3>
              <p className="card-price">
                ₹{parseInt(land.price).toLocaleString("en-IN")}
              </p>
              <div className="card-location">
                📍 {land.location}
              </div>
              {land.tags && land.tags.length > 0 && (
                <div className="card-tags">
                  {land.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="card-tag">
                      #{tag}
                    </span>
                  ))}
                  {land.tags.length > 2 && (
                    <span className="card-more-tags">+{land.tags.length - 2} more</span>
                  )}
                </div>
              )}
            </div>

            {land.status === "sold" ? (
              <button className="view-btn view-btn-sold" disabled>
                🚫 Already Sold
              </button>
            ) : (
              <button
                className="view-btn"
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
          className="contact-modal-overlay"
          onClick={() => setSelectedLandForContact(null)}
        >
          <div
            className="contact-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="contact-modal-close"
              onClick={() => setSelectedLandForContact(null)}
            >
              ×
            </button>
            <h2 className="contact-modal-title">
              Contact Seller
            </h2>
            <LandContactModal
              land={selectedLandForContact}
              onClose={() => setSelectedLandForContact(null)}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .land-list-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3.5rem;
          margin-top: 2rem;
          position: relative;
        }

        .header-decoration {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          animation: sway 3s ease-in-out infinite;
        }

        .crop-icon {
          font-size: 3.5rem;
          filter: drop-shadow(0 4px 6px rgba(22, 163, 74, 0.2));
        }

        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }

        .header {
          color: #15803d;
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subheader {
          color: #6b7280;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        .action-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
          padding: 25px;
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border-radius: 24px;
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.08);
          border: 2px solid #dcfce7;
          position: relative;
          overflow: hidden;
        }

        .action-bar::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .search-input {
          padding: 14px 24px;
          font-size: 1rem;
          border: 2px solid #dcfce7;
          border-radius: 50px;
          width: 100%;
          max-width: 350px;
          outline: none;
          transition: all 0.3s;
          background-color: white;
          color: #1f2937;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-input:focus {
          border-color: #22c55e;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .btn {
          padding: 12px 28px;
          border: none;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          color: white;
        }

        .btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
        }

        .btn-outline {
          background: white;
          color: #16a34a;
          border: 2px solid #86efac;
          font-weight: 700;
        }

        .btn-outline:hover {
          background-color: #f0fdf4;
          border-color: #16a34a;
        }

        .btn-sell {
          margin-left: auto;
          position: relative;
          z-index: 1;
        }

        .loading-text {
          text-align: center;
          font-size: 1.2rem;
          color: #6b7280;
          padding: 40px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .no-results {
          text-align: center;
          padding: 60px 40px;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border-radius: 24px;
          border: 2px dashed #dcfce7;
        }

        .no-results p {
          font-size: 1.5rem;
          color: #6b7280;
          margin: 0;
        }

        .land-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .land-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.08);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          border: 2px solid #e5e7eb;
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
        }

        .land-card:not(.land-card-sold):hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(22, 163, 74, 0.2);
          border-color: #86efac;
        }

        .land-card-sold {
          opacity: 0.7;
          filter: grayscale(60%);
        }

        .card-image-wrapper {
          overflow: hidden;
          height: 220px;
          position: relative;
          background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
        }

        .card-image-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(22, 163, 74, 0.1) 100%);
          pointer-events: none;
        }

        .sold-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: bold;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .land-card:hover .card-image {
          transform: scale(1.08);
        }

        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1.4;
        }

        .card-price {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
        }

        .card-location {
          color: #6b7280;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }

        .card-tag {
          font-size: 0.8rem;
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #15803d;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          border: 1px solid #86efac;
        }

        .card-more-tags {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .view-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          color: #15803d;
          border: none;
          border-top: 2px solid #dcfce7;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: auto;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.95rem;
        }

        .view-btn:hover {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #15803d;
        }

        .view-btn-sold {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
          border-top-color: #e5e7eb;
        }

        .contact-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
        }

        .contact-modal-content {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          padding: 2.5rem;
          border-radius: 24px;
          max-width: 500px;
          width: 100%;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(22, 163, 74, 0.25);
          border: 2px solid #dcfce7;
        }

        .contact-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          background: #f0fdf4;
          color: #15803d;
          border: 2px solid #dcfce7;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-weight: bold;
        }

        .contact-modal-close:hover {
          background: #dcfce7;
          transform: rotate(90deg);
        }

        .contact-modal-title {
          text-align: center;
          margin-top: 0;
          background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 1.8rem;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .land-list-container {
            padding: 1rem;
          }

          .header-section {
            margin-top: 2rem;
            margin-bottom: 2rem;
          }

          .header {
            font-size: 2rem;
          }

          .subheader {
            font-size: 1rem;
          }

          .crop-icon {
            font-size: 2.5rem;
          }

          .action-bar {
            padding: 15px;
            gap: 10px;
          }

          .search-input {
            max-width: 100%;
          }

          .btn {
            padding: 10px 20px;
            font-size: 0.9rem;
            width: 100%;
            justify-content: center;
          }

          .btn-sell {
            margin-left: 0;
          }

          .land-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-modal-content {
            padding: 1.5rem;
          }

          .contact-modal-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .header {
            font-size: 1.8rem;
          }

          .subheader {
            font-size: 0.95rem;
          }

          .btn {
            font-size: 0.85rem;
            padding: 10px 16px;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .card-price {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandList;
