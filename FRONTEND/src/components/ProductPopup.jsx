import React from 'react';
import { FaTimes, FaTag, FaCalendarAlt, FaUser, FaInfoCircle, FaClipboardList, FaRupeeSign } from 'react-icons/fa';

const ProductPopup = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* --- Header (Sticky) --- */}
        <div className="flex justify-between items-start p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              {product.name || 'Unnamed Product'}
            </h2>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                <FaTag className="text-[10px]" />
                {product.category || 'Uncategorized'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* --- Scrollable Content Body --- */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* ✅ Price Section (New) */}
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-between">
             <div>
               <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Asking Price</p>
               <p className="text-2xl font-extrabold text-green-800 flex items-center">
                 <FaRupeeSign className="text-lg" /> {product.price || 'N/A'} <span className="text-sm font-medium text-green-600 ml-1">/ kg</span>
               </p>
             </div>
             <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center text-green-700">
               <FaTag />
             </div>
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaInfoCircle /> Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Manufacturing Date */}
            <div className="p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                <FaCalendarAlt /> Mfg. Date
              </div>
              <p className="text-gray-800 font-medium">
                {product.manufactureDate ? new Date(product.manufactureDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {/* ✅ Seller Info (Improved Check) */}
            <div className="p-3 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                <FaUser /> Seller / Farmer
              </div>
              <p className="text-gray-800 font-medium capitalize">
                {product.farmer?.name || product.owner?.name || product.sellerName || 'Unknown Seller'}
              </p>
            </div>
          </div>

          {/* Specifications Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaClipboardList /> Specifications
            </h3>
            <div className="text-gray-700 text-sm p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
              {product.specifications || 'No specific specifications listed.'}
            </div>
          </div>

        </div>

        {/* --- Footer (Mobile Close Button) --- */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 sm:hidden">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-gray-800 text-white rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductPopup;