const Land = require('../models/Land');
const LandEnquiry = require('../models/LandEnquiry');
// const cloudinary = require('cloudinary').v2; // No need to import here if using middleware storage

// --- 1. CREATE LAND LISTING ---
exports.createLand = async (req, res) => {
  try {
    // 1. ✅ CRITICAL AUTH CHECK: Stop execution if user is not logged in.
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'Authentication required to list property.' });
    }

    // 2. Destructure fields
    const { title, description, price, seller, location, area, coordinates, tags, sellerEmail, instagramId, listingType } = req.body;

    // 3. Define variables & Parsing (Existing Logic)
    let parsedTags = [];
    let parsedCoords = null;

    if (tags) {
      try { parsedTags = JSON.parse(tags); } catch (e) { console.error("Error parsing tags:", e.message); parsedTags = tags.split(','); }
    }
    if (coordinates) {
      try { parsedCoords = JSON.parse(coordinates); } catch (e) { console.error("Error parsing coordinates:", e.message); parsedCoords = null; }
    }

    // 4. Image Handling (Reading URLs from Multer-Cloudinary Storage)
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      // Multer-Cloudinary already uploaded the file; 'file.path' is the final URL
      imagePaths = req.files.map(file => file.path); 
    }

    // 5. Create the New Land Object
    const newLand = new Land({
      title,
      description,
      price,
      seller,
      location,
      area,
      images: imagePaths,
      coordinates: parsedCoords, 
      tags: parsedTags,
      listingType: listingType || 'Sell', // Assuming this field exists in req.body or model
      sellerEmail: sellerEmail || null,
      instagramId: instagramId || null,

      // ✅ FIX: Assigning the logged-in user ID to the required 'seller' field
      seller: req.user._id,
    });

    // 6. Save and Populate Seller Name for immediate response
    await newLand.save();
    await newLand.populate('seller', 'name email mobile'); // Populate details for frontend

    res.status(201).json({ msg: 'Land listed successfully', land: newLand });

  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// --- 2. GET ALL LANDS (Public Marketplace) ---
exports.getAllLands = async (req, res) => { // Renamed from getLands for router consistency
  try {
    const lands = await Land.find({ status: 'available' })
      .populate('seller', 'name email mobile')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: lands.length, data: lands });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyLands = async (req, res) => {
  try {
    // Current user's ID
    const userId = req.user._id; 

    const myLands = await Land.find({ seller: userId })
      .sort({ createdAt: -1 });
    

    res.status(200).json({ success: true, data: myLands });
  } catch (error) {
    res.status(500).json({ message: "Server Error during fetch MyLands", error: error.message });
  }
};

// --- 4. DELETE LAND ---
exports.deleteLand = async (req, res) => {
  try {
    const land = await Lands.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    // Ownership Check
    if (land.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await Land.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Land listing deleted successfully" });

  } catch (error) {
    res.status(500).send('Server Error');
  }
};

// --- 5. GET ENQUIRIES (Farmer Dashboard) ---
exports.getMyLandEnquiries = async (req, res) => {
  try {
    const enquiries = await LandEnquiry.find({ seller: req.user._id })
      .populate('land', 'title images price') 
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    console.error("❌ CRASH TRACE (Enquiries):", error.stack);
    res.status(500).send('Server Error');
  }
};

// --- 6. CONTACT SELLER (For Buyers) ---
exports.contactSeller = async (req, res) => {
  try {
    const { landId, buyerName, buyerPhone, message } = req.body;

    const land = await Land.findById(landId);
    if (!land) return res.status(404).json({ message: "Land not found" });

    const newEnquiry = new LandEnquiry({
      land: landId,
      seller: land.seller, 
      buyerName,
      buyerPhone,
      message,
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry sent successfully!" });

  } catch (error) {
    res.status(500).json({ message: "Failed to send enquiry", error: error.message });
  }
};


// --- 7. UPDATE ENQUIRY STATUS (NEW) ---
exports.updateEnquiryStatus = async (req, res) => {
    const { enquiryId, newStatus } = req.body;

    try {
        const LandEnquiry = require('../models/LandEnquiry');
        const enquiry = await LandEnquiry.findById(enquiryId);
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        // Security Check: Ensure logged-in user is the actual seller (owner)
        if (enquiry.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        // Status update
        enquiry.status = newStatus;
        await enquiry.save();

        res.status(200).json({ message: "Status updated successfully", enquiry });
    } catch (error) {
        console.error("Enquiry Status Update Error:", error);
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};