import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

const LandContactModal = ({ land, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in your land: ${land.title} at ${land.location}. Please contact me.`
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await axios.post(`${BACKEND_URL}/api/lands/${land._id}/contact`, formData, {
        headers: { 
            Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' 
        }
      });
      
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const styles = {
    formGroup: { marginBottom: '15px', textAlign: 'left' },
    label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#555', fontWeight: '600' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' },
    textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' },
    submitBtn: { width: '100%', padding: '14px', backgroundColor: loading ? '#95a5a6' : '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'background 0.2s' },
    cancelBtn: { width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#7f8c8d', border: 'none', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' },
    successMsg: { padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', textAlign: 'center', marginBottom: '15px' },
    errorMsg: { padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', textAlign: 'center', marginBottom: '15px' },
    
    // ✅ Social Button Styles (Updated for bottom layout)
    socialSection: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
    socialButtonsContainer: { display: 'flex', gap: '10px', marginTop: '10px' },
    socialBtn: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        flex: 1, // Equal width
        padding: '12px', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none',
        fontSize: '0.95rem', transition: 'opacity 0.2s', color: 'white'
    },
    instaBtn: { backgroundColor: '#E1306C' }, // Instagram Color
    emailBtn: { backgroundColor: '#3498db' }, // Blue for Email
    dividerText: { textAlign: 'center', color: '#aaa', fontSize: '0.9rem', fontWeight: '500' }
  };

  return (
    <div>
      {status === 'success' && <div style={styles.successMsg}>✅ Message sent to seller successfully!</div>}
      {status === 'error' && <div style={styles.errorMsg}>❌ Failed to send message. Please try again.</div>}

      {/* 1. Form is now at the TOP */}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Your Name</label>
          <input type="text" name="name" placeholder="e.g. Rahul Kumar" value={formData.name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={{display: 'flex', gap: '15px'}}>
            <div style={{...styles.formGroup, flex: 1}}>
                <label style={styles.label}>Phone Number</label>
                <input type="tel" name="phone" placeholder="+91 9876..." value={formData.phone} onChange={handleChange} required style={styles.input} />
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

      {/* 2. ✅ MOVED: Direct Contact Buttons (Bottom) */}
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
                        onMouseOver={e => e.target.style.opacity = 0.9}
                        onMouseOut={e => e.target.style.opacity = 1}
                    >
                        Instagram
                    </a>
                )}
                {land.sellerEmail && (
                    <a 
                        href={`mailto:${land.sellerEmail}`} 
                        style={{...styles.socialBtn, ...styles.emailBtn}}
                        onMouseOver={e => e.target.style.opacity = 0.9}
                        onMouseOut={e => e.target.style.opacity = 1}
                    >
                        Email
                    </a>
                )}
              </div>
          </div>
      )}
    </div>
  );
};

export default LandContactModal;