
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRental } from '../utils/api'; 
import toast, { Toaster } from 'react-hot-toast'; // ⬅️ Toast imported
import { FaTractor, FaList, FaRupeeSign, FaMapMarkerAlt, FaImage, FaAlignLeft, FaTools, FaCloudUploadAlt } from 'react-icons/fa'; // ⬅️ Icons added
import bgImage from '../assets/12.jpg'; // ⬅️ Using your project background

const AddRental = () => {
  const navigate = useNavigate();

  // 1. STATE MANAGEMENT (Unchanged)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tractor',
    pricePerHour: '',
    location: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to list equipment.");
      navigate('/login');
    }
  }, [navigate]);

  // 3. HANDLERS (Unchanged logic)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      toast.error("Please upload an image of the equipment."); // ⬅️ Toast
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('image', image);
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('pricePerHour', formData.pricePerHour);
    data.append('location', formData.location);
    data.append('description', formData.description);

    try {
      await createRental(data);
      toast.success('Equipment listed successfully!'); // ⬅️ Toast
      setTimeout(() => navigate('/rental'), 1500); // Small delay to let toast show
    } catch (error) {
      console.error("Upload Error:", error);
      const message = error.response?.data?.message || 'Failed to list item. Please try again.';
      toast.error(message); // ⬅️ Toast
    } finally {
      setLoading(false);
    }
  };

  // 4. RENDER (New Agri-Tech UI)
  return (
    <div 
      className="min-h-screen mt-16 bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] z-0"></div>

      <div className="relative z-10 w-full max-w-2xl bg-slate-900/80 border border-green-500/30 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800/50 to-emerald-900/50 p-6 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4 ring-2 ring-green-400">
            <FaTractor className="text-3xl text-green-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            List Your Machinery
          </h2>
          <p className="text-green-200 text-sm mt-2">
            Share your tools, help other farmers, and earn.
          </p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Machine Name */}
            <div className="relative group">
              <label className="block text-xs font-medium text-green-300 mb-1 uppercase tracking-wider">Machine Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaTools className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="e.g. Mahindra 575 Tractor" 
                  value={formData.name}
                  onChange={handleChange} 
                  className="w-full pl-11 p-4 bg-slate-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
                  required 
                />
              </div>
            </div>

            {/* Category */}
            <div className="relative group">
              <label className="block text-xs font-medium text-green-300 mb-1 uppercase tracking-wider">Category</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaList className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <select 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange} 
                  className="w-full pl-11 p-4 bg-slate-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Tractor" className="bg-slate-800">🚜 Tractor</option>
                  <option value="Harvester" className="bg-slate-800">🌾 Harvester</option>
                  <option value="Sprayer" className="bg-slate-800">💧 Sprayer</option>
                  <option value="Tillage" className="bg-slate-800">⛏️ Tillage</option>
                  <option value="Other" className="bg-slate-800">🛠️ Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Price & Location Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <label className="block text-xs font-medium text-green-300 mb-1 uppercase tracking-wider">Price / Hour (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaRupeeSign className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input 
                    name="pricePerHour" 
                    type="number" 
                    placeholder="500" 
                    value={formData.pricePerHour}
                    onChange={handleChange} 
                    className="w-full pl-11 p-4 bg-slate-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
                    required 
                  />
                </div>
              </div>
              
              <div className="relative group">
                <label className="block text-xs font-medium text-green-300 mb-1 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                  </div>
                  <input 
                    name="location" 
                    type="text" 
                    placeholder="Village/City" 
                    value={formData.location}
                    onChange={handleChange} 
                    className="w-full pl-11 p-4 bg-slate-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all" 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <label className="block text-xs font-medium text-green-300 mb-1 uppercase tracking-wider">Description (Optional)</label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                   <FaAlignLeft className="text-gray-400 group-focus-within:text-green-400 transition-colors" />
                </div>
                <textarea 
                  name="description" 
                  placeholder="Details about HP, condition, attachments included..." 
                  value={formData.description}
                  onChange={handleChange} 
                  className="w-full pl-11 p-4 bg-slate-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all h-32 resize-none" 
                />
              </div>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-medium text-green-300 mb-2 uppercase tracking-wider">Upload Equipment Image</label>
              <div className={`relative border-2 border-dashed border-gray-600 rounded-xl p-6 transition-all hover:border-green-500 hover:bg-green-900/10 ${image ? 'border-green-500 bg-green-900/10' : 'bg-slate-800/30'}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required 
                />
                <div className="text-center">
                  {image ? (
                    <div className="flex flex-col items-center">
                       <FaCheckCircleIcon />
                       <p className="text-green-400 font-medium mt-2 text-sm truncate max-w-xs">{image.name}</p>
                       <p className="text-gray-400 text-xs mt-1">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-300 font-medium text-sm">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform transition-all duration-200 hover:scale-[1.01] active:scale-95 flex justify-center items-center gap-2 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600'
              }`}
            >
              {loading ? (
                <>Listing Item...</>
              ) : (
                <>List Equipment <FaTractor/></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

// Simple internal icon component for success state
const FaCheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export default AddRental;