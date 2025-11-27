// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createListing } from '../utils/api';
// import backgroundImage from '../assets/2.jpg';

// const ListingForm = ({ user }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     quantity: '',
//     price: '',
//     locationName: '',
//     coordinates: '[0,0]',
//     image: null,
//     category: '',
//     manufactureDate: '',
//     description: '',
//     specifications: '',
//   });
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({ ...formData, [name]: files ? files[0] : value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     setError(null);
//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === 'image' && formData[key]) {
//           data.append(key, formData[key]);
//         } else if (formData[key]) {
//           data.append(key, formData[key]);
//         }
//       });
//       await createListing(data, localStorage.getItem('token'));
//       alert('Listing created successfully');
//       navigate('/farmer');
//     } catch (error) {
//       console.error('Error creating listing:', error);
//       setError(error.response?.data?.message || 'Failed to create listing.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen bg-cover bg-center bg-no-repeat flex items-start justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <div className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 transition-all duration-1000 hover:shadow-[0_0_60px_rgba(34,197,94,0.7)] border border-white/25 animate-slideIn">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-green-100 animate-gradientText bg-gradient-to-r from-green-200 via-emerald-300 to-teal-400 bg-clip-text ">
//           Create Your Listing
//         </h2>
//         {error && (
//           <p className="text-red-200 mb-4 sm:mb-6 md:mb-8 text-center bg-red-600/20 p-4 rounded-xl border border-red-500/50 animate-shake text-sm sm:text-base md:text-lg">
//             {error}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
//           <div className="relative group z-10">
//             <input
//               type="text"
//               name="name"
//               placeholder="Product Name"
//               value={formData.name}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Name</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="number"
//               name="quantity"
//               placeholder="Quantity (kg)"
//               value={formData.quantity}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text \ text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Quantity</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="number"
//               name="price"
//               placeholder="Price per kg"
//               value={formData.price}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Price</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="text"
//               name="locationName"
//               placeholder="Location (e.g., Delhi)"
//               value={formData.locationName}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Location</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="text"
//               name="coordinates"
//               placeholder="[longitude,latitude]"
//               value={formData.coordinates}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Coordinates</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="text"
//               name="category"
//               placeholder="Category (e.g., Vegetables)"
//               value={formData.category}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Category</span>
//           </div>
//           <div className="relative group z-10">
//             <input
//               type="date"
//               name="manufactureDate"
//               value={formData.manufactureDate}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Manufacture Date</span>
//           </div>
//           <div className="relative group md:col-span-2 z-10">
//             <textarea
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Description</span>
//           </div>
//           <div className="relative group md:col-span-2 z-10">
//             <textarea
//               name="specifications"
//               placeholder="Specifications"
//               value={formData.specifications}
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white placeholder-gray-200 min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Specifications</span>
//           </div>
//           <div className="relative group md:col-span-2 z-10">
//             <input
//               type="file"
//               name="image"
//               accept="image/jpg, image/jpeg, image/png, image/webp"
//               onChange={handleChange}
//               className="relative w-full p-3 sm:p-4 bg-white/15 border-2 border-green-500/50 rounded-xl focus:ring-4 focus:ring-green-400/70 focus:border-green-600 transition-all duration-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600/50 file:text-green-100 hover:file:bg-green-600/70 text-sm sm:text-base md:text-lg z-20"
//               required
//             />
//             <div className="absolute inset-0 rounded-xl ring-1 ring-green-500/40 group-hover:ring-green-500/70 transition-all duration-500 animate-pulse z-0" />
//             <span className="absolute -top-2 left-3 px-2 text-xs sm:text-sm md:text-base text-green-100 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">Image</span>
//           </div>
//           <div className="md:col-span-2 mt-4 sm:mt-5 md:mt-6 z-10">
//             <button
//               type="submit"
//               className="relative w-full bg-gradient-to-r from-green-300 to-emerald-400 text-white p-3 sm:p-4 rounded-xl hover:from-green-400 hover:to-emerald-500 disabled:bg-green-500/50 transition-all duration-500 transform hover:scale-105 focus:ring-4 focus:ring-green-400/70 shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.9)] animate-pulseButton text-sm sm:text-base md:text-lg z-20"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Creating...' : 'Create Listing'}
//             </button>
//           </div>
//         </form>
//       </div>
//       <style>{`
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(40px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
//           20%, 40%, 60%, 80% { transform: translateX(6px); }
//         }
//         @keyframes gradientText {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes pulseButton {
//           0% { box-shadow: 0 0 12px rgba(34,197,94,0.5); }
//           50% { box-shadow: 0 0 25px rgba(34,197,94,0.9); }
//           100% { box-shadow: 0 0 12px rgba(34,197,94,0.5); }
//         }
//         .animate-slideIn {
//           animation: slideIn 1.2s ease-out;
//         }
//         .animate-shake {
//           animation: shake 0.7s ease-in-out;
//         }
//         .animate-gradientText {
//           background-size: 200% 200%;
//           animation: gradientText 5s ease infinite;
//         }
//         .animate-pulseButton {
//           animation: pulseButton 2.5s ease-in-out infinite;
//         }
//         input, textarea, button {
//           outline: none;
//           pointer-events: auto;
//         }
//         .group:hover .ring-1 {
//           transform: scale(1.02);
//         }
//         @media (max-width: 640px) {
//           .text-2xl {
//             font-size: 1.5rem;
//           }
//           .pt-20 {
//             padding-top: 6rem; /* Increased to ensure visibility above navbar */
//           }
//           .p-6 {
//             padding: 1rem;
//           }
//           .gap-4 {
//             gap: 0.75rem;
//           }
//           .text-sm {
//             font-size: 0.875rem;
//           }
//           .min-h-[100px] {
//             min-height: 80px;
//           }
//         }
//         @media (min-width: 640px) and (max-width: 768px) {
//           .text-3xl {
//             font-size: 2rem;
//           }
//           .pt-24 {
//             padding-top: 7rem; /* Adjusted for slightly larger screens */
//           }
//           .p-8 {
//             padding: 1.25rem;
//           }
//           .gap-5 {
//             gap: 1rem;
//           }
//           .text-base {
//             font-size: 1rem;
//           }
//         }
//         @media (min-width: 768px) and (max-width: 1024px) {
//           .text-4xl {
//             font-size: 2.5rem;
//           }
//           .pt-28 {
//             padding-top: 8rem; /* Adjusted for medium screens */
//           }
//           .p-10 {
//             padding: 1.5rem;
//           }
//           .gap-6 {
//             gap: 1.25rem;
//           }
//         }
//         @media (min-width: 1024px) {
//           .max-w-6xl {
//             max-width: 85rem;
//           }
//           .text-5xl {
//             font-size: 3rem;
//           }
//           .pt-32 {
//             padding-top: 9rem; /* Adjusted for larger screens */
//           }
//           .p-12 {
//             padding: 2rem;
//           }
//         }
//         @media (min-width: 1280px) {
//           .pt-36 {
//             padding-top: 10rem; /* Maximum padding for extra-large screens */
//           }
//           .p-14 {
//             padding: 2.5rem;
//           }
//           .text-lg {
//             font-size: 1.125rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ListingForm;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../utils/api';
import backgroundImage from '../assets/2.jpg';
import toast, { Toaster } from 'react-hot-toast'; // ✅ Import Toast

const ListingForm = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    locationName: '',
    coordinates: '[0,0]',
    image: null,
    category: '',
    manufactureDate: '',
    description: '',
    specifications: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    // Loading Toast start
    const loadingToast = toast.loading("Uploading produce...");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'image' && formData[key]) {
          data.append(key, formData[key]);
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await createListing(data, localStorage.getItem('token'));
      
      // ✅ Success Toast
      toast.dismiss(loadingToast);
      toast.success('Produce Listed Successfully! 🌾', {
        duration: 3000,
        style: {
          background: '#f0fdf4', // Light green bg
          color: '#15803d',      // Dark green text
          fontWeight: 'bold',
        }
      });

      setTimeout(() => {
        navigate('/farmer');
      }, 1500);

    } catch (error) {
      console.error('Error creating listing:', error);
      toast.dismiss(loadingToast);
      
      const errorMsg = error.response?.data?.message || 'Failed to create listing.';
      setError(errorMsg);
      toast.error(errorMsg); // ✅ Error Toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen mt-10 bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})` 
      }}
    >
      {/* ✅ Toaster Component Added */}

      {/* Glassmorphism Container */}
      <div className="w-full max-w-5xl bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-slideUp">
        
        {/* Header Section */}
        <div className="bg-white/5 border-b border-white/10 p-6 sm:p-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            🌾 List Your Produce
          </h2>
          <p className="mt-2 text-green-200 text-sm sm:text-base font-medium">
            Share your harvest with the world.
          </p>
        </div>

        {/* Error Message Block (Optional: Toast is enough, but keeping for layout) */}
        {error && (
          <div className="mx-6 mt-6 sm:mx-8 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl shadow-sm animate-shake backdrop-blur-sm">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <div className="p-6 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 md:grid-cols-2">
            
            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Organic Wheat"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g. 500"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Price (₹ per kg)</label>
              <input
                type="number"
                name="price"
                placeholder="e.g. 45"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Location</label>
              <input
                type="text"
                name="locationName"
                placeholder="e.g. Village Name"
                value={formData.locationName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Coordinates (Optional)</label>
              <input
                type="text"
                name="coordinates"
                placeholder="[longitude, latitude]"
                value={formData.coordinates}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Grains, Vegetables"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Harvest Date</label>
              <input
                type="date"
                name="manufactureDate"
                value={formData.manufactureDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm cursor-pointer [color-scheme:dark]"
                required
              />
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe your produce quality..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm min-h-[100px]"
                required
              />
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Specifications</label>
              <textarea
                name="specifications"
                placeholder="Technical details..."
                value={formData.specifications}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300 outline-none backdrop-blur-sm min-h-[100px]"
                required
              />
            </div>

            <div className="relative group md:col-span-2">
              <label className="block text-sm font-bold text-green-100 mb-1 ml-1">Product Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-white/30 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-green-400 transition-all backdrop-blur-sm">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-gray-200"><span className="font-bold text-green-300">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                  </div>
                  <input 
                    type="file" 
                    name="image" 
                    className="hidden" 
                    accept="image/jpg, image/jpeg, image/png, image/webp"
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              {formData.image && (
                <p className="mt-2 text-sm text-green-300 text-center font-medium animate-pulse">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>

            <div className="md:col-span-2 mt-6">
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white shadow-xl transform transition-all duration-300 
                  ${isSubmitting 
                    ? 'bg-gray-500/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] border border-white/20'
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : 'Create Listing'}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ListingForm;