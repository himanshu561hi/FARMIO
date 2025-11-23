
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import Hook for navigation
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- CONSTANTS ---
const containerStyle = { width: '100%', height: '300px', borderRadius: '10px', marginTop: '10px' };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const libraries = ['places'];

const ListLand = () => {
  const navigate = useNavigate(); 

  // 1. Load Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY, 
    libraries: libraries 
  });

  // 2. State Management
  const [formData, setFormData] = useState({ title: '', description: '', price: '', location: '', area: '', sellerEmail: '', instagramId: '' });
  const [coordinates, setCoordinates] = useState(defaultCenter);
  
  // Tags State
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  const [mapRef, setMapRef] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Cleanup preview URLs to avoid memory leaks
  useEffect(() => {
    return () => { previews.forEach(url => URL.revokeObjectURL(url)); };
  }, [previews]);

  // --- MAP HANDLERS ---
  const onLoad = useCallback((map) => setMapRef(map), []);
  const onUnmount = useCallback(() => setMapRef(null), []);

  const onMarkerDragEnd = (e) => {
    setCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const handleAddressBlur = async () => {
    if (!formData.location || !window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 'address': formData.location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const newCoords = { lat: location.lat(), lng: location.lng() };
        setCoordinates(newCoords);
        mapRef?.panTo(newCoords);
        mapRef?.setZoom(15);
        toast.info('📍 Map centered to address!', { autoClose: 2000 });
      }
    });
  };

  // --- TAGS HANDLER ---
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Stop form submit
      const val = currentTag.trim();
      if (val && !tags.includes(val)) {
        if (tags.length >= 5) {
            toast.warn("Maximum 5 keywords allowed!");
            return;
        }
        setTags([...tags, val]);
        setCurrentTag('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // --- IMAGE HANDLERS ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate Map Pin (Check if user moved it from default)
    if (coordinates.lat === 20.5937 && coordinates.lng === 78.9629) {
         toast.warn('⚠️ Please pin the exact location on the map!');
         setLoading(false);
         return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach(img => data.append('images', img));
    
    // Send Objects as JSON Strings
    data.append('coordinates', JSON.stringify(coordinates));
    data.append('tags', JSON.stringify(tags));

    const headers = { 'Content-Type': 'multipart/form-data' };
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      await axios.post(`${BACKEND_URL}/api/lands/add`, data, { headers });
      
      toast.success('🚀 Land listed successfully!');

      // Reset Form
      setFormData({ title: '', description: '', price: '', location: '', area: '' });
      setImages([]);
      setPreviews([]);
      setTags([]);
      setCoordinates(defaultCenter);
      
      // Optional: Navigate back after success
      setTimeout(() => navigate('/lands'), 2000); 

    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.response?.data?.msg || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: { marginTop: '40px', maxWidth: '1000px', margin: '3rem auto', backgroundColor: '#fff', padding: '2.55rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', fontFamily: "'Poppins', sans-serif", position: 'relative' },
    // Back Button Style
    backBtn: { 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        background: 'none', 
        border: 'none', 
        color: '#7f8c8d', 
        fontSize: '0.9rem', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px',
        fontWeight: '600'
    },
    header: { textAlign: 'center', color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '700', marginTop: '20px' },
    subHeader: { textAlign: 'center', color: '#7f8c8d', marginBottom: '2rem', fontSize: '0.95rem' },
    formGroup: { marginBottom: '1.2rem' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#34495e', fontSize: '0.9rem' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '15px', color: '#95a5a6', fontSize: '1.1rem' },
    input: { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '1rem', backgroundColor: '#f9f9f9', outline: 'none' },
    textarea: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '1rem', backgroundColor: '#f9f9f9', minHeight: '120px', fontFamily: 'inherit', resize: 'vertical', outline: 'none' },
    row: { display: 'flex', gap: '15px' },
    col: { flex: 1 },
    uploadBox: { border: '2px dashed #3498db', borderRadius: '10px', padding: '2rem', textAlign: 'center', backgroundColor: '#f0f8ff', cursor: 'pointer', position: 'relative' },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
    uploadText: { color: '#3498db', fontWeight: '600', marginTop: '10px' },
    previewContainer: { display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' },
    previewWrapper: { position: 'relative', width: '80px', height: '80px' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' },
    removeBtn: { position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    submitBtn: { width: '100%', padding: '16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1.5rem', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)' },
    mapHelp: { fontSize: '0.85rem', color: '#e67e22', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' },
    
    // Tag Styles
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
    tag: { backgroundColor: '#e0f7fa', color: '#006064', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #b2ebf2' },
    tagClose: { cursor: 'pointer', fontWeight: 'bold', color: '#006064', fontSize: '1rem', display: 'flex', alignItems: 'center' }
  };

  return (
    <div style={styles.container}>
      {/* Ensure Toast is high enough */}
      <ToastContainer style={{ zIndex: 100000 }} />
      
      {/* ✅ BACK BUTTON */}
      <button 
        style={styles.backBtn} 
        onClick={() => navigate('/lands')} // Navigate to your land list route
        onMouseOver={(e) => e.target.style.color = '#2c3e50'}
        onMouseOut={(e) => e.target.style.color = '#7f8c8d'}
        className="back-button mt-15"
      >
        ← Back to Lands
      </button>

      <h2 style={styles.header}>Sell Your Land</h2>
      <p style={styles.subHeader}>Fill details & pin exact location on map.</p>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Property Title</label>
          <div style={styles.inputWrapper}>
            <span style={styles.icon}>📝</span>
            <input type="text" placeholder="e.g. Fertile Farmland" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
          </div>
        </div>

        {/* Price & Area */}
        <div style={styles.row}>
          <div style={styles.col}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹)</label>
              <div style={styles.inputWrapper}>
                <span style={styles.icon}>₹</span>
                <input type="number" placeholder="1500000" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={styles.input} />
              </div>
            </div>
          </div>
          <div style={styles.col}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Area Size</label>
              <div style={styles.inputWrapper}>
                <span style={styles.icon}>📐</span>
                <input type="text" placeholder="e.g. 5 Acres" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} required style={styles.input} />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Location Address</label>
          <div style={styles.inputWrapper}>
            <span style={styles.icon}>📍</span>
            <input type="text" placeholder="Type City/Village (e.g. Ghaziabad)" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} onBlur={handleAddressBlur} required style={styles.input} />
          </div>
          
          {isLoaded ? (
            <>
              <GoogleMap mapContainerStyle={containerStyle} center={coordinates} zoom={10} onLoad={onLoad} onUnmount={onUnmount} onClick={(e) => setCoordinates({ lat: e.latLng.lat(), lng: e.latLng.lng() })}>
                 <Marker position={coordinates} draggable={true} onDragEnd={onMarkerDragEnd} />
              </GoogleMap>
              <div style={styles.mapHelp}>👆 <strong>Tip:</strong> Drag the red marker to the exact land spot.</div>
            </>
          ) : <p>Loading Map...</p>}
        </div>

        {/* Keywords / Tags */}
        <div style={styles.formGroup}>
            <label style={styles.label}>Keywords / Tags (Max 5)</label>
            <div style={styles.inputWrapper}>
                <span style={styles.icon}>🏷️</span>
                <input 
                    type="text" 
                    placeholder="Type and press Enter (e.g. Highway Access, Organic)" 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)} 
                    onKeyDown={handleTagKeyDown}
                    style={styles.input} 
                />
            </div>
            <div style={styles.tagContainer}>
                {tags.map((tag, index) => (
                    <div key={index} style={styles.tag}>
                        #{tag}
                        <span style={styles.tagClose} onClick={() => removeTag(index)}>×</span>
                    </div>
                ))}
            </div>
        </div>





        {/* ✅ NEW SECTION: SOCIAL & CONTACT (OPTIONAL) */}
        <div style={{marginTop: '20px', marginBottom: '10px'}}>
            <h3 style={{fontSize: '1.1rem', color: '#2c3e50', marginBottom: '10px'}}>📞 Contact Details (Optional)</h3>
            <div style={styles.row}>
                <div style={styles.col}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Instagram Username</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.icon}>📸</span>
                            <input 
                                type="text" 
                                placeholder="e.g. farmer_john (No @)" 
                                value={formData.instagramId} 
                                onChange={(e) => setFormData({...formData, instagramId: e.target.value})} 
                                style={styles.input} 
                            />
                        </div>
                    </div>
                </div>
                <div style={styles.col}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Public Email</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.icon}>📧</span>
                            <input 
                                type="email" 
                                placeholder="For buyers to contact" 
                                value={formData.sellerEmail} 
                                onChange={(e) => setFormData({...formData, sellerEmail: e.target.value})} 
                                style={styles.input} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>







        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea placeholder="Details..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={styles.textarea} />
        </div>

        {/* Image Upload */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Images</label>
          <div style={styles.uploadBox}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
            <div style={{fontSize: '2rem'}}>📷</div>
            <div style={styles.uploadText}>Click or Drag photos here</div>
          </div>
          {previews.length > 0 && (
            <div style={styles.previewContainer}>
              {previews.map((src, index) => (
                <div key={index} style={styles.previewWrapper}>
                  <img src={src} alt="Preview" style={styles.previewImg} />
                  <button type="button" style={styles.removeBtn} onClick={() => removeImage(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? 'Uploading...' : '🚀 Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default ListLand;