
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBars, FaTimes, FaSeedling, FaChevronDown } from 'react-icons/fa';

// // --- HELPER: Desktop Dropdown (Agri-Themed) ---
// const NavDropdown = ({ title, children }) => (
//   <div className="relative group h-full flex items-center">
//     <button className="flex items-center gap-1 text-lg font-medium text-green-50 hover:text-yellow-300 transition-all duration-300 focus:outline-none tracking-wide">
//       {title} <FaChevronDown className="text-xs mt-1 transition-transform group-hover:rotate-180" />
//     </button>
    
//     {/* Dropdown Content */}
//     <div className="absolute top-full right-0 mt-2 w-64 bg-emerald-950/90 backdrop-blur-xl border border-green-800/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex flex-col py-3 text-left z-50 overflow-hidden">
//       {/* Decorator Line */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500"></div>
//       {children}
//     </div>
//   </div>
// );

// const Navbar = ({ user, setUser }) => {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     navigate('/');
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 backdrop-blur-md text-white px-6 z-50 shadow-lg border-b border-green-800/30 h-20 flex items-center">
      
//       <div className="container mx-auto flex justify-between items-center h-full">
        
//         {/* --- BRAND LOGO --- */}
//         <Link to="/" className="flex items-center gap-2 group">
//           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-green-500/30 group-hover:bg-green-500 transition-all duration-500">
//             <FaSeedling className="text-yellow-400 text-xl group-hover:text-white group-hover:animate-bounce" />
//           </div>
//           <h1 className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200 group-hover:to-yellow-200 transition-all">
//             FARMIO
//           </h1>
//         </Link>

//         {/* --- DESKTOP MENU --- */}
//         <div className="hidden md:flex items-center space-x-8 ml-auto">
          
//           {/* 1. Home */}
//           <Link to="/" className="text-lg font-medium text-green-50 hover:text-yellow-300 transition-colors tracking-wide">
//             Home
//           </Link>

//           {/* 2. Smart Farming */}
//           <NavDropdown title="Smart Farming">
//             <Link to="/scan-disease" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               🌾 Fasal Jaanch (Disease)
//             </Link>
//             <Link to="/weather" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               ☁️ Weather Forecast
//             </Link>
//             <Link to="/prices" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               💰 Mandi Prices
//             </Link>
//             <Link to="/loan" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               🏦 Loan Calculator
//             </Link>
//             <Link to="/ai" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               🤖 AI Assistant
//             </Link>
//           </NavDropdown>

//           {/* 3. Marketplace */}
//           <NavDropdown title="Marketplace">
//             <Link to="/lands" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               🏞️ Land Listing
//             </Link>
//             <Link to="/product" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
//               🚜 Agri Products
//             </Link>
//           </NavDropdown>

//           {/* 4. Account / Auth */}
//           <div className="pl-4 border-l border-green-700/50">
//             <NavDropdown title={user ? `Hi, ${user.name?.split(' ')[0] || 'User'}` : "Join Us"}>
//               {user ? (
//                 <>
//                   {user.role === 'farmer' && (
//                     <Link to="/farmer" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">👨‍🌾 Farmer Dashboard</Link>
//                   )}
//                   {user.role === 'consumer' && (
//                     <Link to="/consumer" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">🛒 Consumer Dashboard</Link>
//                   )}
//                   {user.role === 'admin' && (
//                     <Link to="/admin" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">🛡️ Admin Panel</Link>
//                   )}
//                   <div className="border-t border-green-800/50 my-1"></div>
//                   <Link to="/contact" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">📞 Contact Support</Link>
//                   <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition block font-semibold">
//                     🚪 Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="px-5 py-3 text-sm hover:bg-green-800/50 text-yellow-300 block font-semibold">🔑 Login / Signup</Link>
//                   <Link to="/contact" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">📞 Contact Us</Link>
//                   <Link to="/about" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">ℹ️ About Us</Link>
//                 </>
//               )}
//             </NavDropdown>
//           </div>
//         </div>

//         {/* --- MOBILE TOGGLE --- */}
//         <button
//           className="md:hidden p-2 text-green-100 hover:text-yellow-400 transition"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
//         </button>
//       </div>

//       {/* --- MOBILE MENU (Slide Down) --- */}
//       <div
//         className={`md:hidden fixed top-20 left-0 w-full bg-emerald-950/95 backdrop-blur-xl border-t border-green-800/50 overflow-y-auto transition-all duration-500 ease-in-out shadow-2xl ${
//           isMenuOpen ? 'max-h-screen opacity-100 pb-10' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="px-6 py-4 space-y-1">
//           <Link to="/" className="block py-3 text-lg font-semibold border-b border-green-800/50 hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>
//             🏠 Home
//           </Link>

//           {/* Mobile Group: Smart Farming */}
//           <div className="pt-4 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Smart Tools</div>
//           <Link to="/scan-disease" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Fasal Jaanch</Link>
//           <Link to="/weather" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Weather</Link>
//           <Link to="/prices" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Mandi Prices</Link>
//           <Link to="/loan" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Loan Calculator</Link>
//           <Link to="/ai" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>AI Assistant</Link>

//           {/* Mobile Group: Marketplace */}
//           <div className="pt-6 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Market</div>
//           <Link to="/lands" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Land Listing</Link>
//           <Link to="/product" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Agri Products</Link>

//           {/* Mobile Group: Account */}
//           <div className="pt-6 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Account</div>
//           <Link to="/contact" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          
//           {user ? (
//             <div className="bg-white/5 rounded-xl p-4 mt-2 border border-green-800/50">
//               <p className="text-sm text-green-300 mb-3 font-medium">Signed in as {user.name}</p>
//               {user.role === 'farmer' && (
//                 <Link to="/farmer" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
//               )}
//               {user.role === 'consumer' && (
//                 <Link to="/consumer" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
//               )}
//               {user.role === 'admin' && (
//                 <Link to="/admin" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
//               )}
//               <button
//                 onClick={() => { handleLogout(); setIsMenuOpen(false); }}
//                 className="w-full mt-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 font-semibold transition"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <Link to="/login" className="block mt-4 text-center py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition shadow-lg" onClick={() => setIsMenuOpen(false)}>
//               Login / Signup
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSeedling, FaChevronDown } from 'react-icons/fa';

// --- HELPER: Desktop Dropdown (Agri-Themed) ---
const NavDropdown = ({ title, children }) => (
  <div className="relative group h-full flex items-center">
    <button className="flex items-center gap-1 text-lg font-medium text-green-50 hover:text-yellow-300 transition-all duration-300 focus:outline-none tracking-wide">
      {title} <FaChevronDown className="text-xs mt-1 transition-transform group-hover:rotate-180" />
    </button>
    
    {/* Dropdown Content */}
    <div className="absolute top-full right-0 mt-2 w-64 bg-emerald-950/90 backdrop-blur-xl border border-green-800/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex flex-col py-3 text-left z-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500"></div>
      {children}
    </div>
  </div>
);

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 backdrop-blur-md text-white px-6 z-50 shadow-lg border-b border-green-800/30 h-20 flex items-center">
      
      <div className="container mx-auto flex justify-between items-center h-full">
        
        {/* --- BRAND LOGO (Restored Old Style) --- */}
        <Link to="/" className="flex items-center gap-3 group no-underline">
          {/* Bouncing Leaf */}
          <FaSeedling className="text-3xl md:text-4xl text-green-400 animate-bounce drop-shadow-lg" />
          
          {/* Glowing Text Gradient */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-green-500 drop-shadow-[0_0_10px_rgba(255,193,7,0.6)]">
            FARMIO
          </h1>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center space-x-8 ml-auto">
          
          {/* 1. Home */}
          <Link to="/" className="text-lg font-medium text-green-50 hover:text-yellow-300 transition-colors tracking-wide">
            Home
          </Link>

          {/* 2. Smart Farming */}
          <NavDropdown title="Smart Farming">
            <Link to="/scan-disease" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🌾 Fasal Jaanch (Disease)
            </Link>
            <Link to="/weather" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              ☁️ Weather Forecast
            </Link>
            <Link to="/prices" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              💰 Mandi Prices
            </Link>
            <Link to="/loan" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🏦 Loan Calculator
            </Link>
            <Link to="/ai" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🤖 AI Assistant
            </Link>
          </NavDropdown>

          {/* 3. Marketplace */}
          <NavDropdown title="Marketplace">
            <Link to="/lands" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🏞️ Land Listing
            </Link>
            <Link to="/product" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🚜 Agri Products
            </Link>
            <Link to="/rental" className="px-5 py-3 text-sm text-gray-200 hover:bg-green-800/50 hover:text-yellow-300 transition border-l-4 border-transparent hover:border-yellow-400 block">
              🏡 Rental Marketplace
            </Link>
          </NavDropdown>

          {/* 4. Account / Auth */}
          <div className="pl-4 border-l border-green-700/50">
            <NavDropdown title={user ? `Hi, ${user.name?.split(' ')[0] || 'User'}` : "Join Us"}>
              {user ? (
                <>
                  {user.role === 'farmer' && (
                    <Link to="/farmer" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">👨‍🌾 Farmer Dashboard</Link>
                  )}
                  {user.role === 'consumer' && (
                    <Link to="/consumer" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">🛒 Consumer Dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="px-5 py-3 text-sm hover:bg-green-800/50 text-green-300 block">🛡️ Admin Panel</Link>
                  )}
                  <div className="border-t border-green-800/50 my-1"></div>
                  <Link to="/contact" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">📞 Contact Support</Link>
                  <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition block font-semibold">
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-3 text-sm hover:bg-green-800/50 text-yellow-300 block font-semibold">🔑 Login / Signup</Link>
                  <Link to="/contact" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">📞 Contact Us</Link>
                  <Link to="/about" className="px-5 py-3 text-sm hover:bg-green-800/50 text-gray-200 block">ℹ️ About Us</Link>
                </>
              )}
            </NavDropdown>
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden p-2 text-green-100 hover:text-yellow-400 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* --- MOBILE MENU (Slide Down) --- */}
      <div
        className={`md:hidden fixed top-20 left-0 w-full bg-emerald-950/95 backdrop-blur-xl border-t border-green-800/50 overflow-y-auto transition-all duration-500 ease-in-out shadow-2xl ${
          isMenuOpen ? 'max-h-screen opacity-100 pb-10' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 space-y-1">
          <Link to="/" className="block py-3 text-lg font-semibold border-b border-green-800/50 hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>
            🏠 Home
          </Link>

          {/* Mobile Group: Smart Farming */}
          <div className="pt-4 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Smart Tools</div>
          <Link to="/scan-disease" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Fasal Jaanch</Link>
          <Link to="/weather" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Weather</Link>
          <Link to="/prices" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Mandi Prices</Link>
          <Link to="/loan" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Loan Calculator</Link>
          <Link to="/ai" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>AI Assistant</Link>

          {/* Mobile Group: Marketplace */}
          <div className="pt-6 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Market</div>
          <Link to="/lands" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Land Listing</Link>
          <Link to="/product" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Agri Products</Link>
          <Link to="/rental" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>🏡 Rental Marketplace</Link>

          {/* Mobile Group: Account */}
          <div className="pt-6 pb-2 text-xs font-bold text-green-400 uppercase tracking-widest">Account</div>
          <Link to="/contact" className="block py-2 pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          
          {user ? (
            <div className="bg-white/5 rounded-xl p-4 mt-2 border border-green-800/50">
              <p className="text-sm text-green-300 mb-3 font-medium">Signed in as {user.name}</p>
              {user.role === 'farmer' && (
                <Link to="/farmer" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
              )}
              {user.role === 'consumer' && (
                <Link to="/consumer" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-white font-semibold hover:text-yellow-300" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              )}
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full mt-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block mt-4 text-center py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition shadow-lg" onClick={() => setIsMenuOpen(false)}>
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;