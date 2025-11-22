
const Land = require('../models/Land');

// Optional: Import Google Maps Client if needed (Not changing this)
// const { googleClient } = require('../config/maps'); 

exports.createLand = async (req, res) => {
  try {
    // 1. Destructure all fields from the request body (Existing Logic)
    const { title, description, price, location, area, coordinates, tags, sellerEmail, instagramId } = req.body;

    // 2. Define variables (Existing Logic)
    let parsedTags = [];
    let parsedCoords = null;

    // 3. Safe JSON Parsing for Tags (Existing Logic)
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        console.error("Error parsing tags:", e.message);
        parsedTags = []; 
      }
    }

    // 4. Safe JSON Parsing for Coordinates (Existing Logic)
    if (coordinates) {
      try {
        parsedCoords = JSON.parse(coordinates);
      } catch (e) {
        console.error("Error parsing coordinates:", e.message);
        parsedCoords = null;
      }
    }

    // --- 5. Handle Image Uploads (UPDATED FOR CLOUDINARY) ---
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      // CHANGE: 'file.filename' ki jagah 'file.path' use kiya kyuki Cloudinary full URL deta hai
      imagePaths = req.files.map(file => file.path); 
    }

    // 6. Create the New Land Object (Existing Logic)
    const newLand = new Land({
      title,
      description,
      price,
      location,
      area,
      
      images: imagePaths, // Ab isme Cloudinary ke URLs honge

      // Use the parsed values here
      coordinates: parsedCoords, 
      tags: parsedTags,

      sellerEmail: sellerEmail || null,
      instagramId: instagramId || null,

      // Handle User ID 
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

// --- Other Controllers (Existing Logic) ---

exports.getLands = async (req, res) => {
  try {
    // Sort by createdAt -1 to show newest first
    const lands = await Land.find().sort({ createdAt: -1 });
    res.json({ success: true, count: lands.length, data: lands });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};