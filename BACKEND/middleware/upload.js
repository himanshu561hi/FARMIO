// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };



const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config(); // Ensure env vars are loaded

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Setup (DiskStorage ki jagah CloudinaryStorage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'farmio_rentals', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // Optional: Custom filename format
    public_id: (req, file) => `rental_${Date.now()}_${file.originalname.split('.')[0]}`,
  },
});

// 3. File Filter (Aapka purana logic intact)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// 4. Initialize Multer
const upload = multer({ 
  storage: storage, // Ab ye Cloudinary use karega
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit check
});

module.exports = upload;