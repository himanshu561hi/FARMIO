
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchRentals, bookRental } from '../utils/api';
// import { FaSearch, FaFilter, FaMapMarkerAlt, FaUndo } from 'react-icons/fa'; // Icons import kiye

// const RentalMarketplace = () => {
//   const navigate = useNavigate();
  
//   // 1. Data States
//   const [rentals, setRentals] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null); 
//   const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });

//   // 2. Filter States (Naya Code)
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [locationFilter, setLocationFilter] = useState('');

//   // 3. Fetch Data
//   useEffect(() => {
//     const getRentals = async () => {
//       try {
//         const { data } = await fetchRentals();
//         setRentals(data);
//       } catch (error) {
//         console.error('Error fetching rentals', error);
//       }
//     };
//     getRentals();
//   }, []);

//   // 4. Booking Logic (Existing)
//   const handleBooking = async (e) => {
//     e.preventDefault();
//     if (!selectedItem) return;

//     try {
//       await bookRental({
//         rentalId: selectedItem._id,
//         startDate: bookingDates.startDate,
//         endDate: bookingDates.endDate
//       });
//       alert('Booking Confirmed!');
//       setSelectedItem(null);
//     } catch (error) {
//       alert(error.response?.data?.message || 'Booking failed');
//     }
//   };

//   // 5. FILTERING LOGIC (Main Logic)
//   const filteredRentals = rentals.filter((rental) => {
//     // A. Name Search (Case Insensitive)
//     const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase());
    
//     // B. Category Filter (Exact Match)
//     const matchesCategory = selectedCategory === '' || rental.category === selectedCategory;
    
//     // C. Location Filter (Partial Match)
//     const matchesLocation = rental.location.toLowerCase().includes(locationFilter.toLowerCase());

//     return matchesSearch && matchesCategory && matchesLocation;
//   });

//   // Reset Function
//   const resetFilters = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setLocationFilter('');
//   };

//   return (
//     <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-4 gap-4">
//         <div>
//            <h1 className="text-3xl font-bold text-green-800">Farm Equipment Rental</h1>
//            <p className="text-gray-500 text-sm">Find the best tools near you</p>
//         </div>
        
//         <button 
//           onClick={() => navigate('/rental/add')}
//           className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center gap-2"
//         >
//           <span className="text-xl">+</span> List Your Equipment
//         </button>
//       </div>

//       {/* --- NEW SEARCH & FILTER BAR --- */}
//       <div className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center border border-gray-200">
        
//         {/* Search Input */}
//         <div className="relative">
//             <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
//             <input 
//                 type="text" 
//                 placeholder="Search by Name (e.g. Tractor)" 
//                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />
//         </div>

//         {/* Category Dropdown */}
//         <div className="relative">
//             <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
//             <select 
//                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 appearance-none cursor-pointer"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//                 <option value="">All Categories</option>
//                 <option value="Tractor">Tractor</option>
//                 <option value="Harvester">Harvester</option>
//                 <option value="Sprayer">Sprayer</option>
//                 <option value="Tillage">Tillage</option>
//                 <option value="Other">Other</option>
//             </select>
//         </div>

//         {/* Location Input */}
//         <div className="relative">
//             <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
//             <input 
//                 type="text" 
//                 placeholder="Filter by Location" 
//                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
//                 value={locationFilter}
//                 onChange={(e) => setLocationFilter(e.target.value)}
//             />
//         </div>

//         {/* Reset Button */}
//         <button 
//             onClick={resetFilters}
//             className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
//         >
//             <FaUndo /> Reset Filters
//         </button>
//       </div>

      
//       {/* Grid of Items (Using filteredRentals) */}
//       {filteredRentals.length === 0 ? (
//         <div className="text-center py-20">
//             <p className="text-gray-500 text-xl">No equipment found matching your filters.</p>
//             <button onClick={resetFilters} className="text-green-600 font-bold mt-2 hover:underline">Clear Filters</button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
//           {filteredRentals.map((rental) => (
//             <div key={rental._id} className="border rounded-xl overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-2xl transition-shadow duration-300">
//               <div className="relative">
//                   <img src={rental.image} alt={rental.name} className="w-full h-48 object-cover" />
//                   <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
//                     {rental.category}
//                   </span>
//               </div>
              
//               <div className="p-5 flex flex-col flex-grow">
//                 <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-xl font-bold text-gray-800 truncate w-2/3">{rental.name}</h3>
//                     <p className="text-green-700 font-bold text-lg whitespace-nowrap">₹{rental.pricePerHour}<span className="text-xs text-gray-500 font-normal">/hr</span></p>
//                 </div>
                
//                 <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
//                     <FaMapMarkerAlt className="text-red-400"/> {rental.location}
//                 </p>
                
//                 {rental.description && (
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rental.description}</p>
//                 )}

//                 <div className="mt-auto">
//                     <button 
//                         onClick={() => setSelectedItem(rental)}
//                         className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md"
//                     >
//                         Book Now
//                     </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Booking Modal (Unchanged) */}
//       {selectedItem && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
//             <div className="flex justify-between items-center mb-6 border-b pb-4">
//                  <h3 className="text-xl font-bold text-gray-800">Book {selectedItem.name}</h3>
//                  <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
//             </div>
            
//             <form onSubmit={handleBooking} className="space-y-4">
//               <div>
//                   <label className="block mb-1 text-sm font-semibold text-gray-600">Start Date & Time</label>
//                   <input 
//                     type="datetime-local" 
//                     className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
//                     onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
//                     required
//                   />
//               </div>
              
//               <div>
//                   <label className="block mb-1 text-sm font-semibold text-gray-600">End Date & Time</label>
//                   <input 
//                     type="datetime-local" 
//                     className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50"
//                     onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
//                     required
//                   />
//               </div>

//               <div className="flex gap-3 mt-6 pt-4">
//                 <button 
//                   type="button" 
//                   onClick={() => setSelectedItem(null)} 
//                   className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition"
//                 >
//                   Confirm Booking
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RentalMarketplace;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRentals, bookRental } from '../utils/api'; // Ensure this imports correctly
import { FaSearch, FaFilter, FaMapMarkerAlt, FaUndo, FaExclamationCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const RentalMarketplace = () => {
  const navigate = useNavigate();
  
  // 1. Data States
  const [rentals, setRentals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [bookingDates, setBookingDates] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);

  // 2. Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // 3. Fetch Data
  useEffect(() => {
    const getRentals = async () => {
      try {
        const { data } = await fetchRentals();
        setRentals(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rentals', error);
        toast.error("Failed to load rentals");
        setLoading(false);
      }
    };
    getRentals();
  }, []);

  // 4. Booking Logic
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    // Calculate Cost for display (Optional logic)
    // const start = new Date(bookingDates.startDate);
    // const end = new Date(bookingDates.endDate);
    // const hours = Math.abs(end - start) / 36e5;
    // const totalCost = hours * selectedItem.pricePerHour;

    try {
      await bookRental({
        rentalId: selectedItem._id,
        startDate: bookingDates.startDate,
        endDate: bookingDates.endDate,
        ownerId: selectedItem.owner._id,
      });
      toast.success('Booking Request Sent Successfully!');
      setSelectedItem(null);
      setBookingDates({ startDate: '', endDate: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  // 5. FILTERING LOGIC
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = rental.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || rental.category === selectedCategory;
    const matchesLocation = rental.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Reset Function
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setLocationFilter('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
    </div>
  );

  return (
    <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-4 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-green-800">Farm Equipment Rental</h1>
           <p className="text-gray-500 text-sm">Find and rent tractors, harvesters, and tools near you.</p>
        </div>
        
        <button 
          onClick={() => navigate('/rental/add')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center gap-2"
        >
          <span className="text-xl">+</span> List Your Equipment
        </button>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center border border-gray-200">
        
        {/* Search Input */}
        <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search (e.g. Tractor)" 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
            <select 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">All Categories</option>
                <option value="Tractor">Tractor</option>
                <option value="Harvester">Harvester</option>
                <option value="Tools">Tools</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Labor">Labor</option>
            </select>
        </div>

        {/* Location Input */}
        <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Location (e.g. Meerut)" 
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
            />
        </div>

        {/* Reset Button */}
        <button 
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
            <FaUndo /> Reset
        </button>
      </div>

      
      {/* Grid of Items */}
      {filteredRentals.length === 0 ? (
        <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No equipment found matching your filters.</p>
            <button onClick={resetFilters} className="text-green-600 font-bold mt-2 hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {filteredRentals.map((rental) => {
            // Check Availability explicitly
            const isAvailable = rental.available !== false; // Defaults to true if undefined

            return (
              <div key={rental._id} className={`border rounded-xl overflow-hidden shadow-lg bg-white flex flex-col hover:shadow-2xl transition-all duration-300 ${!isAvailable ? 'opacity-90 grayscale-[0.5]' : ''}`}>
                
                {/* Image Section */}
                <div className="relative">
                    <img src={rental.image} alt={rental.name} className="w-full h-48 object-cover" />
                    
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {rental.category}
                    </span>

                    {/* Unavailable Badge Overlay */}
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-red-600 text-white font-bold px-4 py-1 rounded transform -rotate-12 border-2 border-white">
                                UNAVAILABLE
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 truncate w-2/3" title={rental.name}>{rental.name}</h3>
                      <p className="text-green-700 font-bold text-lg whitespace-nowrap">₹{rental.pricePerHour}<span className="text-xs text-gray-500 font-normal">/hr</span></p>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-400"/> {rental.location}
                  </p>
                  
                  {rental.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rental.description}</p>
                  )}

                  {/* Spacer to push button to bottom */}
                  <div className="mt-auto">
                      
                      {/* --- UPDATED BOOK BUTTON LOGIC --- */}
                      {isAvailable ? (
                          <button 
                              onClick={() => setSelectedItem(rental)}
                              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-md"
                          >
                              Book Now
                          </button>
                      ) : (
                          <button 
                              disabled
                              className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed flex flex-col items-center justify-center border border-gray-300"
                          >
                              <span>Currently Unavailable</span>
                              {rental.unavailabilityReason && (
                                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                                      <FaExclamationCircle /> {rental.unavailabilityReason}
                                  </span>
                              )}
                          </button>
                      )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                 <h3 className="text-xl font-bold text-gray-800">Book {selectedItem.name}</h3>
                 <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleBooking} className="space-y-4">
              
              {/* Pricing Info */}
              <div className="bg-green-50 p-3 rounded text-center mb-4">
                  <p className="text-sm text-green-800">Rate: <span className="font-bold">₹{selectedItem.pricePerHour} / {selectedItem.priceUnit || 'hr'}</span></p>
              </div>

              <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-600">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 outline-none"
                    onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                    required
                  />
              </div>
              
              <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-600">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 bg-gray-50 outline-none"
                    onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                    required
                  />
              </div>

              <div className="flex gap-3 mt-6 pt-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedItem(null)} 
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalMarketplace;