import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DiseaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null); // Modal ke liye state

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please login first");
        return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/disease/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        setHistory(data);
      } else {
        toast.error("History fetch failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- MODAL COMPONENT (Popup) ---
  const DetailModal = ({ record, onClose }) => {
    if (!record) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-green-600 animate-fadeIn">
          
          {/* Header */}
          <div className="bg-green-50 p-4 flex justify-between items-center border-b">
            <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
              🌿 Report Details
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl font-bold">&times;</button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {record.diseaseName}
              </span>
              <span className="text-gray-500 text-sm">{new Date(record.scannedAt).toLocaleDateString()}</span>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
               <p className="text-sm text-yellow-800 font-bold">AI Confidence Score</p>
               <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-2">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: record.confidence }}></div>
               </div>
               <p className="text-right text-xs mt-1 text-yellow-700">{record.confidence}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-1">🔍 Lakshan (Symptoms):</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded border">{record.symptoms}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-1">💊 Upchar (Medicine):</h4>
              <p className="text-green-700 font-medium bg-green-50 p-3 rounded border border-green-200">{record.medicine}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t text-right">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
            >
              Band Karein
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50/50"> {/* Farming Background Color */}
      
      {/* Container */}
      <div className="w-full mt-28 px-4 md:px-8 pb-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-green-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-green-900 flex items-center gap-3">
              🌾 Meri Fasal Reports
            </h2>
            <p className="text-green-700 mt-1">Purani bimariyon ka record aur upchar</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-green-100 mt-4 md:mt-0">
            <span className="text-green-800 font-bold text-lg">{history.length}</span> <span className="text-gray-500 text-sm">Reports Found</span>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-xl shadow border border-dashed border-green-300">
            <p className="text-xl text-gray-400">🌱 Abhi tak koi record nahi hai.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {history.map((record) => (
              <div key={record._id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 group">
                
                {/* Card Header (Green Strip) */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 flex justify-between items-center">
                   <h3 className="text-white font-bold truncate pr-2">{record.diseaseName}</h3>
                   <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded backdrop-blur-sm">
                     {new Date(record.scannedAt).toLocaleDateString()}
                   </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                   {/* Confidence Bar */}
                   <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Sahi hone ke chance</span>
                        <span className="text-green-600 font-bold">{record.confidence}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div> 
                        {/* Note: real width ke liye record.confidence ko parse karna padega agar wo string '80%' hai */}
                      </div>
                   </div>

                   <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-semibold text-gray-800">⚠️ Lakshan:</span> {record.symptoms}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        <span className="font-semibold text-gray-800">💊 Upchar:</span> {record.medicine}
                      </p>
                   </div>

                   {/* Full Details Button */}
                   <button 
                     onClick={() => setSelectedRecord(record)}
                     className="w-full mt-2 py-2.5 rounded-lg border-2 border-green-600 text-green-700 font-semibold hover:bg-green-600 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group-hover:bg-green-600 group-hover:text-white"
                   >
                     👁️ Puri Jankari Dekhein
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Modal if record is selected */}
      {selectedRecord && (
        <DetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}

    </div>
  );
};

export default DiseaseHistory;