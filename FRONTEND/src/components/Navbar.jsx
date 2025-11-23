
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSeedling, FaChevronDown } from 'react-icons/fa';

// Helper Component for Dropdowns (Desktop Only)
const NavDropdown = ({ title, children }) => (
  <div className="relative group h-full flex items-center">
    <button className="flex items-center gap-1 text-xl font-semibold hover:text-amber-400 transition focus:outline-none">
      {title} <FaChevronDown className="text-sm mt-1" />
    </button>
    {/* Dropdown Content */}
    <div className="absolute top-full right-0 mt-0 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 flex flex-col py-2 text-left z-50">
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
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900/95 via-blue-950/95 to-gray-900/95 backdrop-blur-xl text-white px-6 py-1 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto flex justify-between items-center px-1 py-4">
        {/* Brand Title */}
        <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-green-500 drop-shadow-[0_0_10px_rgba(255,193,7,0.6)] tracking-widest animate-pulse">
          <FaSeedling className="text-green-400 animate-bounce" />
          FARMIO
        </h1>

        {/* --- DESKTOP MENU (Grouped into 4 Items) --- */}
        <div className="hidden md:flex items-center space-x-8 flex-row md:ml-10">
          
          {/* 1. Home */}
          <Link to="/" className="text-xl font-semibold hover:text-amber-400 transition">
            Home
          </Link>

          {/* 2. Smart Farming Dropdown */}
          <NavDropdown title="Smart Farming">
            <Link to="/scan-disease" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Fasal Jaanch
            </Link>
            <Link to="/weather" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Weather
            </Link>
            <Link to="/prices" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Mandi Prices
            </Link>
            <Link to="/loan" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Loan Calculator
            </Link>
            <Link to="/ai" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              AI Assistant
            </Link>
          </NavDropdown>

          {/* 3. Marketplace Dropdown */}
          <NavDropdown title="Marketplace">
            <Link to="/lands" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Land Listing
            </Link>
            <Link to="/product" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
              Agri Products
            </Link>
          </NavDropdown>

          {/* 4. Account Dropdown (Handles Auth Logic) */}
          <NavDropdown title={user ? "My Account" : "Join Us"}>
            {user ? (
              <>
                {/* Dashboard Logic */}
                {user.role === 'farmer' && (
                  <Link to="/farmer" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                    Farmer Dashboard
                  </Link>
                )}
                {user.role === 'consumer' && (
                  <Link to="/consumer" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                    Consumer Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/login" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                    Admin Panel
                  </Link>
                )}
                <div className="border-t border-gray-700 my-1"></div>
                <Link to="/contact" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                  Contact Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition block"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                  Login / Signup
                </Link>
                <Link to="/contact" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                  Contact Us
                </Link>
                <Link to="/about" className="px-4 py-2 hover:bg-gray-800 hover:text-amber-400 transition block">
                  About Us
                </Link>
              </>
            )}
          </NavDropdown>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <FaTimes className="text-3xl text-amber-400" />
          ) : (
            <FaBars className="text-3xl text-white" />
          )}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {/* Mobile menu stays flat for better UX, but visually grouped */}
      <div
        className={`md:hidden bg-gray-900 text-white px-4 py-4 h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'block fixed inset-0 top-20' : 'hidden'
        }`}
      >
        <Link to="/" className="block py-3 text-xl font-bold border-b border-gray-700" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>

        {/* Section: Smart Farming */}
        <div className="mt-4 mb-2 text-xs text-gray-400 uppercase tracking-wider">Smart Farming</div>
        <Link to="/scan-disease" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Fasal Jaanch
        </Link>
        <Link to="/weather" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Weather
        </Link>
        <Link to="/prices" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Price
        </Link>
        <Link to="/loan" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Loan Calculator
        </Link>
        <Link to="/ai" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          AI
        </Link>

        {/* Section: Marketplace */}
        <div className="mt-4 mb-2 text-xs text-gray-400 uppercase tracking-wider">Marketplace</div>
        <Link to="/lands" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Lands
        </Link>
        <Link to="/product" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Products
        </Link>

        {/* Section: Account */}
        <div className="mt-4 mb-2 text-xs text-gray-400 uppercase tracking-wider">Account</div>
        <Link to="/contact" className="block py-2 pl-4 text-lg hover:text-amber-400" onClick={() => setIsMenuOpen(false)}>
          Contact
        </Link>
        
        {user ? (
          <>
            {user.role === 'farmer' && (
              <Link to="/farmer" className="block py-2 pl-4 text-lg text-green-400" onClick={() => setIsMenuOpen(false)}>
                Farmer Dashboard
              </Link>
            )}
            {user.role === 'consumer' && (
              <Link to="/consumer" className="block py-2 pl-4 text-lg text-green-400" onClick={() => setIsMenuOpen(false)}>
                Consumer Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="block py-2 pl-4 text-lg text-green-400" onClick={() => setIsMenuOpen(false)}>
                Admin
              </Link>
            )}
            <button
              onClick={() => { handleLogout(); setIsMenuOpen(false); }}
              className="block w-full text-left py-2 pl-4 text-lg text-red-400 mt-2"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="block py-2 pl-4 text-lg text-amber-400 font-bold" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;