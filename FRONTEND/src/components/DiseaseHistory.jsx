import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const DiseaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please login to view history");
        return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/disease/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setHistory(data);
      } else {
        toast.error("History load nahi hui.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-800 mb-6">📑 Meri Fasal Reports (History)</h2>

        {loading ? (
          <p>Loading records...</p>
        ) : history.length === 0 ? (
          <div className="text-center p-10 bg-white rounded shadow">
            <p className="text-gray-500">Koi purana record nahi mila.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((record) => (
              <div key={record._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{record.diseaseName}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(record.scannedAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-sm text-green-600 mt-1 font-semibold">Confidence: {record.confidence}</p>
                
                <div className="mt-3 text-sm">
                    <p><strong>💊 Dawai:</strong> {record.medicine}</p>
                    <p className="mt-1 text-gray-600 line-clamp-2"><strong>🔍 Lakshan:</strong> {record.symptoms}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseHistory;