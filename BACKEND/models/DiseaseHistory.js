const mongoose = require("mongoose");

const diseaseHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Aapke User model ka naam
    required: true,
  },
  diseaseName: {
    type: String,
    required: true,
  },
  confidence: {
    type: String, // e.g., "95%"
  },
  symptoms: {
    type: String,
  },
  solution: {
    type: String, // Organic treatment
  },
  medicine: {
    type: String, // Chemical medicine
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
  // Agar future me Cloudinary use karein toh images ka URL yahan aayega
  // images: [String] 
});

module.exports = mongoose.model("DiseaseHistory", diseaseHistorySchema);