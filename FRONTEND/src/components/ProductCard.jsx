import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductPopup from './ProductPopup';

const ProductCard = ({ product, isFarmerDashboard = false, onDelete }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      {/* Card Container - Added group for hover effects and flex-col for alignment */}
      <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
        
        {/* --- Image Section --- */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
            </div>
          )}

          {/* Price Badge (New Feature) */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-green-100">
            <span className="text-green-700 font-bold text-sm">
              ₹{product.price ? product.price : 'N/A'}/kg
            </span>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="p-5 flex flex-col flex-grow">
          
          {/* Product Name */}
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-800 truncate leading-tight" title={product.name}>
              {product.name || 'Unnamed Product'}
            </h2>
            {/* Optional: Category or Seller Name */}
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
              {product.category || 'Fresh Produce'}
            </p>
          </div>

          {/* Description (Dotted line clamp) */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow" title={product.description}>
            {product.description || 'No detailed description available for this product.'}
          </p>

          {/* --- Action Buttons --- */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
            
            {/* Know More Button */}
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              Know More
            </button>

            {/* Primary Action (Delete or Buy) */}
            {isFarmerDashboard ? (
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors duration-200"
              >
                Delete
              </button>
            ) : (
              <Link
                to={`/buy-now/${product._id}`}
                className="flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-green-200 text-center transition-colors duration-200"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Popup Component */}
      {isPopupOpen && (
        <ProductPopup product={product} onClose={() => setIsPopupOpen(false)} />
      )}
    </>
  );
};

export default ProductCard;