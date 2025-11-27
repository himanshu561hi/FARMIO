
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// // Map Imports
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // API Imports
// import {
//   getListings,
//   getOrders,
//   deleteListing,
//   getEarnings,
//   updateUpiId,
//   requestWithdrawal,
//   acceptOrder,
//   rejectOrder,
//   fetchMyListings,
//   fetchMyBookings,
//   fetchIncomingRentalRequests,
//   updateRentalStatus,
//   toggleRentalStatus, 
//   deleteRental      
// } from "../utils/api";

// // Components
// import ProductCard from "../components/ProductCard";
// import ProfileSection from "../components/ProfileSection";

// // Charts
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";

// // Utils & Assets
// import { useTranslation } from "react-i18next";
// import "../utils/i18n";
// import backgroundImage from "../assets/12.jpg";
// import toast from "react-hot-toast"; // Styling is handled in App.jsx

// // Icons
// import {
//   FaMoneyBillWave,
//   FaWarehouse,
//   FaChartLine,
//   FaWallet,
//   FaRegSadTear,
//   FaPlusCircle,
//   FaTractor,
//   FaTools,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaUser,
//   FaPowerOff,
//   FaTrash,
//   FaExclamationCircle,
//   FaMapMarkerAlt,
//   FaLocationArrow,
//   FaIdCard,
//   FaBan
// } from "react-icons/fa";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// // --- MAP HELPER COMPONENT ---
// const LocationMarker = ({ position, setPosition }) => {
//   const map = useMapEvents({
//     click(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//     },
//   });

//   // Fix for default Leaflet icon in React
//   const customIcon = new L.Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//     iconSize: [35, 35],
//     iconAnchor: [17, 35],
//   });

//   return position === null ? null : (
//     <Marker position={position} icon={customIcon} />
//   );
// };

// const FarmerDashboard = ({ user }) => {
//   const { t, i18n } = useTranslation();

//   // --- STATE MANAGEMENT ---
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 1. Produce (Crops) Data
//   const [listings, setListings] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [earnings, setEarnings] = useState({
//     totalEarnings: 0,
//     totalOrderAmount: 0,
//     weeklyEarnings: [],
//     monthlyEarnings: [],
//   });
//   const [rejectionMessage, setRejectionMessage] = useState({});

//   // 2. Rental (Machinery) Data
//   const [myMachines, setMyMachines] = useState([]);
//   const [myRentals, setMyRentals] = useState([]);
//   const [incomingRentalRequests, setIncomingRentalRequests] = useState([]);
//   const [rentalRejectionMsg, setRentalRejectionMsg] = useState({});

//   // --- MODAL STATES ---
  
//   // A. Approval Modal (Map + Address)
//   const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [pickupAddress, setPickupAddress] = useState("");
//   const [isLicenseRequired, setIsLicenseRequired] = useState(false); 
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [mapPosition, setMapPosition] = useState({ lat: 20.5937, lng: 78.9629 }); // India Center

//   // B. Stop Machine Modal (Reason Input)
//   const [isStopModalOpen, setIsStopModalOpen] = useState(false);
//   const [machineToStop, setMachineToStop] = useState(null);
//   const [stopReason, setStopReason] = useState("");

//   // C. Delete Confirmation Modal
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [machineToDelete, setMachineToDelete] = useState(null);

//   // 3. Wallet Data
//   const [upiId, setUpiId] = useState("");
//   const [withdrawalAmount, setWithdrawalAmount] = useState("");

//   // --- FETCH DATA ---
//   const fetchData = async () => {
//     if (!user) return;
//     try {
//       const token = localStorage.getItem("token");

//       const [
//         listingsData,
//         ordersData,
//         earningsData,
//         myMachinesData,
//         myRentalsData,
//         incomingRequestsData,
//       ] = await Promise.all([
//         getListings(),
//         getOrders(token),
//         getEarnings(token),
//         fetchMyListings(token),
//         fetchMyBookings(token),
//         fetchIncomingRentalRequests(token),
//       ]);

//       setListings(
//         listingsData.data.filter(
//           (listing) => listing?.farmer?._id === user.id
//         ) || []
//       );
//       setOrders(Array.isArray(ordersData) ? ordersData : []);
//       setEarnings(earningsData.data);
//       setMyMachines(myMachinesData.data || []);
//       setMyRentals(myRentalsData.data || []);
//       setIncomingRentalRequests(incomingRequestsData.data || []);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(error.response?.data?.message || t("error.fetchingData"));
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [user, i18n]);

//   // =========================================
//   //        RENTAL HANDLERS
//   // =========================================

//   // 1. Approval Flow
//   const openApproveModal = (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setPickupAddress(""); 
//     setIsLicenseRequired(false);
//     setMapPosition({ lat: 20.5937, lng: 78.9629 }); // Reset Map
//     setIsApproveModalOpen(true);
//   };

//   const handleGetCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser");
//       return;
//     }

//     setGettingLocation(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setMapPosition({ lat: latitude, lng: longitude });
//         setGettingLocation(false);
//         toast.success("Location Found! 📍");
//       },
//       (error) => {
//         console.error(error);
//         toast.error("Unable to retrieve location");
//         setGettingLocation(false);
//       }
//     );
//   };

//   const handleConfirmApproval = async () => {
//     const mapLink = `https://www.google.com/maps?q=${mapPosition.lat},${mapPosition.lng}`;
//     const finalPickupLocation = `${pickupAddress}\n\n📍 Map Location: ${mapLink}`;

//     if (!pickupAddress.trim()) {
//       toast.error("Please enter manual address details");
//       return;
//     }

//     try {
//       await updateRentalStatus(
//         { 
//           bookingId: selectedBookingId, 
//           status: "Confirmed", 
//           pickupLocation: finalPickupLocation, 
//           isLicenseRequired: isLicenseRequired 
//         },
//         localStorage.getItem("token")
//       );

//       setIncomingRentalRequests((prev) =>
//         prev.map((req) =>
//           req._id === selectedBookingId ? { ...req, status: "Confirmed" } : req
//         )
//       );
      
//       toast.success("Booking Approved! Email sent.");
//       setIsApproveModalOpen(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to approve booking");
//     }
//   };

//   const handleRejectRental = async (bookingId) => {
//     const message = rentalRejectionMsg[bookingId] || "";
//     if (!message.trim()) {
//       toast.error(t("error.rejectionMessageRequired"));
//       return;
//     }
//     try {
//       await updateRentalStatus(
//         { bookingId, status: "Cancelled", rejectionReason: message },
//         localStorage.getItem("token")
//       );
//       setIncomingRentalRequests((prev) =>
//         prev.map((req) =>
//           req._id === bookingId ? { ...req, status: "Cancelled" } : req
//         )
//       );
//       setRentalRejectionMsg((prev) => ({ ...prev, [bookingId]: "" }));
//       toast.success(t("success.orderRejected"));
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   // 2. Delete Flow (Using Modal)
//   const confirmDeleteMachine = (machineId) => {
//     setMachineToDelete(machineId);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteMachine = async () => {
//     if (!machineToDelete) return;
    
//     try {
//       await deleteRental(machineToDelete, localStorage.getItem('token'));
//       setMyMachines(myMachines.filter(m => m._id !== machineToDelete));
//       toast.success("Machine deleted successfully");
//       setIsDeleteModalOpen(false);
//     } catch (err) {
//       toast.error("Failed to delete machine");
//     }
//   };

//   // 3. Toggle Status Flow (Using Modal)
//   const initiateToggleStatus = (machine) => {
//     if (machine.available) {
//       // Stop -> Ask Reason
//       setMachineToStop(machine);
//       setStopReason("");
//       setIsStopModalOpen(true);
//     } else {
//       // Start -> Direct
//       handleToggleStatus(machine, "");
//     }
//   };

//   const handleStopConfirm = () => {
//     if (!stopReason.trim()) {
//       toast.error("Please provide a reason");
//       return;
//     }
//     handleToggleStatus(machineToStop, stopReason);
//     setIsStopModalOpen(false);
//   };

//   const handleToggleStatus = async (machine, reason) => {
//     try {
//       const { data } = await toggleRentalStatus(machine._id, reason, localStorage.getItem('token'));
//       setMyMachines(myMachines.map(m => m._id === machine._id ? data : m));
      
//       if(data.available) toast.success("Machine is Active ✅");
//       else toast.success("Machine Stopped 🛑");
      
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   // =========================================
//   //      EXISTING HANDLERS (PRODUCE)
//   // =========================================
  
//   const handleDelete = async (listingId) => {
//     if (!window.confirm(t("confirm.deleteListing"))) return;
//     try {
//       await deleteListing(listingId, localStorage.getItem("token"));
//       setListings(listings.filter((l) => l._id !== listingId));
//       toast.success(t("success.listingDeleted"));
//     } catch (error) {
//       toast.error(t("error.deletingListing"));
//     }
//   };

//   const handleAcceptOrder = async (orderId) => {
//     try {
//       await acceptOrder({ orderId }, localStorage.getItem("token"));
//       setOrders(orders.map((order) => order._id === orderId ? { ...order, status: "accepted" } : order));
//       toast.success(t("success.orderAccepted"));
//     } catch (error) {
//       toast.error(t("error.acceptingOrder"));
//     }
//   };

//   const handleRejectOrder = async (orderId) => {
//     const message = rejectionMessage[orderId] || "";
//     if (!message) {
//       toast.error(t("error.rejectionMessageRequired"));
//       return;
//     }
//     try {
//       await rejectOrder({ orderId, rejectionMessage: message }, localStorage.getItem("token"));
//       setOrders(orders.map((order) => order._id === orderId ? { ...order, status: "rejected", rejectionMessage: message } : order));
//       setRejectionMessage({ ...rejectionMessage, [orderId]: "" });
//       toast.success(t("success.orderRejected"));
//     } catch (error) {
//       toast.error(t("error.rejectingOrder"));
//     }
//   };

//   const handleUpiSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateUpiId({ upiId }, localStorage.getItem("token"));
//       toast.success(t("success.upiUpdated"));
//     } catch (error) {
//       toast.error(t("error.updatingUpi"));
//     }
//   };

//   const handleWithdrawalSubmit = async (e) => {
//     e.preventDefault();
//     const amount = parseFloat(withdrawalAmount);
//     if (amount <= 0 || amount > earnings.totalEarnings) {
//       toast.error(t("error.invalidAmount"));
//       return;
//     }
//     try {
//       await requestWithdrawal({ amount }, localStorage.getItem("token"));
//       setWithdrawalAmount("");
//       toast.success(t("success.withdrawalRequested"));
//     } catch (error) {
//       toast.error(t("error.requestingWithdrawal"));
//     }
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString("en-IN", {
//       day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true,
//     });
//   };

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem("language", lang);
//   };

//   const chartData = (data, label, color) => ({
//     labels: data.map((item) => item.date),
//     datasets: [{ label, data: data.map((item) => item.earnings), borderColor: color, backgroundColor: `${color.replace("1)", "0.4)")}`, fill: true, tension: 0.4 }],
//   });
//   const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

//   if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div></div>;

//   return (
//     <div className="min-h-screen bg-cover bg-center flex flex-col relative"
//       style={{ backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(20, 83, 45, 0.98)), url(${backgroundImage})`, backgroundAttachment: "fixed" }}>
      
//       <div className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8 backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl border border-white/20">
//           <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
//             <FaTractor className="text-yellow-400" /> {t("farmerDashboard")}
//           </h2>
//           <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className="p-2 bg-slate-800 text-white rounded border border-white/20 cursor-pointer focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base">
//             <option value="en">English</option>
//             <option value="hi">हिंदी (Hindi)</option>
//             <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
//             <option value="hr">हरियाणवी (Haryanvi)</option>
//             <option value="bho">भोजपुरी (Bhojpuri)</option>
//             <option value="ta">தமிழ் (Tamil)</option>
//             <option value="mr">मराठी (Marathi)</option>
//             <option value="kn">ಕನ್ನಡ (Kannada)</option>
//           </select>
//         </div>

//         {/* PROFILE */}
//         <div className="mb-8 w-full backdrop-blur-sm bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10">
//           <ProfileSection user={user} />
//         </div>

//         {/* RENTAL MARKETPLACE SECTION */}
//         <div className="mb-10">
//           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-orange-500 pl-4">
//             🚜 {t('farmMachineryTitle')}
//           </h3>

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
//             {/* A. MY EQUIPMENT (Owner View) */}
//             <div className="backdrop-blur-md bg-gradient-to-br from-orange-900/50 to-red-950/50 rounded-2xl p-6 shadow-2xl border border-orange-500/30">
//               <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-3">
//                 <h4 className="text-xl font-bold text-white flex items-center gap-2">
//                   <FaTools className="text-orange-400" /> {t('myEquipmentTitle')}
//                 </h4>
//                 <Link to="/rental/add" className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1 transition">
//                   <FaPlusCircle /> {t('addMachine')}
//                 </Link>
//               </div>

//               {myMachines.length === 0 ? (
//                 <p className="text-orange-200 text-sm italic">{t('noMachinesListed')}</p>
//               ) : (
//                 <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//                   {myMachines.map((machine) => {
//                     const machineRequests = incomingRentalRequests.filter(req => req.rental && req.rental._id === machine._id);
//                     const isAvailable = machine.available !== false; 

//                     return (
//                       <div key={machine._id} className={`p-4 rounded-xl border border-white/10 relative transition-colors ${isAvailable ? 'bg-black/30' : 'bg-red-900/20'}`}>
                        
//                         {/* Status Badge */}
//                         <div className="absolute top-2 right-2 z-10">
//                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isAvailable ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
//                             {isAvailable ? "Active" : "Stopped"}
//                           </span>
//                         </div>

//                         {/* Info */}
//                         <div className="flex gap-4 mb-3">
//                           <img src={machine.image} alt={machine.name} className={`w-16 h-16 object-cover rounded-lg border ${isAvailable ? 'border-orange-500/50' : 'border-gray-600 grayscale'}`} />
//                           <div>
//                             <h5 className="font-bold text-white text-lg">{machine.name}</h5>
//                             <p className="text-orange-300 text-xs uppercase font-semibold">₹{machine.pricePerHour}/{t('hour')} • {machine.category}</p>
//                             {!isAvailable && machine.unavailabilityReason && (
//                                 <p className="text-red-300 text-xs mt-1 flex items-center gap-1 bg-red-950/50 px-2 py-0.5 rounded">
//                                    <FaExclamationCircle/> {machine.unavailabilityReason}
//                                 </p>
//                             )}
//                           </div>
//                         </div>

//                         {/* Controls */}
//                         <div className="flex gap-2 mb-3">
//                             <button 
//                                 onClick={() => initiateToggleStatus(machine)} 
//                                 className={`flex-1 text-xs py-2 rounded font-bold flex justify-center items-center gap-2 transition ${isAvailable ? 'bg-yellow-600/80 hover:bg-yellow-700 text-white' : 'bg-green-600/80 hover:bg-green-700 text-white'}`}
//                             >
//                                 {isAvailable ? <><FaPowerOff /> Stop Booking</> : <><FaCheckCircle /> Start Booking</>}
//                             </button>
                            
//                             <button 
//                                 onClick={() => confirmDeleteMachine(machine._id)} 
//                                 className="px-3 bg-red-600/80 hover:bg-red-700 text-white rounded flex justify-center items-center"
//                             >
//                                 <FaTrash />
//                             </button>
//                         </div>

//                         {/* Requests */}
//                         <div className="bg-white/5 rounded-lg p-3">
//                           <p className="text-xs text-gray-300 mb-2 uppercase tracking-wide font-bold">{t('bookingRequests')} ({machineRequests.length})</p>
//                           {machineRequests.length === 0 ? (
//                             <p className="text-gray-500 text-xs italic">{t('noPendingRequests')}</p>
//                           ) : (
//                             <div className="space-y-3">
//                               {machineRequests.map((req) => (
//                                 <div key={req._id} className="bg-black/40 p-3 rounded flex flex-col gap-2 border border-white/5">
//                                   <div className="flex justify-between items-start">
//                                     <div>
//                                       <p className="text-white text-sm font-semibold flex items-center gap-2">
//                                         <FaUser className="text-orange-400 text-xs" /> {req.renter?.name || t('farmer')}
//                                       </p>
//                                       <p className="text-xs text-gray-400 mt-1">{t('from')}: {formatDateTime(req.startDate)} <br /> {t('to')}: {formatDateTime(req.endDate)}</p>
//                                       <p className="text-xs text-green-400 font-bold mt-1">{t('total')}: ₹{req.totalPrice}</p>
//                                     </div>
//                                     <span className={`text-xs px-2 py-1 rounded border ${req.status === "Confirmed" ? "bg-green-500/20 text-green-400 border-green-500" : req.status === "Cancelled" ? "bg-red-500/20 text-red-400 border-red-500" : "bg-yellow-500/20 text-yellow-400 border-yellow-500"}`}>{req.status}</span>
//                                   </div>
//                                   {req.status === "Pending" && (
//                                     <div className="mt-2 pt-2 border-t border-white/10">
//                                       <input type="text" placeholder={t('enterRejectReason')} className="w-full text-xs p-2 rounded bg-white/10 text-white mb-2 border border-white/10 focus:border-orange-500 outline-none" value={rentalRejectionMsg[req._id] || ""} onChange={(e) => setRentalRejectionMsg({ ...rentalRejectionMsg, [req._id]: e.target.value })} />
//                                       <div className="flex gap-2">
//                                         {/* APPROVE OPENS MODAL */}
//                                         <button onClick={() => openApproveModal(req._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded flex justify-center items-center gap-1 font-bold"><FaCheckCircle /> {t('approve')}</button>
//                                         {/* REJECT IS DIRECT */}
//                                         <button onClick={() => handleRejectRental(req._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded flex justify-center items-center gap-1 font-bold"><FaTimesCircle /> {t('reject')}</button>
//                                       </div>
//                                     </div>
//                                   )}
//                                   {req.status === "Cancelled" && req.rejectionReason && (<p className="text-red-400 text-xs italic mt-1">{t('reason')}: {req.rejectionReason}</p>)}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* B. MY RENTALS (Renter View) */}
//             <div className="backdrop-blur-md bg-gradient-to-br from-blue-900/50 to-indigo-950/50 rounded-2xl p-6 shadow-2xl border border-blue-500/30">
//               <h4 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-3 flex items-center gap-2">
//                 <FaClock className="text-blue-400" /> {t('myBookingsTitle')}
//               </h4>
//               {myRentals.length === 0 ? (
//                 <p className="text-blue-200 text-sm italic">{t('noRentalsMade')}</p>
//               ) : (
//                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//                   {myRentals.map((booking) => (
//                     <div key={booking._id} className="bg-black/20 p-4 rounded-xl flex items-center gap-4 border border-white/10 hover:bg-black/30 transition">
//                       {booking.rental ? (
//                         <>
//                           <img src={booking.rental.image} alt="tool" className="w-16 h-16 object-cover rounded-full border-2 border-blue-400" />
//                           <div className="flex-1">
//                             <h5 className="font-bold text-white">{booking.rental.name}</h5>
//                             <div className="text-xs text-blue-200 mt-1 space-y-1">
//                               <p>{t('start')}: {formatDateTime(booking.startDate)}</p>
//                               <p>{t('end')}:  {formatDateTime(booking.endDate)}</p>
//                               <p>{t('total')}: ₹{booking.totalPrice}</p>
//                               {booking.status === "Cancelled" && booking.rejectionReason && (<p className="text-red-300 italic">"{t('reason')}: {booking.rejectionReason}"</p>)}
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <div className="flex-1"><p className="text-red-400 text-sm font-bold">{t('itemRemoved')}</p><p className="text-xs text-gray-400">{new Date(booking.startDate).toLocaleDateString()}</p></div>
//                       )}
//                       <div className="text-right"><span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === "Confirmed" ? "bg-green-500/20 text-green-300 border border-green-500" : booking.status === "Pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500" : "bg-red-500/20 text-red-300 border border-red-500"}`}>{booking.status}</span></div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* WALLET & EARNINGS */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
//           <div className="lg:col-span-1 h-full">
//             <div className="backdrop-blur-sm bg-gradient-to-br from-yellow-800/60 to-amber-900/70 rounded-2xl p-6 shadow-2xl border border-yellow-500/50 h-full">
//               <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"><FaWallet className="text-yellow-300" /> {t("withdrawFunds")}</h3>
//               <p className="text-lg font-bold text-yellow-300 mb-3 border-b border-white/20 pb-2">{t("currentBalance")}: <strong className="text-white">₹{earnings.totalEarnings.toFixed(2)}</strong></p>
//               <form onSubmit={handleUpiSubmit} className="space-y-4 mb-6 pt-2">
//                 <input type="text" placeholder={t("enterUpiId")} value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20" required />
//                 <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700">{t("linkUpi")}</button>
//               </form>
//               <form onSubmit={handleWithdrawalSubmit} className="space-y-4 border-t border-white/20 pt-4">
//                 <input type="number" placeholder={t("enterAmount")} value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20" required />
//                 <button type="submit" className="w-full p-3 rounded-lg bg-gradient-to-r from-green-600 to-yellow-600 text-white">{t("requestWithdrawal")}</button>
//               </form>
//             </div>
//           </div>
//           <div className="lg:col-span-2 h-full">
//             <div className="backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-blue-800/70 rounded-2xl p-6 shadow-2xl border border-green-500/50 h-full">
//               <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2"><FaChartLine className="text-blue-300" /> {t("earningsDashboard")}</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="h-48 sm:h-64"><Line data={chartData(earnings.weeklyEarnings, t("earnings"), "rgba(255, 215, 0, 1)")} options={chartOptions} /></div>
//                 <div className="h-48 sm:h-64"><Line data={chartData(earnings.monthlyEarnings, t("earnings"), "rgba(34, 197, 94, 1)")} options={chartOptions} /></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCE ORDERS */}
//         <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-2xl p-6 shadow-2xl border border-blue-500/50">
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/20 pb-3"><FaWarehouse className="text-teal-300" /> {t("myOrders")}</h3>
//           {orders.length === 0 ? (<p className="text-yellow-200 p-4">{t("noOrders")}</p>) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {orders.map((order) => (
//                 <div key={order._id} className="bg-white/10 rounded-xl p-4 shadow-lg border border-white/20">
//                   <p className="text-yellow-100"><strong>Produce:</strong> {order.listing?.name}</p>
//                   <p className="text-yellow-100"><strong>Qty:</strong> {order.quantity}kg</p>
//                   <p className="text-yellow-100"><strong>Total:</strong> ₹{order.totalPrice}</p>
//                   <p className="text-white mt-1">Status: {order.status}</p>
//                   {order.status === "confirmed" && (
//                     <div className="mt-3 flex flex-col gap-2">
//                       <button onClick={() => handleAcceptOrder(order._id)} className="bg-green-600 text-white p-2 rounded">Accept</button>
//                       <input type="text" placeholder="Reject reason..." onChange={(e) => setRejectionMessage({ ...rejectionMessage, [order._id]: e.target.value })} className="p-2 rounded bg-black/20 text-white border border-white/10" />
//                       <button onClick={() => handleRejectOrder(order._id)} className="bg-red-600 text-white p-2 rounded">Reject</button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* PRODUCE LISTINGS */}
//         <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-lime-800/70 rounded-2xl p-6 shadow-2xl border border-green-500/50">
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center justify-between border-b border-white/20 pb-3"><span>{t("myListings")} 🌱</span><Link to="/listing/new" className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-white p-2 rounded-lg shadow-md hover:scale-[1.05]"><FaPlusCircle /> {t("createNewListing")}</Link></h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             {listings.map((listing) => (<ProductCard key={listing._id} product={listing} isFarmerDashboard={true} onDelete={handleDelete} />))}
//           </div>
//         </div>

//         {/* 1. APPROVAL MODAL (Interactive Map) */}
//         {isApproveModalOpen && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
//             <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-t-4 border-green-500 overflow-hidden flex flex-col max-h-[90vh]">
//               <div className="p-5 border-b"><h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FaMapMarkerAlt className="text-green-600"/> Select Pickup Point</h3></div>
//               <div className="h-64 w-full relative">
//                 <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={13} style={{ height: "100%", width: "100%" }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LocationMarker position={mapPosition} setPosition={setMapPosition} /></MapContainer>
//                 <button onClick={handleGetCurrentLocation} disabled={gettingLocation} className="absolute top-2 right-2 z-[1000] bg-white text-blue-600 p-2 rounded-lg shadow-md border border-gray-200 text-xs font-bold flex items-center gap-1 hover:bg-gray-50">{gettingLocation ? '...' : <><FaLocationArrow /> GPS</>}</button>
//               </div>
//               <div className="p-5 space-y-4 bg-gray-50">
//                 <div>
//                   <label className="text-xs font-bold text-gray-600 uppercase">Address Details / Landmark</label>
//                   <textarea className="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none text-gray-700 text-sm mt-1" rows="2" placeholder="e.g. Warehouse #4, Near Old School..." value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)}></textarea>
//                 </div>
//                 <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-100"><strong>Selected Coordinates:</strong> {mapPosition.lat.toFixed(6)}, {mapPosition.lng.toFixed(6)}</div>
//                 <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 text-yellow-800 text-sm font-semibold"><FaIdCard /> Driving License Required?</div><input type="checkbox" className="w-5 h-5 accent-green-600" checked={isLicenseRequired} onChange={(e) => setIsLicenseRequired(e.target.checked)} /></div>
//                 <div className="flex gap-3 pt-2"><button onClick={() => setIsApproveModalOpen(false)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300">Cancel</button><button onClick={handleConfirmApproval} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center justify-center gap-2"><FaCheckCircle /> Approve & Send</button></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 2. STOP MACHINE MODAL */}
//         {isStopModalOpen && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
//             <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border-t-4 border-red-500">
//               <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><FaBan className="text-red-600"/> Stop Booking?</h3>
//               <p className="text-sm text-gray-600 mb-4">Why are you stopping bookings for this machine?</p>
//               <input type="text" className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none text-gray-700" placeholder="e.g. Maintenance, Repairing..." value={stopReason} onChange={(e) => setStopReason(e.target.value)} autoFocus />
//               <div className="flex gap-3 mt-5"><button onClick={() => setIsStopModalOpen(false)} className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">Cancel</button><button onClick={handleStopConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">Confirm Stop</button></div>
//             </div>
//           </div>
//         )}

//         {/* 3. DELETE CONFIRMATION MODAL */}
//         {isDeleteModalOpen && (
//           <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
//             <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
//               <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaTrash className="text-red-500 text-2xl" /></div>
//               <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Machine?</h3>
//               <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this machine? This action cannot be undone.</p>
//               <div className="flex gap-3">
//                 <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
//                 <button onClick={handleDeleteMachine} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg">Yes, Delete</button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default FarmerDashboard;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Map Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// API Imports
import {
  getListings,
  getOrders,
  deleteListing,
  getEarnings,
  updateUpiId,
  requestWithdrawal,
  acceptOrder,
  rejectOrder,
  fetchMyListings,
  fetchMyBookings,
  fetchIncomingRentalRequests,
  updateRentalStatus,
  toggleRentalStatus, 
  deleteRental      
} from "../utils/api";

// Components
import ProductCard from "../components/ProductCard";
import ProfileSection from "../components/ProfileSection";

// Charts
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Utils & Assets
import { useTranslation } from "react-i18next";
import "../utils/i18n";
import backgroundImage from "../assets/12.jpg";
import toast from "react-hot-toast"; 

// Icons
import {
  FaMoneyBillWave,
  FaWarehouse,
  FaChartLine,
  FaWallet,
  FaRegSadTear,
  FaPlusCircle,
  FaTractor,
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaPowerOff,
  FaTrash,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaIdCard,
  FaBan
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- MAP HELPER COMPONENT ---
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
};

const FarmerDashboard = ({ user }) => {
  const { t, i18n } = useTranslation();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Produce (Crops) Data
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    totalOrderAmount: 0,
    weeklyEarnings: [],
    monthlyEarnings: [],
  });
  const [rejectionMessage, setRejectionMessage] = useState({});

  // 2. Rental (Machinery) Data
  const [myMachines, setMyMachines] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [incomingRentalRequests, setIncomingRentalRequests] = useState([]);
  const [rentalRejectionMsg, setRentalRejectionMsg] = useState({});

  // --- MODAL STATES ---
  
  // A. Approval Modal
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [isLicenseRequired, setIsLicenseRequired] = useState(false); 
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 20.5937, lng: 78.9629 }); 

  // B. Stop Machine Modal
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [machineToStop, setMachineToStop] = useState(null);
  const [stopReason, setStopReason] = useState("");

  // ✅ C. UNIVERSAL DELETE MODAL (For Listings & Machines)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteContext, setDeleteContext] = useState({ id: null, type: null }); // type: 'listing' or 'machine'

  // 3. Wallet Data
  const [upiId, setUpiId] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  // --- FETCH DATA ---
  const fetchData = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");

      const [
        listingsData,
        ordersData,
        earningsData,
        myMachinesData,
        myRentalsData,
        incomingRequestsData,
      ] = await Promise.all([
        getListings(),
        getOrders(token),
        getEarnings(token),
        fetchMyListings(token),
        fetchMyBookings(token),
        fetchIncomingRentalRequests(token),
      ]);

      setListings(
        listingsData.data.filter(
          (listing) => listing?.farmer?._id === user.id
        ) || []
      );
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setEarnings(earningsData.data);
      setMyMachines(myMachinesData.data || []);
      setMyRentals(myRentalsData.data || []);
      setIncomingRentalRequests(incomingRequestsData.data || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || t("error.fetchingData"));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, i18n]);

  // =========================================
  //        RENTAL HANDLERS
  // =========================================

  // 1. Approval Flow
  const openApproveModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setPickupAddress(""); 
    setIsLicenseRequired(false);
    setMapPosition({ lat: 20.5937, lng: 78.9629 }); 
    setIsApproveModalOpen(true);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapPosition({ lat: latitude, lng: longitude });
        setGettingLocation(false);
        toast.success("Location Found! 📍");
      },
      (error) => {
        console.error(error);
        toast.error("Unable to retrieve location");
        setGettingLocation(false);
      }
    );
  };

  const handleConfirmApproval = async () => {
    const mapLink = `https://www.google.com/maps?q=${mapPosition.lat},${mapPosition.lng}`;
    const finalPickupLocation = `${pickupAddress}\n\n📍 Map Location: ${mapLink}`;

    if (!pickupAddress.trim()) {
      toast.error("Please enter manual address details");
      return;
    }

    try {
      await updateRentalStatus(
        { 
          bookingId: selectedBookingId, 
          status: "Confirmed", 
          pickupLocation: finalPickupLocation, 
          isLicenseRequired: isLicenseRequired 
        },
        localStorage.getItem("token")
      );

      setIncomingRentalRequests((prev) =>
        prev.map((req) =>
          req._id === selectedBookingId ? { ...req, status: "Confirmed" } : req
        )
      );
      
      toast.success("Booking Approved! Email sent.");
      setIsApproveModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve booking");
    }
  };

  const handleRejectRental = async (bookingId) => {
    const message = rentalRejectionMsg[bookingId] || "";
    if (!message.trim()) {
      toast.error(t("error.rejectionMessageRequired"));
      return;
    }
    try {
      await updateRentalStatus(
        { bookingId, status: "Cancelled", rejectionReason: message },
        localStorage.getItem("token")
      );
      setIncomingRentalRequests((prev) =>
        prev.map((req) =>
          req._id === bookingId ? { ...req, status: "Cancelled" } : req
        )
      );
      setRentalRejectionMsg((prev) => ({ ...prev, [bookingId]: "" }));
      toast.success(t("success.orderRejected"));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // 2. Toggle Status Flow
  const initiateToggleStatus = (machine) => {
    if (machine.available) {
      setMachineToStop(machine);
      setStopReason("");
      setIsStopModalOpen(true);
    } else {
      handleToggleStatus(machine, "");
    }
  };

  const handleStopConfirm = () => {
    if (!stopReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    handleToggleStatus(machineToStop, stopReason);
    setIsStopModalOpen(false);
  };

  const handleToggleStatus = async (machine, reason) => {
    try {
      const { data } = await toggleRentalStatus(machine._id, reason, localStorage.getItem('token'));
      setMyMachines(myMachines.map(m => m._id === machine._id ? data : m));
      
      if(data.available) toast.success("Machine is Active ✅");
      else toast.success("Machine Stopped 🛑");
      
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // =========================================
  // ✅ UNIFIED DELETE LOGIC (Machine + Listing)
  // =========================================

  // Trigger for Machine Delete
  const confirmDeleteMachine = (machineId) => {
    setDeleteContext({ id: machineId, type: 'machine' });
    setIsDeleteModalOpen(true);
  };

  // Trigger for Listing Delete
  const confirmDeleteListing = (listingId) => {
    setDeleteContext({ id: listingId, type: 'listing' });
    setIsDeleteModalOpen(true);
  };

  // Central Execution Function
  const handleFinalDelete = async () => {
    const { id, type } = deleteContext;
    const token = localStorage.getItem('token');

    try {
      if (type === 'machine') {
        // Delete Machine Logic
        await deleteRental(id, token);
        setMyMachines(myMachines.filter(m => m._id !== id));
        toast.success("Machine deleted successfully");
      } else if (type === 'listing') {
        // Delete Produce Listing Logic
        await deleteListing(id, token);
        setListings(listings.filter((l) => l._id !== id));
        toast.success(t("success.listingDeleted"));
      }
      
      // Close Modal
      setIsDeleteModalOpen(false);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  // =========================================
  //      OTHER HANDLERS (WALLET/ORDERS)
  // =========================================

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder({ orderId }, localStorage.getItem("token"));
      setOrders(orders.map((order) => order._id === orderId ? { ...order, status: "accepted" } : order));
      toast.success(t("success.orderAccepted"));
    } catch (error) {
      toast.error(t("error.acceptingOrder"));
    }
  };

  const handleRejectOrder = async (orderId) => {
    const message = rejectionMessage[orderId] || "";
    if (!message) {
      toast.error(t("error.rejectionMessageRequired"));
      return;
    }
    try {
      await rejectOrder({ orderId, rejectionMessage: message }, localStorage.getItem("token"));
      setOrders(orders.map((order) => order._id === orderId ? { ...order, status: "rejected", rejectionMessage: message } : order));
      setRejectionMessage({ ...rejectionMessage, [orderId]: "" });
      toast.success(t("success.orderRejected"));
    } catch (error) {
      toast.error(t("error.rejectingOrder"));
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUpiId({ upiId }, localStorage.getItem("token"));
      toast.success(t("success.upiUpdated"));
    } catch (error) {
      toast.error(t("error.updatingUpi"));
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (amount <= 0 || amount > earnings.totalEarnings) {
      toast.error(t("error.invalidAmount"));
      return;
    }
    try {
      await requestWithdrawal({ amount }, localStorage.getItem("token"));
      setWithdrawalAmount("");
      toast.success(t("success.withdrawalRequested"));
    } catch (error) {
      toast.error(t("error.requestingWithdrawal"));
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const chartData = (data, label, color) => ({
    labels: data.map((item) => item.date),
    datasets: [{ label, data: data.map((item) => item.earnings), borderColor: color, backgroundColor: `${color.replace("1)", "0.4)")}`, fill: true, tension: 0.4 }],
  });
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500"></div></div>;

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col relative"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(20, 83, 45, 0.98)), url(${backgroundImage})`, backgroundAttachment: "fixed" }}>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-xl border border-white/20">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FaTractor className="text-yellow-400" /> {t("farmerDashboard")}
          </h2>
          <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className="p-2 bg-slate-800 text-white rounded border border-white/20 cursor-pointer focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base">
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="hr">हरियाणवी (Haryanvi)</option>
            <option value="bho">भोजपुरी (Bhojpuri)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        {/* PROFILE */}
        <div className="mb-8 w-full backdrop-blur-sm bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10">
          <ProfileSection user={user} />
        </div>

        {/* RENTAL MARKETPLACE */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-orange-500 pl-4">
            🚜 {t('farmMachineryTitle')}
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* A. MY EQUIPMENT (Incoming Requests) */}
            <div className="backdrop-blur-md bg-gradient-to-br from-orange-900/50 to-red-950/50 rounded-2xl p-6 shadow-2xl border border-orange-500/30">
              <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-3">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaTools className="text-orange-400" /> {t('myEquipmentTitle')}
                </h4>
                <Link to="/rental/add" className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1 transition">
                  <FaPlusCircle /> {t('addMachine')}
                </Link>
              </div>

              {myMachines.length === 0 ? (
                <p className="text-orange-200 text-sm italic">{t('noMachinesListed')}</p>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {myMachines.map((machine) => {
                    const machineRequests = incomingRentalRequests.filter(req => req.rental && req.rental._id === machine._id);
                    const isAvailable = machine.available !== false; 

                    return (
                      <div key={machine._id} className={`p-4 rounded-xl border border-white/10 relative transition-colors ${isAvailable ? 'bg-black/30' : 'bg-red-900/20'}`}>
                        
                        <div className="absolute top-2 right-2 z-10">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isAvailable ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'}`}>
                            {isAvailable ? "Active" : "Stopped"}
                          </span>
                        </div>

                        <div className="flex gap-4 mb-3">
                          <img src={machine.image} alt={machine.name} className={`w-16 h-16 object-cover rounded-lg border ${isAvailable ? 'border-orange-500/50' : 'border-gray-600 grayscale'}`} />
                          <div>
                            <h5 className="font-bold text-white text-lg">{machine.name}</h5>
                            <p className="text-orange-300 text-xs uppercase font-semibold">₹{machine.pricePerHour}/{t('hour')} • {machine.category}</p>
                            {!isAvailable && machine.unavailabilityReason && (
                                <p className="text-red-300 text-xs mt-1 flex items-center gap-1 bg-red-950/50 px-2 py-0.5 rounded">
                                   <FaExclamationCircle/> {machine.unavailabilityReason}
                                </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                            <button onClick={() => initiateToggleStatus(machine)} className={`flex-1 text-xs py-2 rounded font-bold flex justify-center items-center gap-2 transition ${isAvailable ? 'bg-yellow-600/80 hover:bg-yellow-700 text-white' : 'bg-green-600/80 hover:bg-green-700 text-white'}`}>
                                {isAvailable ? <><FaPowerOff /> Stop Booking</> : <><FaCheckCircle /> Start Booking</>}
                            </button>
                            
                            {/* DELETE MACHINE BUTTON */}
                            <button onClick={() => confirmDeleteMachine(machine._id)} className="px-3 bg-red-600/80 hover:bg-red-700 text-white rounded flex justify-center items-center">
                                <FaTrash />
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-gray-300 mb-2 uppercase tracking-wide font-bold">{t('bookingRequests')} ({machineRequests.length})</p>
                          {machineRequests.length === 0 ? (
                            <p className="text-gray-500 text-xs italic">{t('noPendingRequests')}</p>
                          ) : (
                            <div className="space-y-3">
                              {machineRequests.map((req) => (
                                <div key={req._id} className="bg-black/40 p-3 rounded flex flex-col gap-2 border border-white/5">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-white text-sm font-semibold flex items-center gap-2">
                                        <FaUser className="text-orange-400 text-xs" /> {req.renter?.name || t('farmer')}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">{t('from')}: {formatDateTime(req.startDate)} <br /> {t('to')}: {formatDateTime(req.endDate)}</p>
                                      <p className="text-xs text-green-400 font-bold mt-1">{t('total')}: ₹{req.totalPrice}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded border ${req.status === "Confirmed" ? "bg-green-500/20 text-green-400 border-green-500" : req.status === "Cancelled" ? "bg-red-500/20 text-red-400 border-red-500" : "bg-yellow-500/20 text-yellow-400 border-yellow-500"}`}>{req.status}</span>
                                  </div>
                                  {req.status === "Pending" && (
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                      <input type="text" placeholder={t('enterRejectReason')} className="w-full text-xs p-2 rounded bg-white/10 text-white mb-2 border border-white/10 focus:border-orange-500 outline-none" value={rentalRejectionMsg[req._id] || ""} onChange={(e) => setRentalRejectionMsg({ ...rentalRejectionMsg, [req._id]: e.target.value })} />
                                      <div className="flex gap-2">
                                        <button onClick={() => openApproveModal(req._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded flex justify-center items-center gap-1 font-bold"><FaCheckCircle /> {t('approve')}</button>
                                        <button onClick={() => handleRejectRental(req._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded flex justify-center items-center gap-1 font-bold"><FaTimesCircle /> {t('reject')}</button>
                                      </div>
                                    </div>
                                  )}
                                  {req.status === "Cancelled" && req.rejectionReason && (<p className="text-red-400 text-xs italic mt-1">{t('reason')}: {req.rejectionReason}</p>)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* B. MY RENTALS (Renter View) */}
            <div className="backdrop-blur-md bg-gradient-to-br from-blue-900/50 to-indigo-950/50 rounded-2xl p-6 shadow-2xl border border-blue-500/30">
              <h4 className="text-xl font-bold text-white mb-4 border-b border-white/20 pb-3 flex items-center gap-2">
                <FaClock className="text-blue-400" /> {t('myBookingsTitle')}
              </h4>
              {myRentals.length === 0 ? (
                <p className="text-blue-200 text-sm italic">{t('noRentalsMade')}</p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {myRentals.map((booking) => (
                    <div key={booking._id} className="bg-black/20 p-4 rounded-xl flex items-center gap-4 border border-white/10 hover:bg-black/30 transition">
                      {booking.rental ? (
                        <>
                          <img src={booking.rental.image} alt="tool" className="w-16 h-16 object-cover rounded-full border-2 border-blue-400" />
                          <div className="flex-1">
                            <h5 className="font-bold text-white">{booking.rental.name}</h5>
                            <div className="text-xs text-blue-200 mt-1 space-y-1">
                              <p>{t('start')}: {formatDateTime(booking.startDate)}</p>
                              <p>{t('end')}:  {formatDateTime(booking.endDate)}</p>
                              <p>{t('total')}: ₹{booking.totalPrice}</p>
                              {booking.status === "Cancelled" && booking.rejectionReason && (<p className="text-red-300 italic">"{t('reason')}: {booking.rejectionReason}"</p>)}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1"><p className="text-red-400 text-sm font-bold">{t('itemRemoved')}</p><p className="text-xs text-gray-400">{new Date(booking.startDate).toLocaleDateString()}</p></div>
                      )}
                      <div className="text-right"><span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === "Confirmed" ? "bg-green-500/20 text-green-300 border border-green-500" : booking.status === "Pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500" : "bg-red-500/20 text-red-300 border border-red-500"}`}>{booking.status}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WALLET & EARNINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-1 h-full">
            <div className="backdrop-blur-sm bg-gradient-to-br from-yellow-800/60 to-amber-900/70 rounded-2xl p-6 shadow-2xl border border-yellow-500/50 h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"><FaWallet className="text-yellow-300" /> {t("withdrawFunds")}</h3>
              <p className="text-lg font-bold text-yellow-300 mb-3 border-b border-white/20 pb-2">{t("currentBalance")}: <strong className="text-white">₹{earnings.totalEarnings.toFixed(2)}</strong></p>
              <form onSubmit={handleUpiSubmit} className="space-y-4 mb-6 pt-2">
                <input type="text" placeholder={t("enterUpiId")} value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20" required />
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700">{t("linkUpi")}</button>
              </form>
              <form onSubmit={handleWithdrawalSubmit} className="space-y-4 border-t border-white/20 pt-4">
                <input type="number" placeholder={t("enterAmount")} value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20" required />
                <button type="submit" className="w-full p-3 rounded-lg bg-gradient-to-r from-green-600 to-yellow-600 text-white">{t("requestWithdrawal")}</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2 h-full">
            <div className="backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-blue-800/70 rounded-2xl p-6 shadow-2xl border border-green-500/50 h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2"><FaChartLine className="text-blue-300" /> {t("earningsDashboard")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 sm:h-64"><Line data={chartData(earnings.weeklyEarnings, t("earnings"), "rgba(255, 215, 0, 1)")} options={chartOptions} /></div>
                <div className="h-48 sm:h-64"><Line data={chartData(earnings.monthlyEarnings, t("earnings"), "rgba(34, 197, 94, 1)")} options={chartOptions} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCE ORDERS */}
        <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-2xl p-6 shadow-2xl border border-blue-500/50">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/20 pb-3"><FaWarehouse className="text-teal-300" /> {t("myOrders")}</h3>
          {orders.length === 0 ? (<p className="text-yellow-200 p-4">{t("noOrders")}</p>) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white/10 rounded-xl p-4 shadow-lg border border-white/20">
                  <p className="text-yellow-100"><strong>Produce:</strong> {order.listing?.name}</p>
                  <p className="text-yellow-100"><strong>Qty:</strong> {order.quantity}kg</p>
                  <p className="text-yellow-100"><strong>Total:</strong> ₹{order.totalPrice}</p>
                  <p className="text-white mt-1">Status: {order.status}</p>
                  {order.status === "confirmed" && (
                    <div className="mt-3 flex flex-col gap-2">
                      <button onClick={() => handleAcceptOrder(order._id)} className="bg-green-600 text-white p-2 rounded">Accept</button>
                      <input type="text" placeholder="Reject reason..." onChange={(e) => setRejectionMessage({ ...rejectionMessage, [order._id]: e.target.value })} className="p-2 rounded bg-black/20 text-white border border-white/10" />
                      <button onClick={() => handleRejectOrder(order._id)} className="bg-red-600 text-white p-2 rounded">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* PRODUCE LISTINGS */}
        <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-lime-800/70 rounded-2xl p-6 shadow-2xl border border-green-500/50">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center justify-between border-b border-white/20 pb-3"><span>{t("myListings")} 🌱</span><Link to="/listing/new" className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-white p-2 rounded-lg shadow-md hover:scale-[1.05]"><FaPlusCircle /> {t("createNewListing")}</Link></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {listings.map((listing) => (
                <ProductCard 
                    key={listing._id} 
                    product={listing} 
                    isFarmerDashboard={true} 
                    onDelete={confirmDeleteListing} // ✅ Using New Modal Trigger
                />
            ))}
          </div>
        </div>

        {/* ✅ 1. APPROVAL MODAL (Interactive Map) */}
        {isApproveModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-t-4 border-green-500 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-5 border-b"><h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><FaMapMarkerAlt className="text-green-600"/> Select Pickup Point</h3></div>
              <div className="h-64 w-full relative">
                <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={13} style={{ height: "100%", width: "100%" }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LocationMarker position={mapPosition} setPosition={setMapPosition} /></MapContainer>
                <button onClick={handleGetCurrentLocation} disabled={gettingLocation} className="absolute top-2 right-2 z-[1000] bg-white text-blue-600 p-2 rounded-lg shadow-md border border-gray-200 text-xs font-bold flex items-center gap-1 hover:bg-gray-50">{gettingLocation ? '...' : <><FaLocationArrow /> GPS</>}</button>
              </div>
              <div className="p-5 space-y-4 bg-gray-50">
                <textarea className="w-full border p-3 rounded-lg bg-white outline-none text-sm text-gray-800" rows="2" placeholder="Manual Address..." value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)}></textarea>
                <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 text-yellow-800 text-sm font-semibold"><FaIdCard /> Driving License?</div><input type="checkbox" className="w-5 h-5 accent-green-600" checked={isLicenseRequired} onChange={(e) => setIsLicenseRequired(e.target.checked)} /></div>
                <div className="flex gap-3 pt-2"><button onClick={() => setIsApproveModalOpen(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold text-gray-800 hover:bg-gray-300">Cancel</button><button onClick={handleConfirmApproval} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">Approve</button></div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ 2. STOP MACHINE MODAL */}
        {isStopModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border-t-4 border-red-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><FaBan className="text-red-600"/> Stop Booking?</h3>
              <input type="text" className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-500 outline-none text-gray-800" placeholder="Reason..." value={stopReason} onChange={(e) => setStopReason(e.target.value)} autoFocus />
              <div className="flex gap-3 mt-5"><button onClick={() => setIsStopModalOpen(false)} className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">Cancel</button><button onClick={handleStopConfirm} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg">Confirm Stop</button></div>
            </div>
          </div>
        )}

        {/* ✅ 3. UNIFIED DELETE MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FaTrash className="text-red-500 text-2xl" /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this item? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">Cancel</button>
                <button onClick={handleFinalDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FarmerDashboard;