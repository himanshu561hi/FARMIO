// const express = require('express');
// const router = express.Router();
// const { verifyToken } = require('../middleware/auth');

// // Debug imports
// console.log('=== Lands Route Debug ===');
// let auth, upload, landController;
// try {
//   auth = require('../middleware/auth');
//   console.log('Auth loaded:', typeof auth); // Should be 'function'

//   upload = require('../middleware/upload');
//   console.log('Upload loaded:', typeof upload); // Should be 'object' or 'function'

//   landController = require('../controllers/landController');
//   console.log('LandController loaded:', typeof landController); // Should be 'object'

//   console.log('createLand:', typeof landController.createLand); // This should be 'function'
//   console.log('getLands:', typeof landController.getLands); // Same
// } catch (err) {
//   console.error('Import failed:', err.message);
//   throw err; // Crash with details
// }

// const { createLand, getLands, getLandById, contactSeller, markAsSold } = landController;

// // Now define routes only if functions are valid
// if (typeof createLand !== 'function') {
//   throw new Error('createLand is not a function! Check exports in landController.js');
// }
// router.post('/add', upload.array('images', 5), createLand);
// router.get('/', getLands);
// router.get('/:id', getLandById);
// router.post('/:id/contact', auth.verifyToken, contactSeller);
// router.put('/:id/sold', auth.verifyToken, markAsSold);
// console.log('=== Lands Routes Defined Successfully ===');

// module.exports = router;


const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Ensure this path is correct
const landController = require('../controllers/landController');
// const auth = require('../middleware/auth'); // Commented out since we aren't using it for guest posts yet

// --- DEBUG LOGS (Optional, helps you see what is loaded) ---
console.log("LandController loaded:", typeof landController);
console.log("createLand:", typeof landController.createLand);
console.log("getLands:", typeof landController.getLands);

// 1. GET Route - Fetch all lands
// ✅ MATCH NAME: Ensure this says 'getLands' (matching your controller)
router.get('/', landController.getLands); 

// 2. POST Route - Add new land
// ✅ Uploads 5 images, then calls 'createLand'
router.post('/add', upload.array('images', 5), landController.createLand);

module.exports = router;