const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'farmio_land_files', // Cloudinary pe is naam ka folder banega
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file types
    // Agar aapko public_id (filename) custom rakhna hai:
    public_id: (req, file) => `land_${Date.now()}_${file.originalname.split('.')[0]}`,
  },
});

module.exports = { cloudinary, storage };