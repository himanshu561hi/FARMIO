// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const rateLimit = require('express-rate-limit');

// // --- FIX: VerifyToken ko Import karna zaroori hai ---
// // Check karein ki aapke project me ye file 'middleware' folder me 'authMiddleware.js' naam se hai ya kisi aur naam se.
// const { verifyToken } = require('../middleware/auth'); 

// const { 
//   detectDiseaseGuest, 
//   saveScanResult, 
//   getScanHistory 
// } = require('../controllers/diseaseController');

// // Upload Setup (Temporary Folder)
// const upload = multer({ dest: 'uploads/' });

// // Rate Limiter (Bina login walon ke liye security)
// // 1 IP se 1 ghante me sirf 10 requests allow hongi
// const guestLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 Hour
//   max: 10, 
//   message: { error: "Hourly limit reached. Please login for unlimited scans." }
// });

// // Route: POST /api/disease/guest-scan
// // Isme verifyToken nahi chahiye (Guest access)
// router.post('/guest-scan', guestLimiter, upload.array('photos', 5), detectDiseaseGuest);

// // 1. Report Save Karne ke liye (POST)
// // Isme verifyToken chahiye (Login zaroori hai)
// router.post('/save', verifyToken, saveScanResult);

// // 2. Purani History Dekhne ke liye (GET)
// // Isme verifyToken chahiye (Login zaroori hai)
// router.get('/history', verifyToken, getScanHistory);

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');

// --- FIX: Sahi Import (Curly Braces Zaroori Hain) ---
// Aapke auth.js mein { verifyToken } export hua hai
const { verifyToken } = require('../middleware/auth'); 

const { 
  detectDiseaseGuest, 
  saveScanResult, 
  getScanHistory 
} = require('../controllers/diseaseController');

// --- DEBUG LOGS (Tasalli ke liye) ---
console.log("---------------- SYSTEM CHECK ----------------");
console.log("1. VerifyToken Middleware:", typeof verifyToken); // 'function' aana chahiye
console.log("2. Save Controller:", typeof saveScanResult);     // 'function' aana chahiye
console.log("----------------------------------------------");

// Upload Setup
const upload = multer({ dest: 'uploads/' });

// --- ROUTES ---

// 1. Guest Scan (Isme login nahi chahiye)
router.post('/guest-scan', upload.array('photos', 5), detectDiseaseGuest);

// 2. Save Report (Login Zaroori)
// 'auth' ki jagah 'verifyToken' use karein
router.post('/save', verifyToken, saveScanResult);

// 3. Get History (Login Zaroori)
router.get('/history', verifyToken, getScanHistory);

module.exports = router;