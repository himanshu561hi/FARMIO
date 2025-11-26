const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true }, // e.g., "John Deere 5050D"
  category: { 
    type: String, 
    enum: ['Tractor', 'Harvester', 'Tillage', 'Sprayer', 'Other'],
    required: true 
  },
  image: { type: String, required: true }, // Cloudinary URL
  description: { type: String },
  pricePerHour: { type: Number, required: true },
  location: { type: String, required: true },
  available: { type: Boolean, default: true },
  unavailabilityReason: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);