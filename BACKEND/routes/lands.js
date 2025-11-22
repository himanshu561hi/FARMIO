

// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/upload'); // Ensure this path is correct
// const landController = require('../controllers/landController');
// // const auth = require('../middleware/auth'); // Commented out since we aren't using it for guest posts yet

// // --- DEBUG LOGS (Optional, helps you see what is loaded) ---
// console.log("LandController loaded:", typeof landController);
// console.log("createLand:", typeof landController.createLand);
// console.log("getLands:", typeof landController.getLands);

// // 1. GET Route - Fetch all lands
// // ✅ MATCH NAME: Ensure this says 'getLands' (matching your controller)
// router.get('/', landController.getLands); 

// // 2. POST Route - Add new land
// // ✅ Uploads 5 images, then calls 'createLand'
// router.post('/add', upload.array('images', 5), landController.createLand);

// module.exports = router;



const express = require('express');
const router = express.Router();
const multer = require('multer'); // Multer import karein

// --- CLOUDINARY SETUP ---
// Ye path wahi hona chahiye jahan aapne cloudinary.js banaya hai
const { storage } = require('../config/cloudinary'); 

// Upload variable ab Cloudinary storage use karega
const upload = multer({ storage: storage });

const landController = require('../controllers/landController');

// --- DEBUG LOGS (As per your code) ---
console.log("LandController loaded:", typeof landController);
console.log("createLand:", typeof landController.createLand);
console.log("getLands:", typeof landController.getLands);

// 1. GET Route - Fetch all lands
router.get('/', landController.getLands); 

// 2. POST Route - Add new land
// Ye ab images ko seedha Cloudinary pe upload karega
router.post('/add', upload.array('images', 5), landController.createLand);

module.exports = router;