import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPrices } from '../utils/api';
import i18next from '../utils/i18n';
import { useRef } from 'react';
import Footer from '../pages/Footer'; 
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaSyncAlt, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'; // Icons for refresh/data

// Register Chart.js components (Keeping logic intact)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import backgroundImage from '../assets/5.jpg';

const PriceTransparency = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [state, setState] = useState('');
  const [commodity, setCommodity] = useState('');
  const [language, setLanguage] = useState(i18next.language || 'en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [lastFetched, setLastFetched] = useState(null);
  const tableRef = useRef(null);

  // --- LOGIC: DATA ARRAYS (UNCHANGED) ---
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];
  const commodities = [
    'Wheat', 'Rice', 'Maize', 'Barley', 'Jowar', 'Bajra', 'Ragi', 'Chickpea', 'Pigeon Pea',
    'Green Gram', 'Black Gram', 'Lentil', 'Onion', 'Potato', 'Tomato', 'Brinjal', 'Cabbage',
    'Cauliflower', 'Green Peas', 'Okra', 'Mango', 'Banana', 'Citrus', 'Apple', 'Guava', 'Grapes',
    'Groundnut', 'Soybean', 'Mustard', 'Sesame', 'Sunflower', 'Turmeric', 'Chilli', 'Coriander',
    'Cumin', 'Black Pepper', 'Cardamom', 'Sugarcane', 'Cotton', 'Jute', 'Tea', 'Coffee', 'Milk',
    'Cashew', 'Tobacco'
  ];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'bh', name: 'Bhojpuri' },
    { code: 'mr', name: 'Marathi' },
    { code: 'sa', name: 'Sanskrit' },
    { code: 'bn', name: 'Bengali' },
  ];
  // --- END LOGIC: DATA ARRAYS ---

  // --- LOGIC: FETCH AND EFFECTS (UNCHANGED) ---
  const fetchPrices = async (forceRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await getPrices({ state, commodity, forceRefresh });
      setPrices(response.data);
      setLastFetched(new Date());
    } catch (err) {
      setError('Failed to fetch data. Check API configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [state, commodity]);

  const isDataOutdated = lastFetched && (Date.now() - lastFetched) > 12 * 60 * 60 * 1000;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18next.changeLanguage(newLang);
  };

  const filteredPrices = prices.filter((price) =>
    Object.values({
      state: price.state,
      district: price.district,
      market: price.market,
      commodity: price.commodity,
      variety: price.variety,
    }).some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sortedPrices = React.useMemo(() => {
    if (!sortConfig.key) return filteredPrices;
    return [...filteredPrices].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [filteredPrices, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown' && index < sortedPrices.length - 1) {
      tableRef.current.querySelector(`tr:nth-child(${index + 2})`)?.focus();
    } else if (e.key === 'ArrowUp' && index > 0) {
      tableRef.current.querySelector(`tr:nth-child(${index})`)?.focus();
    }
  };
  // --- END LOGIC: FETCH AND EFFECTS ---

  return (
    // 1. Fragment to return multiple elements (Content + Footer)
    <>
      <style>
        {`
          /* Global CSS for animations and effects */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          /* Custom Agri-Theme Classes */
          .agri-glassmorphism {
            background: rgba(1, 46, 31, 0.4); 
            backdrop-filter: blur(15px); 
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .agri-focus-glow:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.4); /* Yellow glow */
          }
          .sort-arrow {
            transition: transform 0.3s ease;
          }
          .sort-arrow.asc {
            transform: rotate(180deg);
          }
          .sort-arrow.desc {
            transform: rotate(0deg);
          }
          .sticky-header th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: linear-gradient(to right, #10b981, #059669); /* Richer green gradient */
            border-bottom: 2px solid #facc15; /* Yellow accent line */
          }
          
          /* Ensure table cells wrap text */
          td, th {
            white-space: normal;
            word-wrap: break-word;
          }
          /* Responsive table adjustments */
          @media (min-width: 640px) {
            .price-table-container {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            .price-table {
              width: 100%;
              table-layout: auto;
            }
            td, th {
              min-width: 100px;
              max-width: 200px;
              padding: 0.75rem;
            }
          }
          @media (max-width: 639px) {
            .price-table-container {
              overflow-x: hidden;
            }
          }
          .main-container {
            font-family: 'Poppins', sans-serif;
            background-color: rgba(20, 20, 20, 0.95);
          }
        `}
      </style>
      
      {/* --- MAIN PAGE CONTAINER --- */}
      <div
        className="min-h-screen py-32 px-3 sm:px-6 lg:px-8 w-full box-border main-container relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Background Overlay for Contrast */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75 z-0"></div>

        <div className="container mx-auto max-w-7xl w-full px-4 relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-10 text-center tracking-tight fade-in drop-shadow-md">
            Market Price Transparency 💰
          </h2>
          
          {/* Refresh Button and Data Age Warning (UI ENHANCED) */}
          <div className="mb-8 flex flex-wrap justify-between items-center slide-in gap-3" style={{ animationDelay: '0.1s' }}>
            <button
              onClick={() => fetchPrices(true)}
              className="p-3 bg-yellow-500 text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors duration-300 focus-glow shadow-lg w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
              aria-label={'Refresh Data'}
            >
              <FaSyncAlt className={`${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading Data...' : '🔄 Refresh (Live)'}
            </button>
            {lastFetched && (
              <div 
                className={`text-sm py-2 px-4 rounded-full font-medium flex items-center gap-2 ${isDataOutdated ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}
              >
                {isDataOutdated ? <FaExclamationTriangle className="text-red-300" /> : <FaChartLine className="text-green-300" />}
                {isDataOutdated ? 'Data Outdated' : 'Data Updated'}
                : {lastFetched.toLocaleString()}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="mb-6 slide-in" style={{ animationDelay: '0.1s' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by State, Commodity, or Market"
              className="w-full p-4 text-white bg-transparent agri-glassmorphism rounded-xl shadow-lg agri-focus-glow transition-all duration-300 text-base placeholder-gray-400"
              aria-label={'Search Data'}
            />
          </div>

          {/* Dropdowns */}
          <div className="mb-10 flex flex-col sm:flex-row gap-4 slide-in" style={{ animationDelay: '0.2s' }}>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-4 text-white bg-transparent agri-glassmorphism rounded-xl shadow-lg agri-focus-glow transition-all duration-300 w-full text-base appearance-none cursor-pointer"
              aria-label={'Select State'}
            >
              <option value="" disabled className="bg-gray-800 text-white">Select State</option>
              {states.map((s) => (<option key={s} value={s} className="bg-gray-800 text-white">{s}</option>))}
            </select>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="p-4 text-white bg-transparent agri-glassmorphism rounded-xl shadow-lg agri-focus-glow transition-all duration-300 w-full text-base appearance-none cursor-pointer"
              aria-label={'Select Commodity'}
            >
              <option value="" disabled className="bg-gray-800 text-white">Select Commodity</option>
              {commodities.map((c) => (<option key={c} value={c} className="bg-gray-800 text-white">{c}</option>))}
            </select>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="p-4 text-white bg-transparent agri-glassmorphism rounded-xl shadow-lg agri-focus-glow transition-all duration-300 w-full text-base appearance-none cursor-pointer"
              aria-label={'Select Language'}
            >
              {languages.map((lang) => (<option key={lang.code} value={lang.code} className="bg-gray-800 text-white">{lang.name}</option>))}
            </select>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center my-12 fade-in bg-black/50 p-6 rounded-xl">
              <svg className="h-12 w-12 text-yellow-500 bounce" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-white text-xl ml-4">Loading Data...</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (<p className="bg-red-900/80 text-red-300 p-4 rounded-xl text-center my-6 text-lg font-semibold fade-in">{error}</p>)}
          
          {/* No Data Message */}
          {!loading && !error && sortedPrices.length === 0 && (
            <p className="text-gray-400 text-center my-6 text-lg font-medium fade-in p-6 bg-gray-900/70 rounded-xl">
              No data available for this selection.
            </p>
          )}
         
          {/* Table (Desktop/Tablet) and Cards (Mobile) */}
          {sortedPrices.length > 0 && (
            <>
              {/* Table for Desktop/Tablet (Sticky Header) */}
              <div
                className="hidden sm:block price-table-container agri-glassmorphism rounded-2xl shadow-xl fade-in overflow-x-auto"
                style={{ animationDelay: '0.4s' }}
              >
                <table
                  className="min-w-full border-collapse price-table"
                  ref={tableRef}
                  role="grid"
                  aria-label={t('priceTransparency.title')}
                >
                  <thead className="bg-green-700 text-white">
                    <tr className="sticky-header">
                      {[
                        { key: 'state', label: 'State' },
                        { key: 'district', label: 'District' },
                        { key: 'market', label: 'Market' },
                        { key: 'commodity', label: 'Commodity' },
                        { key: 'variety', label: 'Variety' },
                        { key: 'min_price', label: 'Min Price' },
                        { key: 'max_price', label: 'Max Price' },
                        { key: 'modal_price', label: 'Modal Price' },
                        { key: 'date', label: 'Date' },
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          className="p-3 text-left cursor-pointer hover:bg-green-800 transition-colors duration-300 focus-glow text-sm sm:text-base"
                          onClick={() => handleSort(key)}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleSort(key)}
                          scope="col"
                        >
                          <div className="flex items-center gap-2">
                            <span>{label}</span>
                            {sortConfig.key === key && (
                              <svg
                                className={`w-4 h-4 sort-arrow ${sortConfig.direction === 'asc' ? 'asc' : 'desc'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortConfig.direction === 'asc' ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}/>
                              </svg>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPrices.map((price, index) => (
                      <tr
                        key={index}
                        className={`text-left hover:bg-white/10 transition-colors duration-300 ${index % 2 === 0 ? 'bg-black/10' : 'bg-transparent'}`}
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        role="row"
                      >
                        <td className="p-3 border-b border-white/10 text-gray-200 text-sm">{price.state}</td>
                        <td className="p-3 border-b border-white/10 text-gray-200 text-sm">{price.district}</td>
                        <td className="p-3 border-b border-white/10 text-gray-200 text-sm font-medium">{price.market}</td>
                        <td className="p-3 border-b border-white/10 text-yellow-300 text-sm font-semibold">{price.commodity}</td>
                        <td className="p-3 border-b border-white/10 text-gray-300 text-sm">{price.variety}</td>
                        <td className="p-3 border-b border-white/10 text-gray-300 text-sm">₹{price.min_price}</td>
                        <td className="p-3 border-b border-white/10 text-gray-300 text-sm">₹{price.max_price}</td>
                        <td className="p-3 border-b border-white/10 font-extrabold text-green-400 text-sm">₹{price.modal_price}</td>
                        <td className="p-3 border-b border-white/10 text-gray-400 text-xs">{price.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Card Layout for Mobile */}
              <div
                className="sm:hidden grid gap-4 fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                {sortedPrices.map((price, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/80 p-5 rounded-xl shadow-lg border border-green-600/30 transition-all duration-300 focus-glow text-sm text-white space-y-2"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    role="article"
                  >
                    <div className="font-bold text-yellow-400 border-b border-green-700 pb-1 mb-2">{price.commodity} ({price.market})</div>
                    <div className="flex justify-between">
                      <span className="font-medium">State:</span>
                      <span className="text-gray-300">{price.state} / {price.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Variety:</span>
                      <span className="text-gray-300">{price.variety}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 font-extrabold border-t border-white/10">
                      <span className="text-green-300">Modal Price:</span>
                      <span className="text-green-400">₹{price.modal_price}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">Date: {price.date}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PriceTransparency;