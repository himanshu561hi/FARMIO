import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhoneAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { contactSeller } from '../utils/api'; // Assuming this API is now correctly defined

const LandContactModal = ({ land, onClose }) => {
  // Check logged-in user to pre-fill data
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  // Initializing form data
  const [formData, setFormData] = useState({
    // Prefill if available, otherwise blank
    buyerName: loggedInUser?.name || '',
    buyerPhone: loggedInUser?.mobile || loggedInUser?.phone || '', 
    message: `I am interested in your land: ${land.title} in ${land.location}. Please contact me.`,
    email: loggedInUser?.email || '', // Added email field
  });
  
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.buyerName || !formData.buyerPhone || !formData.message) {
      return toast.error("Please fill required fields.");
    }
    
    setLoading(true);

    try {
      // ✅ Payload Structure: Sending necessary IDs and contact details to the backend
      const payload = {
        landId: land._id,
        sellerId: land.seller?._id || land.seller, // Use seller object ID or raw ID
        buyerName: formData.buyerName,
        buyerPhone: formData.buyerPhone,
        message: formData.message,
        buyerEmail: formData.email, // Include email if provided
      };

      const token = localStorage.getItem('token');
      // API Call: Uses the correct, non-dynamic /lands/contact route
      await contactSeller(payload, token); 

      toast.success("Enquiry sent successfully! Seller will contact you.");
      
      // Close modal after successful submission
      setTimeout(() => onClose(), 1000);

    } catch (error) {
      console.error('Enquiry Submission Error:', error);
      // Display specific error if available, otherwise general failure
      toast.error(error.response?.data?.message || "Failed to send enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES (Kept inline for simplicity and consistency with original code) ---
  const styles = {
    formGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#555', fontWeight: '600' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f9f9f9' },
    textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', backgroundColor: '#f9f9f9' },
    submitBtn: { width: '100%', padding: '14px', backgroundColor: loading ? '#95a5a6' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'background 0.2s' },
    cancelBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#7f8c8d', border: 'none', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' },
    dividerText: { textAlign: 'center', color: '#aaa', fontSize: '0.9rem', fontWeight: '500' },
    socialSection: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
    socialButtonsContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
    socialBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s', color: 'white' },
    instaBtn: { backgroundColor: '#E1306C' }, 
    emailBtn: { backgroundColor: '#3498db' }
  };

  return (
    <div>
      <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', color: '#15803d', textAlign: 'center'}}>
        Contact Seller for {land.title}
      </h3>
      
      {/* 1. Main Enquiry Form */}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Name</label>
          <input type="text" name="buyerName" placeholder="e.g. Rahul Kumar" value={formData.buyerName} onChange={handleChange} required style={styles.input} disabled={!!loggedInUser?.name} />
        </div>

        <div style={{display: 'flex', gap: '15px'}}>
            <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>Phone Number</label>
                <input type="tel" name="buyerPhone" placeholder="+91 9876..." value={formData.buyerPhone} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>Email (Optional)</label>
                <input type="email" name="email" placeholder="rahul@example.com" value={formData.email} onChange={handleChange} style={styles.input} />
            </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required style={styles.textarea} />
        </div>

        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? 'Sending...' : 'Send Enquiry'}
        </button>
        
        <button type="button" onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
      </form>

      {/* 2. Direct Contact Buttons */}
      {(land.instagramId || land.sellerEmail) && (
          <div style={styles.socialSection}>
              <div style={styles.dividerText}>- Or Contact Directly -</div>
              
              <div style={styles.socialButtonsContainer}>
                {land.instagramId && (
                    <a 
                        href={`https://instagram.com/${land.instagramId}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{...styles.socialBtn, ...styles.instaBtn}}
                    >
                        <FaInstagram /> Instagram
                    </a>
                )}
                {land.sellerEmail && (
                    <a 
                        href={`mailto:${land.sellerEmail}`} 
                        style={{...styles.socialBtn, ...styles.emailBtn}}
                    >
                        <FaEnvelopeOpenText /> Email
                    </a>
                )}
              </div>
          </div>
      )}
    </div>
  );
};

export default LandContactModal;