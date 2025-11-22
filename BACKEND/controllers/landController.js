// const Land = require('../models/Land');
// const LandContact = require('../models/LandContact');
// const nodemailer = require('nodemailer');
// const { Client } = require('@googlemaps/google-maps-services-js');
// const googleClient = new Client({});

// // Create land listing (with geocoding)
// // exports.createLand = async (req, res) => {
// //   try {
// //     const { title, description, price, location, area } = req.body;
    
// //     if (!location) {
// //       return res.status(400).json({ msg: 'Location address is required' });
// //     }

// //     // Geocode address to lat/lng
// //     const geocodeResponse = await googleClient.geocode({
// //       params: { address: location, key: process.env.GOOGLE_API_KEY }
// //     });

// //     if (geocodeResponse.data.results.length === 0) {
// //       return res.status(400).json({ msg: 'Invalid address - Could not geocode location' });
// //     }

// //     const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

// //     // FIX 1: Handle Image Upload correctly
// //     // If using upload.single('image'), the file is in req.file (object), not req.files (array).
// //     // If using upload.array('images'), it is in req.files.
// //     let imagePaths = [];
// //     if (req.files && req.files.length > 0) {
// //         imagePaths = req.files.map(file => `/uploads/${file.filename}`);
// //     } else if (req.file) {
// //         imagePaths = [`/uploads/${req.file.filename}`];
// //     }

// //     const newLand = new Land({
// //       title, 
// //       description, 
// //       price, 
// //       location, 
// //       area, 
// //       images: imagePaths,
// //       coordinates: { lat, lng },
// //       // FIX 2: Handle missing user (Temporary Guest Mode)
// //       // If req.user exists (logged in), use ID. If not, use null or a temporary placeholder.
// //       seller: req.user ? req.user.id : null 
// //     });

// //     await newLand.save();
// //     res.status(201).json({ msg: 'Land listed successfully', land: newLand });
// //   } catch (err) {
// //     console.error('Error:', err);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // };




// exports.createLand = async (req, res) => {
//   try {
//     const { title, description, price, location, area, coordinates } = req.body;
//     // coordinates ab JSON String banke aayega, usko parse karna padega

//     let lat, lng;

//     // Case 1: Agar Frontend se accurate coordinates aaye hain
//     if (coordinates) {
//         const parsedCoords = JSON.parse(coordinates);
//         lat = parsedCoords.lat;
//         lng = parsedCoords.lng;
//     } 
//     // Case 2: Agar nahi aaye, to purana logic (Geocoding) use karein (Fallback)
//     else {
//         const geocodeResponse = await googleClient.geocode({
//            params: { address: location, key: process.env.GOOGLE_API_KEY }
//         });
//         if (geocodeResponse.data.results.length > 0) {
//            const loc = geocodeResponse.data.results[0].geometry.location;
//            lat = loc.lat;
//            lng = loc.lng;
//         }
//     }

//     // Handle Images
//     let imagePaths = [];
//     if (req.files && req.files.length > 0) {
//         imagePaths = req.files.map(file => `/uploads/${file.filename}`);
//     }

//     const newLand = new Land({
//       title, description, price, location, area, 
//       images: imagePaths,
//       coordinates: { lat, lng }, // ✅ Saved exact coords
//       tags: parsedTags,
//       seller: req.user ? req.user.id : null 
//     });

//     await newLand.save();
//     res.status(201).json({ msg: 'Land listed successfully', land: newLand });
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// };






// // Get all available lands
// exports.getLands = async (req, res) => {
//   try {
//     const lands = await Land.find({ status: 'available' }).populate('seller', 'name email phone');
//     res.json(lands);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Get single land
// exports.getLandById = async (req, res) => {
//   try {
//     const land = await Land.findById(req.params.id).populate('seller', 'name email phone');
//     if (!land) return res.status(404).json({ msg: 'Land not found' });
//     res.json(land);
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Contact seller
// exports.contactSeller = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const land = await Land.findById(req.params.id).populate('seller', 'email');
//     if (!land) return res.status(404).json({ msg: 'Land not found' });

//     const newContact = new LandContact({
//       landId: req.params.id,
//       buyer: req.user.id,
//       message,
//       sellerEmail: land.seller.email
//     });
//     await newContact.save();

//     // Email to seller
//     const transporter = nodemailer.createTransporter({
//       service: 'gmail',
//       auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
//     });
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: land.seller.email,
//       subject: `New Inquiry for Land: ${land.title}`,
//       html: `
//         <h3>New Buy Inquiry!</h3>
//         <p><strong>Buyer:</strong> ${req.user.name} (${req.user.email})</p>
//         <p><strong>Message:</strong> ${message}</p>
//         <p><strong>Land:</strong> ${land.title} - ${land.location} (${land.area}) - ₹${land.price}</p>
//       `
//     });

//     res.json({ msg: 'Contact sent successfully!' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Mark as sold
// exports.markAsSold = async (req, res) => {
//   try {
//     const land = await Land.findOne({ _id: req.params.id, seller: req.user.id });
//     if (!land) return res.status(404).json({ msg: 'Not found or not yours' });
//     land.status = 'sold';
//     await land.save();
//     res.json({ msg: 'Marked as sold' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// };



const Land = require('../models/Land');

// Optional: Import Google Maps Client if you use server-side geocoding as fallback
// const { googleClient } = require('../config/maps'); 

exports.createLand = async (req, res) => {
  try {
    // 1. Destructure all fields from the request body
    const { title, description, price, location, area, coordinates, tags, sellerEmail, instagramId } = req.body;

    // 2. ✅ FIX: Define variables at the top level so they are available everywhere
    let parsedTags = [];
    let parsedCoords = null;

    // 3. Safe JSON Parsing for Tags
    // Frontend sends tags as a JSON string: "['farm', 'highway']"
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        console.error("Error parsing tags:", e.message);
        parsedTags = []; // Fallback to empty array
      }
    }

    // 4. Safe JSON Parsing for Coordinates
    // Frontend sends coords as a JSON string: "{"lat": 20.5, "lng": 78.9}"
    if (coordinates) {
      try {
        parsedCoords = JSON.parse(coordinates);
      } catch (e) {
        console.error("Error parsing coordinates:", e.message);
        parsedCoords = null;
      }
    }

    // 5. Handle Image Uploads
    // Multer puts files in req.files (array)
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // 6. Create the New Land Object
    const newLand = new Land({
      title,
      description,
      price,
      location,
      area,
      images: imagePaths,
      
      // Use the parsed values here
      coordinates: parsedCoords, 
      tags: parsedTags,

      sellerEmail: sellerEmail || null,
      instagramId: instagramId || null,
      

      // Handle User ID (If logged in, use ID; if Guest, use null)
      seller: req.user ? req.user.id : null 
    });

    // 7. Save to Database
    await newLand.save();

    // 8. Send Success Response
    res.status(201).json({ 
      msg: 'Land listed successfully', 
      land: newLand 
    });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// --- Other Controllers (Get All, Get One, etc.) can remain below ---

exports.getLands = async (req, res) => {
  try {
    // Sort by createdAt -1 to show newest first (Backend Sorting)
    const lands = await Land.find().sort({ createdAt: -1 });
    res.json({ success: true, count: lands.length, data: lands });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};