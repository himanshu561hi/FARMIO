import React, { useEffect, useState } from 'react';
import { fetchMyListings, fetchMyBookings } from '../utils/api';

const RentalDashboard = () => {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'bookings'
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when tab changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'listings') {
          const { data } = await fetchMyListings();
          setListings(data);
        } else {
          const { data } = await fetchMyBookings();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Rental Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'listings' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('listings')}
        >
          My Listings (Owner)
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'bookings' ? 'border-b-2 border-green-600 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings (Renter)
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* VIEW: MY LISTINGS */}
          {activeTab === 'listings' && listings.length === 0 && <p>No equipment listed yet.</p>}
          {activeTab === 'listings' && listings.map((item) => (
            <div key={item._id} className="bg-white border rounded-lg shadow-sm flex flex-col">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded-t-lg" />
              <div className="p-4 flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-green-700 font-bold">₹{item.pricePerHour}/hr</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                </div>
              </div>
            </div>
          ))}

          {/* VIEW: MY BOOKINGS */}
          {activeTab === 'bookings' && bookings.length === 0 && <p>No bookings made yet.</p>}
          {activeTab === 'bookings' && bookings.map((booking) => (
            <div key={booking._id} className="bg-white border rounded-lg shadow-sm p-4">
               {/* Check if rental object exists (in case it was deleted) */}
               {booking.rental ? (
                <>
                  <div className="flex gap-4">
                    <img src={booking.rental.image} alt="rental" className="w-20 h-20 object-cover rounded" />
                    <div>
                      <h3 className="font-bold">{booking.rental.name}</h3>
                      <p className="text-sm text-gray-500">{booking.rental.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Start:</span>
                      <span className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>End:</span>
                      <span className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-lg font-bold text-gray-800">
                      <span>Total:</span>
                      <span>₹{booking.totalPrice}</span>
                    </div>
                    <div className={`mt-2 text-center py-1 rounded text-xs font-bold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </>
               ) : (
                 <p className="text-red-500">This item has been removed by the owner.</p>
               )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default RentalDashboard;