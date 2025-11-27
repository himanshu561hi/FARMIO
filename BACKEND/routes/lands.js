const express = require('express');
const router = express.Router();
const multer = require('multer');

// --- IMPORTS ---
// Auth Middleware (robust import)
const authMiddleware = require('../middleware/auth');
const auth = authMiddleware.auth || authMiddleware.verifyToken || authMiddleware; 

// Cloudinary/Multer Setup
const { storage } = require('../config/cloudinary'); 
const upload = multer({ storage: storage });

// ✅ CONTROLLER IMPORTS: Destructure all required functions
const { 
  createLand, 
  getAllLands, 
  getMyLands, 
  getMyLandEnquiries, 
  contactSeller, 
  deleteLand,
  updateEnquiryStatus,
} = require('../controllers/landController'); 

// ============================
//        LAND ROUTES
// ============================

// 1. Get All Lands (Public - Marketplace)
router.get('/', getAllLands); 

// 2. Create Land Listing (Protected)
router.post('/add', 
  auth, 
  upload.array('images', 5), 
  createLand // Direct function reference
);

// 3. Get My Lands (Protected - Dashboard List)
router.get('/my-lands', auth, getMyLands);

// 4. Delete Land (Protected)
router.delete('/delete/:id', auth, deleteLand);

// 5. Get My Enquiries (Protected - CRASH LOCATION FIX)
router.get('/my-enquiries', auth, getMyLandEnquiries);

// 6. Contact Seller
router.post('/contact', auth, contactSeller);

router.put('/enquiry-status', auth, updateEnquiryStatus);

module.exports = router;