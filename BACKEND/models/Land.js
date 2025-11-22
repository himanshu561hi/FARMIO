const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true }, // Address string (user input)
  area: { type: String, required: true }, // e.g., "5 acres"
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }, // Geocoded from address
  tags: {
      type: [String],
      default: []
  },
  images: [{ type: String }], // Image URLs
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
  sellerEmail: { type: String, required: false }, 
  instagramId: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Land', landSchema);