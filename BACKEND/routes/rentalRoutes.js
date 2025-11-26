const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

// --- 1. Middleware Fix ---
// Aapke auth middleware file se 'verifyToken' ya 'auth' jo bhi export ho raha hai,
// hum usse ek constant 'auth' mein store kar lenge taaki pure file mein 'auth' use kar sakein.
const { verifyToken } = require('../middleware/auth');
const auth = verifyToken; 

// --- 2. Upload Middleware Fix ---
let upload;
try {
    upload = require('../middleware/upload');
} catch (err) {
    console.log("Warning: Upload middleware not found. Image upload will fail.");
    upload = { single: () => (req, res, next) => next() }; 
}

// --- Routes ---

// Public Route
router.get('/all', rentalController.getAllRentals);

// Protected Routes (Login Required)
// (Note: Maine duplicate '/add' hata diya hai aur 'auth' use kiya hai)
router.post('/add', auth, upload.single('image'), rentalController.createRental);

router.post('/book', auth, rentalController.bookRental);
router.get('/my-listings', auth, rentalController.getMyListings);
router.get('/my-bookings', auth, rentalController.getMyBookings);

// Request Management
router.get('/requests-received', auth, rentalController.getIncomingRequests);
router.put('/status', auth, rentalController.updateRentalStatus);

// New Features (Delete & Toggle)
router.delete('/delete/:id', auth, rentalController.deleteRental);
router.put('/toggle-status/:id', auth, rentalController.toggleRentalAvailability);

module.exports = router;