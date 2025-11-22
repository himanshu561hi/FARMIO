const mongoose = require('mongoose');

const landContactSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'Land', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  status: { type: String, enum: ['sent', 'replied'], default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LandContact', landContactSchema);