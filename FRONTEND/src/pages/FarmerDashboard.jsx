// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getListings, getOrders, deleteListing, getEarnings, updateUpiId, requestWithdrawal, acceptOrder, rejectOrder } from '../utils/api';
// import ProductCard from '../components/ProductCard';
// import ProfileSection from '../components/ProfileSection';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
// import { useTranslation } from 'react-i18next';
// import '../utils/i18n';
// import backgroundImage from '../assets/12.jpg';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// const FarmerDashboard = ({ user }) => {
//   const { t, i18n } = useTranslation();
//   const [listings, setListings] = useState([]);
//   const [orders, setOrders] = useState([]); // Initialize as empty array
//   const [earnings, setEarnings] = useState({ totalEarnings: 0, totalOrderAmount: 0, weeklyEarnings: [], monthlyEarnings: [] });
//   const [upiId, setUpiId] = useState('');
//   const [withdrawalAmount, setWithdrawalAmount] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [rejectionMessage, setRejectionMessage] = useState({});

//   const fetchData = async () => {
//     if (!user) return;
//     try {
//       const [listingsData, ordersData, earningsData] = await Promise.all([
//         getListings(),
//         getOrders(localStorage.getItem('token')),
//         getEarnings(localStorage.getItem('token')),
//       ]);
//       console.log('Orders Data:', ordersData); // Debug API response
//       setListings(listingsData.data.filter((listing) => listing?.farmer?._id === user.id) || []);
//       // Ensure ordersData is an array
//       const ordersArray = Array.isArray(ordersData) ? ordersData : [];
//       setOrders(ordersArray);
//       setEarnings(earningsData.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError(error.response?.data?.message || t('error.fetchingData'));
//       setOrders([]); // Reset to empty array on error
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
//     return () => clearInterval(interval);
//   }, [user, i18n]);

//   const handleDelete = async (listingId) => {
//     if (!window.confirm(t('confirm.deleteListing'))) return;
//     try {
//       await deleteListing(listingId, localStorage.getItem('token'));
//       setListings(listings.filter((listing) => listing._id !== listingId));
//       alert(t('success.listingDeleted'));
//     } catch (error) {
//       console.error('Error deleting listing:', error);
//       setError(t('error.deletingListing'));
//     }
//   };

//   const handleAcceptOrder = async (orderId) => {
//     try {
//       await acceptOrder({ orderId }, localStorage.getItem('token'));
//       setOrders(orders.map((order) =>
//         order._id === orderId ? { ...order, status: 'accepted' } : order
//       ));
//       alert(t('success.orderAccepted'));
//     } catch (error) {
//       console.error('Error accepting order:', error);
//       setError(t('error.acceptingOrder'));
//     }
//   };

//   const handleRejectOrder = async (orderId) => {
//     const message = rejectionMessage[orderId] || '';
//     if (!message) {
//       alert(t('error.rejectionMessageRequired'));
//       return;
//     }
//     try {
//       await rejectOrder({ orderId, rejectionMessage: message }, localStorage.getItem('token'));
//       setOrders(orders.map((order) =>
//         order._id === orderId ? { ...order, status: 'rejected', rejectionMessage: message } : order
//       ));
//       setRejectionMessage({ ...rejectionMessage, [orderId]: '' });
//       alert(t('success.orderRejected'));
//     } catch (error) {
//       console.error('Error rejecting order:', error);
//       setError(t('error.rejectingOrder'));
//     }
//   };

//   const handleUpiSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateUpiId({ upiId }, localStorage.getItem('token'));
//       alert(t('success.upiUpdated'));
//     } catch (error) {
//       console.error('Error updating UPI ID:', error);
//       setError(t('error.updatingUpi'));
//     }
//   };

//   const handleWithdrawalSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await requestWithdrawal({ amount: parseFloat(withdrawalAmount) }, localStorage.getItem('token'));
//       setWithdrawalAmount('');
//       alert(t('success.withdrawalRequested'));
//     } catch (error) {
//       console.error('Error requesting withdrawal:', error);
//       setError(t('error.requestingWithdrawal'));
//     }
//   };

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem('language', lang);
//   };

//   const chartData = (data, label) => ({
//     labels: data.map((item) => item.date),
//     datasets: [
//       {
//         label,
//         data: data.map((item) => item.earnings),
//         borderColor: 'rgba(34, 197, 94, 1)',
//         backgroundColor: 'rgba(34, 197, 94, 0.4)',
//         fill: true,
//         pointBackgroundColor: 'rgba(255, 215, 0, 1)',
//         pointBorderColor: 'rgba(255, 215, 0, 1)',
//         pointHoverBackgroundColor: 'rgba(255, 215, 0, 1)',
//         pointHoverBorderColor: 'rgba(255, 215, 0, 1)',
//       },
//     ],
//   });

//   const chartOptions = {
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         labels: { color: 'white', font: { size: 12, family: 'Poppins' } },
//       },
//       tooltip: {
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         titleFont: { family: 'Poppins' },
//         bodyFont: { family: 'Poppins' },
//       },
//     },
//     scales: {
//       x: { ticks: { color: 'white', font: { family: 'Poppins' } } },
//       y: { ticks: { color: 'white', font: { family: 'Poppins' } } },
//     },
//   };

//   if (!user) return (
//     <div className="flex items-center justify-center min-h-screen text-white text-lg sm:text-xl animate-pulse">
//       {t('error.pleaseLogin')}
//     </div>
//   );
//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen text-red-400 text-lg sm:text-xl animate-pulse">
//       {error}
//     </div>
//   );
//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
//     </div>
//   );

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex flex-col overflow-x-hidden relative"
//       style={{
//         backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
//       }}
//     >
//       {/* Particle Effect */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="particle particle-1"></div>
//         <div className="particle particle-2"></div>
//         <div className="particle particle-3"></div>
//         <div className="particle particle-4"></div>
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex-grow relative z-10">
//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 mb-8 sm:mb-10 lg:mb-12 backdrop-blur-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl animate-fadeIn border border-green-300/30 hover:bg-green-500/30 transition-all duration-500">
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-green-300 via-blue-300 to-yellow-300 text-transparent bg-clip-text mb-4 sm:mb-0 animate-gradient">
//             {t('farmerDashboard')}
//           </h2>
//           <select
//             onChange={(e) => changeLanguage(e.target.value)}
//             value={i18n.language}
//             className="p-2 sm:p-3 bg-green-500/20 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 backdrop-blur-lg border-none text-sm sm:text-base transition-all duration-300 hover:bg-green-500/30"
//             aria-label={t('selectLanguage')}
//           >
//             <option value="en" className="text-black">{t('language.english')}</option>
//             <option value="hi" className="text-black">{t('language.hindi')}</option>
//             <option value="ta" className="text-black">{t('language.tamil')}</option>
//             <option value="bh" className="text-black">{t('language.bhojpuri')}</option>
//             <option value="mr" className="text-black">{t('language.marathi')}</option>
//             <option value="sa" className="text-black">{t('language.sanskrit')}</option>
//             <option value="bn" className="text-black">{t('language.bengali')}</option>
//           </select>
//         </div>

//         {/* Profile Section */}
//         <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12 shadow-2xl border border-green-300/30 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-slideUp hover:bg-green-500/30">
//           <ProfileSection user={user} />
//         </div>

//         {/* Orders Section */}
//         <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12 shadow-2xl border border-green-300/30 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-slideUp hover:bg-green-500/30" style={{ animationDelay: '100ms' }}>
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('myOrders')}</h3>
//           {!Array.isArray(orders) || orders.length === 0 ? (
//             <p className="text-yellow-200 text-sm sm:text-base">{t('noOrders')}</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {orders.map((order, index) => (
//                 <div
//                   key={order._id}
//                   className="backdrop-blur-3xl bg-gradient-to-br from-green-500/25 to-blue-500/25 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-[0_4px_20px_rgba(34,197,94,0.4)] border border-green-300/30 transform transition-all hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] animate-bounceIn"
//                   style={{ animationDelay: `${index * 150}ms` }}
//                 >
//                   <div className="space-y-2 sm:space-y-3 text-center sm:text-left">
//                     <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                       <strong className="text-white">{t('produce')}:</strong> {order.listing?.name || t('na')}
//                     </p>
//                     <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                       <strong className="text-white">{t('quantity')}:</strong> {order.quantity} kg
//                     </p>
//                     <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                       <strong className="text-white">{t('totalPrice')}:</strong> ₹{order.totalPrice}
//                     </p>
//                     <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                       <strong className="text-white">{t('status')}:</strong> {order.status}
//                     </p>
//                     {order.consumerDetails && (
//                       <>
//                         <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                           <strong className="text-white">{t('consumerName')}:</strong> {order.consumerDetails.name || t('na')}
//                         </p>
//                         <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                           <strong className="text-white">{t('consumerEmail')}:</strong> {order.consumerDetails.email || t('na')}
//                         </p>
//                         <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                           <strong className="text-white">{t('consumerMobile')}:</strong> {order.consumerDetails.mobile || t('na')}
//                         </p>
//                         <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                           <strong className="text-white">{t('consumerAddress')}:</strong> {order.consumerDetails.address || t('na')}
//                         </p>
//                       </>
//                     )}
//                     {order.status === 'confirmed' && (
//                       <div className="flex flex-col gap-2 mt-2">
//                         <button
//                           onClick={() => handleAcceptOrder(order._id)}
//                           className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all duration-300"
//                         >
//                           {t('acceptOrder')}
//                         </button>
//                         <div className="flex flex-col gap-2">
//                           <input
//                             type="text"
//                             placeholder={t('rejectionMessage')}
//                             value={rejectionMessage[order._id] || ''}
//                             onChange={(e) => setRejectionMessage({ ...rejectionMessage, [order._id]: e.target.value })}
//                             className="p-2 bg-white/10 text-white rounded-lg border-none focus:ring-2 focus:ring-yellow-300"
//                           />
//                           <button
//                             onClick={() => handleRejectOrder(order._id)}
//                             className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300"
//                           >
//                             {t('rejectOrder')}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                     {order.status === 'rejected' && order.rejectionMessage && (
//                       <p className="text-xs sm:text-sm lg:text-base text-yellow-100">
//                         <strong className="text-white">{t('rejectionReason')}:</strong> {order.rejectionMessage}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Earnings Dashboard */}
//         <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12 shadow-2xl border border-green-300/30 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-slideUp hover:bg-green-500/30" style={{ animationDelay: '200ms' }}>
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('earningsDashboard')}</h3>
          
//           <p className="text-base sm:text-lg font-medium text-yellow-200 mb-4">
//             <strong>{t('totalOrderAmount')}:</strong> ₹{earnings.totalOrderAmount}
//           </p>
//           <div className="mt-4">
//             <h4 className="text-base sm:text-lg font-semibold text-white">{t('weeklyEarnings')}</h4>
//             <div className="bg-white/10 p-3 sm:p-4 rounded-lg h-48 sm:h-64">
//               <Line data={chartData(earnings.weeklyEarnings, t('earnings'))} options={chartOptions} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <h4 className="text-base sm:text-lg font-semibold text-white">{t('monthlyEarnings')}</h4>
//             <div className="bg-white/10 p-3 sm:p-4 rounded-lg h-48 sm:h-64">
//               <Line data={chartData(earnings.monthlyEarnings, t('earnings'))} options={chartOptions} />
//             </div>
//           </div>
//         </div>

//         {/* UPI Linking & Withdrawal */}
//         <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12 shadow-2xl border border-green-300/30 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-slideUp hover:bg-green-500/30" style={{ animationDelay: '300ms' }}>
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('withdrawFunds')}</h3>
//           <form onSubmit={handleUpiSubmit} className="space-y-4 mb-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder={t('enterUpiId')}
//                 value={upiId}
//                 onChange={(e) => setUpiId(e.target.value)}
//                 className="w-full p-3 sm:p-4 bg-white/10 text-white placeholder-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 border-none backdrop-blur-lg transition-all duration-300 focus:shadow-[0_0_15px_rgba(234,179,8,0.5)] text-sm sm:text-base peer"
//                 required
//                 aria-label={t('enterUpiId')}
//               />
//               <label className="absolute left-3 -top-2 text-yellow-200 text-xs sm:text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-2 peer-focus:text-yellow-200 peer-focus:text-xs">
//                 {t('enterUpiId')}
//               </label>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 sm:p-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-sm sm:text-base"
//             >
//               <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></span>
//               <span className="relative">{t('linkUpi')}</span>
//             </button>
//           </form>
//           <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
//             <div className="relative">
//               <input
//                 type="number"
//                 placeholder={t('enterAmount')}
//                 value={withdrawalAmount}
//                 onChange={(e) => setWithdrawalAmount(e.target.value)}
//                 className="w-full p-3 sm:p-4 bg-white/10 text-white placeholder-transparent rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 border-none backdrop-blur-lg transition-all duration-300 focus:shadow-[0_0_15px_rgba(234,179,8,0.5)] text-sm sm:text-base peer"
//                 required
//                 aria-label={t('enterAmount')}
//               />
//               <label className="absolute left-3 -top-2 text-yellow-200 text-xs sm:text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-2 peer-focus:text-yellow-200 peer-focus:text-xs">
//                 {t('enterAmount')}
//               </label>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-green-600 to-yellow-600 text-white p-3 sm:p-4 rounded-lg shadow-lg hover:from-green-700 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-sm sm:text-base"
//             >
//               <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></span>
//               <span className="relative">{t('requestWithdrawal')}</span>
//             </button>
//           </form>
//         </div>

//         {/* Listings Section */}
//         <div className="backdrop-blur-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12 shadow-2xl border border-green-300/30 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-slideUp hover:bg-green-500/30" style={{ animationDelay: '400ms' }}>
//           <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('myListings')}</h3>
//           <Link
//             to="/listing/new"
//             className="mb-4 inline-block bg-gradient-to-r from-green-600 to-yellow-600 text-white p-3 sm:p-4 rounded-lg shadow-lg hover:from-green-700 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-sm sm:text-base"
//           >
//             <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></span>
//             <span className="relative">{t('createNewListing')}</span>
//           </Link>
//           {listings.length === 0 ? (
//             <p className="text-yellow-200 text-sm sm:text-base">{t('noListings')}</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {listings.map((listing, index) => (
//                 <div
//                   key={listing._id}
//                   className="transform transition-all animate-bounceIn"
//                   style={{ animationDelay: `${index * 150}ms` }}
//                 >
//                   <ProductCard
//                     product={listing}
//                     isFarmerDashboard={true}
//                     onDelete={handleDelete}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FarmerDashboard;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getListings, getOrders, deleteListing, getEarnings, updateUpiId, requestWithdrawal, acceptOrder, rejectOrder } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProfileSection from '../components/ProfileSection';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useTranslation } from 'react-i18next';
import '../utils/i18n';
import backgroundImage from '../assets/12.jpg';
import toast, { Toaster } from 'react-hot-toast'; 
import { FaMoneyBillWave, FaWarehouse, FaChartLine, FaWallet, FaRegSadTear, FaPlusCircle, FaTractor } from 'react-icons/fa'; // Updated FaTractor import

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FarmerDashboard = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]); // Initialize as empty array
  const [earnings, setEarnings] = useState({ totalEarnings: 0, totalOrderAmount: 0, weeklyEarnings: [], monthlyEarnings: [] });
  const [upiId, setUpiId] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionMessage, setRejectionMessage] = useState({});

  const fetchData = async () => {
    if (!user) return;
    try {
      const [listingsData, ordersData, earningsData] = await Promise.all([
        getListings(),
        getOrders(localStorage.getItem('token')),
        getEarnings(localStorage.getItem('token')),
      ]);
      console.log('Orders Data:', ordersData); // Debug API response
      setListings(listingsData.data.filter((listing) => listing?.farmer?._id === user.id) || []);
      // Ensure ordersData is an array
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      setOrders(ordersArray);
      setEarnings(earningsData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || t('error.fetchingData'));
      setOrders([]); // Reset to empty array on error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [user, i18n]);

  // --- LOGIC FUNCTIONS (UNCHANGED) ---
  const handleDelete = async (listingId) => {
    if (!window.confirm(t('confirm.deleteListing'))) return;
    try {
      await deleteListing(listingId, localStorage.getItem('token'));
      setListings(listings.filter((listing) => listing._id !== listingId));
      toast.success(t('success.listingDeleted'));
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError(t('error.deletingListing'));
      toast.error(t('error.deletingListing'));
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptOrder({ orderId }, localStorage.getItem('token'));
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status: 'accepted' } : order
      ));
      toast.success(t('success.orderAccepted'));
    } catch (error) {
      console.error('Error accepting order:', error);
      setError(t('error.acceptingOrder'));
      toast.error(t('error.acceptingOrder'));
    }
  };

  const handleRejectOrder = async (orderId) => {
    const message = rejectionMessage[orderId] || '';
    if (!message) {
      toast.error(t('error.rejectionMessageRequired'));
      return;
    }
    try {
      await rejectOrder({ orderId, rejectionMessage: message }, localStorage.getItem('token'));
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status: 'rejected', rejectionMessage: message } : order
      ));
      setRejectionMessage({ ...rejectionMessage, [orderId]: '' });
      toast.success(t('success.orderRejected'));
    } catch (error) {
      console.error('Error rejecting order:', error);
      setError(t('error.rejectingOrder'));
      toast.error(t('error.rejectingOrder'));
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUpiId({ upiId }, localStorage.getItem('token'));
      toast.success(t('success.upiUpdated'));
    } catch (error) {
      console.error('Error updating UPI ID:', error);
      setError(t('error.updatingUpi'));
      toast.error(t('error.updatingUpi'));
    }
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    const maxAmount = earnings.totalEarnings;
    
    // Validation Check for max and min amount
    if (amount <= 0 || isNaN(amount)) {
        toast.error(t('error.minAmountRequired'));
        return;
    }
    if (amount > maxAmount) {
        toast.error(`${t('error.exceedsMaxBalance')} (₹${maxAmount.toFixed(2)})`);
        return;
    }
    // ------------------------------------------

    try {
      await requestWithdrawal({ amount }, localStorage.getItem('token'));
      setWithdrawalAmount('');
      toast.success(t('success.withdrawalRequested'));
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      setError(t('error.requestingWithdrawal'));
      toast.error(t('error.requestingWithdrawal'));
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  // --- CHART DATA (UNCHANGED) ---

  const chartData = (data, label, color) => ({
    labels: data.map((item) => item.date),
    datasets: [
      {
        label,
        data: data.map((item) => item.earnings),
        borderColor: color, // Use dynamic color
        backgroundColor: `${color.replace('1)', '0.4)')}`, // Lighter background fill
        fill: true,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 12, family: 'Poppins' } },
        display: false, // Hide dataset label
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Poppins', size: 14, weight: 'bold' },
        bodyFont: { family: 'Poppins', size: 14 },
        displayColors: false,
      },
    },
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false }, 
        ticks: { color: 'white', font: { family: 'Poppins', size: 10 } } 
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.1)', drawBorder: false }, 
        ticks: { color: 'white', font: { family: 'Poppins', size: 10 } },
        beginAtZero: true
      },
    },
  };
  // ---------------------------------

  // --- INITIAL RENDER CHECKS (UNCHANGED) ---
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen text-white text-lg sm:text-xl animate-pulse">
      {t('error.pleaseLogin')}
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-400 text-lg sm:text-xl animate-pulse">
      {error}
    </div>
  );
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
    </div>
  );
  // -----------------------------------------

  const isWithdrawDisabled = earnings.totalEarnings <= 0;
  
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col overflow-x-hidden relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(21, 128, 61, 0.9)), url(${backgroundImage})`, // Deeper Green Overlay
        backgroundAttachment: 'fixed'
      }}
    >
      <Toaster position="top-center" /> 
      
      {/* Particle Effect (Kept for visual appeal) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex-grow relative z-10">
        
        {/* --- HEADER: FARMER DASHBOARD TITLE --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 mb-8 sm:mb-10 lg:mb-12 backdrop-blur-sm bg-amber-600/30 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl border border-amber-300/40 transition-all duration-500">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 sm:mb-0 flex items-center gap-3">
            <FaTractor className="text-yellow-300"/> {t('farmerDashboard')}
          </h2>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="p-2 sm:p-3 bg-white/10 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 backdrop-blur-lg border border-white/20 text-sm sm:text-base transition-all duration-300 hover:bg-white/20 appearance-none cursor-pointer"
            aria-label={t('selectLanguage')}
          >
            <option value="en" className="bg-slate-800 text-white">{t('language.english')}</option>
            <option value="hi" className="bg-slate-800 text-white">{t('language.hindi')}</option>
            <option value="ta" className="bg-slate-800 text-white">{t('language.tamil')}</option>
            <option value="bh" className="bg-slate-800 text-white">{t('language.bhojpuri')}</option>
            <option value="mr" className="bg-slate-800 text-white">{t('language.marathi')}</option>
            <option value="sa" className="bg-slate-800 text-white">{t('language.sanskrit')}</option>
            <option value="bn" className="bg-slate-800 text-white">{t('language.bengali')}</option>
          </select>
        </div>
        
        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Column 1: Profile & UPI/Withdrawal */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
                
                {/* Profile Section (Enhanced Styling) */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-white/10 to-green-900/40 rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/30 transform transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-slideUp">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
                    {t('profileDetails')} 👤
                  </h3>
                  {/* Using existing ProfileSection component */}
                  <ProfileSection user={user} /> 
                </div>

                {/* UPI Linking & Withdrawal */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-yellow-800/60 to-amber-900/70 rounded-2xl p-4 sm:p-6 shadow-2xl border border-yellow-500/50 transform transition-all hover:shadow-[0_0_20px_rgba(255,193,7,0.8)] animate-slideUp" style={{ animationDelay: '300ms' }}>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaWallet className="text-yellow-300"/> {t('withdrawFunds')}
                  </h3>
                  <p className="text-lg font-bold text-yellow-300 mb-3 border-b border-white/20 pb-2">
                    {t('currentBalance')}: <strong className="text-white">₹{earnings.totalEarnings.toFixed(2)}</strong>
                  </p>
                  
                  {/* UPI Form */}
                  <form onSubmit={handleUpiSubmit} className="space-y-4 mb-6 pt-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t('enterUpiId')}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full p-3 bg-white/10 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 border border-white/20 backdrop-blur-lg transition-all text-sm sm:text-base peer"
                        required
                        aria-label={t('enterUpiId')}
                      />
                      <label className="absolute left-3 -top-2 text-yellow-200 text-xs transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-2 peer-focus:text-yellow-200 peer-focus:text-xs">
                        {t('enterUpiId')}
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700 focus:ring-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base font-semibold"
                    >
                      {t('linkUpi')}
                    </button>
                  </form>
                  
                  {/* Withdrawal Form */}
                  <form onSubmit={handleWithdrawalSubmit} className="space-y-4 border-t border-white/20 pt-4">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={t('enterAmount')}
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className={`w-full p-3 bg-white/10 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-300 border border-white/20 backdrop-blur-lg transition-all text-sm sm:text-base peer ${isWithdrawDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                        required
                        aria-label={t('enterAmount')}
                        min="1"
                        disabled={isWithdrawDisabled}
                      />
                      <label className="absolute left-3 -top-2 text-yellow-200 text-xs transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-2 peer-focus:text-yellow-200 peer-focus:text-xs">
                        {t('enterAmount')}
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={`w-full p-3 rounded-lg shadow-lg focus:ring-2 focus:ring-yellow-300 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base font-semibold ${
                          isWithdrawDisabled 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white'
                      }`}
                      disabled={isWithdrawDisabled}
                    >
                      {isWithdrawDisabled ? t('noFunds') : t('requestWithdrawal')}
                    </button>
                  </form>
                </div>
            </div>

            {/* Column 2: Earnings & Orders */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                
                {/* Earnings Dashboard (Enhanced Chart Styling) */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-blue-800/70 rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-500/50 transform transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-slideUp" style={{ animationDelay: '200ms' }}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/20 pb-3">
                        <FaChartLine className="text-blue-300"/> {t('earningsDashboard')}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/10 p-4 rounded-xl border border-white/30 shadow-md">
                            <p className="text-xs text-yellow-300">{t('totalOrderAmount')}</p>
                            <p className="text-lg sm:text-2xl font-bold text-white">₹{earnings.totalOrderAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl border border-white/30 shadow-md">
                            <p className="text-xs text-yellow-300">{t('totalEarnings')}</p>
                            <p className="text-lg sm:text-2xl font-bold text-white">₹{earnings.totalEarnings.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Weekly Earnings Chart */}
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">{t('weeklyEarnings')}</h4>
                            <div className="bg-white/10 p-3 sm:p-4 rounded-lg h-48 sm:h-64 border border-white/20 shadow-inner">
                                {/* Chart Data with specific line color for better contrast */}
                                <Line data={chartData(earnings.weeklyEarnings, t('earnings'), 'rgba(255, 215, 0, 1)')} options={chartOptions} />
                            </div>
                        </div>
                        {/* Monthly Earnings Chart */}
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">{t('monthlyEarnings')}</h4>
                            <div className="bg-white/10 p-3 sm:p-4 rounded-lg h-48 sm:h-64 border border-white/20 shadow-inner">
                                {/* Chart Data with specific line color for better contrast */}
                                <Line data={chartData(earnings.monthlyEarnings, t('earnings'), 'rgba(34, 197, 94, 1)')} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="backdrop-blur-sm bg-gradient-to-br from-blue-800/70 to-teal-800/70 rounded-2xl p-4 sm:p-6 shadow-2xl border border-blue-500/50 transform transition-all hover:shadow-[0_0_20px_rgba(66,133,244,0.8)] animate-slideUp" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
                        <FaWarehouse className="text-teal-300"/> {t('myOrders')} 
                    </h3>
                    
                    {!Array.isArray(orders) || orders.length === 0 ? (
                        <p className="text-yellow-200 text-sm sm:text-base p-4 bg-white/10 rounded-lg flex items-center gap-2"><FaRegSadTear/> {t('noOrders')}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {orders.map((order, index) => (
                                <div
                                    key={order._id}
                                    className="bg-white/10 rounded-xl p-4 shadow-lg border border-white/20 transform transition-all hover:scale-[1.02] hover:shadow-xl animate-bounceIn"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="space-y-2 text-sm text-yellow-100">
                                        <p><strong className="text-white">{t('produce')}:</strong> {order.listing?.name || t('na')}</p>
                                        <p><strong className="text-white">{t('quantity')}:</strong> {order.quantity} kg</p>
                                        <p><strong className="text-white">{t('totalPrice')}:</strong> ₹{order.totalPrice}</p>
                                        <p>
                                            <strong className="text-white">{t('status')}:</strong> 
                                            <span className={`font-semibold ml-1 ${order.status === 'confirmed' ? 'text-blue-400' : order.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </p>
                                        
                                        {/* Consumer Details (Optional) */}
                                        {order.consumerDetails && (
                                            <div className="border-t border-white/20 pt-2 mt-2 space-y-1">
                                                <p><strong className="text-white">{t('consumerName')}:</strong> {order.consumerDetails.name || t('na')}</p>
                                                <p><strong className="text-white">{t('consumerEmail')}:</strong> {order.consumerDetails.email || t('na')}</p>
                                                <p><strong className="text-white">{t('consumerAddress')}:</strong> {order.consumerDetails.address || t('na')}</p>
                                            </div>
                                        )}
                                        
                                        {/* Action Buttons */}
                                        {order.status === 'confirmed' && (
                                            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/20">
                                                <button
                                                    onClick={() => handleAcceptOrder(order._id)}
                                                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold"
                                                >
                                                    {t('acceptOrder')}
                                                </button>
                                                
                                                <input
                                                    type="text"
                                                    placeholder={t('rejectionMessage')}
                                                    value={rejectionMessage[order._id] || ''}
                                                    onChange={(e) => setRejectionMessage({ ...rejectionMessage, [order._id]: e.target.value })}
                                                    className="p-2 bg-white/10 text-white rounded-lg border border-white/20 focus:ring-2 focus:ring-yellow-300 text-sm"
                                                />
                                                <button
                                                    onClick={() => handleRejectOrder(order._id)}
                                                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                                                >
                                                    {t('rejectOrder')}
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'rejected' && order.rejectionMessage && (
                                            <p className="mt-2 text-xs italic text-red-300">
                                                <strong className="text-white">{t('rejectionReason')}:</strong> {order.rejectionMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>

        {/* Listings Section (Full Width) */}
        <div className="mt-6 sm:mt-8 backdrop-blur-sm bg-gradient-to-br from-green-800/70 to-lime-800/70 rounded-2xl p-4 sm:p-6 shadow-2xl border border-green-500/50 transform transition-all hover:shadow-[0_0_20px_rgba(100,255,100,0.8)] animate-slideUp" style={{ animationDelay: '400ms' }}>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center justify-between border-b border-white/20 pb-3">
            <span>{t('myListings')} 🌱</span>
            <Link
              to="/listing/new"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-lime-500 text-white p-2 sm:p-3 rounded-lg shadow-md hover:from-green-600 hover:to-lime-600 transition-all duration-300 transform hover:scale-[1.05] text-sm font-semibold"
            >
              <FaPlusCircle/> {t('createNewListing')}
            </Link>
          </h3>
          
          {listings.length === 0 ? (
            <p className="text-yellow-200 text-sm sm:text-base p-4 bg-white/10 rounded-lg">{t('noListings')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {listings.map((listing, index) => (
                <div
                  key={listing._id}
                  className="transform transition-all animate-bounceIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={listing}
                    isFarmerDashboard={true}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;