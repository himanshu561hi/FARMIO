// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import FarmerDashboard from "./pages/FarmerDashboard";
// import ConsumerDashboard from "./pages/ConsumerDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ListingForm from "./components/ListingForm";
// import Chat from "./components/Chat";
// import OrderSummary from "./components/OrderSummary";
// import BuyNowForm from "./components/BuyNowForm";
// import ErrorBoundary from "./components/ErrorBoundary";
// import Contact from "./pages/Contact";
// import Footer from "./pages/Footer";
// import WeatherApp from "./components/WeatherApp";
// import PriceTransparency from "./components/PriceTransparency";
// import AdminLogin from "./components/AdminLogin";
// import Ai from "./components/Ai";
// import Loan from "./components/Loan";
// import LandList from "./components/LandList";
// import ListLand from "./components/ListLand";
// import DiseaseScanner from "./components/DiseaseScanner";
// import DiseaseHistory from "./components/DiseaseHistory";
// import About from "./pages/About";
// import Disclaimer from "./pages/Disclaimer";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import Chatbot from './pages/Chatbot';
// import { ToastContainer } from "react-toastify";
// import { Toaster } from 'react-hot-toast';
// import "react-toastify/dist/ReactToastify.css";
// import RentalMarketplace from './pages/RentalMarketplace';
// import AddRental from './pages/AddRental';
// import RentalDashboard from './pages/RentalDashboard';

// const App = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         if (payload.exp * 1000 > Date.now()) {
//           setUser({ id: payload.id, role: payload.role });
//         } else {
//           localStorage.removeItem("adminToken");
//         }
//       } catch (error) {
//         console.error("Token parsing error:", error);
//         localStorage.removeItem("adminToken");
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     setUser(null);
//     window.location.href = "/login";
//   };

//   return (
//     <Router>
//       <Navbar user={user} setUser={setUser} />
//       <Toaster position="top-center" />
//       <ErrorBoundary>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <>
//                 <Home />
//                 <Footer />
//               </>
//             }
//           />
//           <Route path="/product" element={<Products />} />
//           <Route path="/weather" element={<WeatherApp />} />
//           <Route path="/prices" element={<PriceTransparency />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/login" element={<Login setUser={setUser} />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/ai" element={<Ai />} />
//           <Route path="/loan" element={<Loan />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/disclaimer" element={<Disclaimer />} />
//           <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//           <Route path="/chatbot" element={<Chatbot />} />
//           <Route
//             path="/farmer"
//             element={
//               user && user.role === "farmer" ? (
//                 <FarmerDashboard user={user} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route
//             path="/consumer"
//             element={
//               user && user.role === "consumer" ? (
//                 <ConsumerDashboard user={user} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route
//             path="/admin/login"
//             element={<AdminLogin setUser={setUser} />}
//           />
//           <Route
//             path="/admin/dashboard"
//             element={
//               user && user.role === "admin" ? (
//                 <AdminDashboard user={user} />
//               ) : (
//                 <Navigate to="/admin/login" /> // Fixed redirect to /admin/login
//               )
//             }
//           />
//           <Route
//             path="/listing/new"
//             element={
//               user && user.role === "farmer" ? (
//                 <ListingForm user={user} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route path="/chat/:listingId" element={<Chat user={user} />} />
//           <Route
//             path="/order/:orderId"
//             element={<OrderSummary user={user} />}
//           />
//           <Route
//             path="/buy-now/:productId"
//             element={
//               user && user.role === "consumer" ? (
//                 <BuyNowForm user={user} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route path="/lands" element={<LandList />} />
//           <Route path="/list-land" element={<ListLand />} />
//           <Route path="/my-reports" element={<DiseaseHistory />} />
//           <Route path="/scan-disease" element={<DiseaseScanner />} />
//           <Route path="/rental" element={<RentalMarketplace />} />
//           <Route path="/rental/add" element={<AddRental />} />
//           <Route path="/dashboard" element={<RentalDashboard />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </ErrorBoundary>
//     </Router>
//   );
// };

// const NotFound = () => <h1>404 - Page Not Found</h1>;

// export default App;




























import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ListingForm from "./components/ListingForm";
import Chat from "./components/Chat";
import OrderSummary from "./components/OrderSummary";
import BuyNowForm from "./components/BuyNowForm";
import ErrorBoundary from "./components/ErrorBoundary";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import WeatherApp from "./components/WeatherApp";
import PriceTransparency from "./components/PriceTransparency";
import AdminLogin from "./components/AdminLogin";
import Ai from "./components/Ai";
import Loan from "./components/Loan";
import LandList from "./components/LandList";
import ListLand from "./components/ListLand";
import DiseaseScanner from "./components/DiseaseScanner";
import DiseaseHistory from "./components/DiseaseHistory";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Chatbot from './pages/Chatbot';

// ✅ Toast Imports
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css"; // Legacy support if needed

import RentalMarketplace from './pages/RentalMarketplace';
import AddRental from './pages/AddRental';
import RentalDashboard from './pages/RentalDashboard';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.id, role: payload.role });
        } else {
          localStorage.removeItem("adminToken");
        }
      } catch (error) {
        console.error("Token parsing error:", error);
        localStorage.removeItem("adminToken");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      
      {/* ✅ GLOBAL TOASTER CONFIGURATION (FARMER THEME) */}
      {/* Ek baar yahan laga diya, ab pure app me same design dikhega */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        containerStyle={{
        zIndex: 99999,
      }}
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #E0E0E0',
            padding: '16px',
            color: '#333',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
          
          // ✅ SUCCESS THEME (Farmer Green)
          success: {
            duration: 4000,
            style: {
              background: '#f0fdf4', // Light Green Background
              color: '#15803d',      // Dark Green Text
              border: '1px solid #bbf7d0',
              fontWeight: 'bold',
            },
            iconTheme: {
              primary: '#16a34a', // Green Tick
              secondary: '#ffffff',
            },
          },

          // ✅ ERROR THEME (Alert Red)
          error: {
            duration: 5000,
            style: {
              background: '#fef2f2', // Light Red Background
              color: '#991b1b',      // Dark Red Text
              border: '1px solid #fecaca',
              fontWeight: 'bold',
            },
            iconTheme: {
              primary: '#ef4444', // Red Cross
              secondary: '#ffffff',
            },
          },

          // ✅ LOADING THEME
          loading: {
            style: {
              background: '#ffffff',
              color: '#4b5563',
            },
          },
        }}
      />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<><Home /><Footer /></>} />
          <Route path="/product" element={<Products />} />
          <Route path="/weather" element={<WeatherApp />} />
          <Route path="/prices" element={<PriceTransparency />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/chatbot" element={<Chatbot />} />
          
          {/* Protected Farmer Routes */}
          <Route
            path="/farmer"
            element={user && user.role === "farmer" ? <FarmerDashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/listing/new"
            element={user && user.role === "farmer" ? <ListingForm user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/rental/add" element={<AddRental />} />

          {/* Protected Consumer Routes */}
          <Route
            path="/consumer"
            element={user && user.role === "consumer" ? <ConsumerDashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/buy-now/:productId"
            element={user && user.role === "consumer" ? <BuyNowForm user={user} /> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
          <Route
            path="/admin/dashboard"
            element={user && user.role === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/admin/login" />}
          />

          {/* Common Routes */}
          <Route path="/chat/:listingId" element={<Chat user={user} />} />
          <Route path="/order/:orderId" element={<OrderSummary user={user} />} />
          <Route path="/lands" element={<LandList />} />
          <Route path="/list-land" element={<ListLand />} />
          <Route path="/my-reports" element={<DiseaseHistory />} />
          <Route path="/scan-disease" element={<DiseaseScanner />} />
          
          {/* Rental Routes */}
          <Route path="/rental" element={<RentalMarketplace />} />
          <Route path="/dashboard" element={<RentalDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

const NotFound = () => <h1 className="text-center mt-20 text-2xl font-bold text-gray-600">404 - Page Not Found</h1>;

export default App;