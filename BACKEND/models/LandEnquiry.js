const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  // Reference to the Land being inquired about
  land: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Land', 
    required: true 
  },
  
  // Reference to the Seller (Farmer) who owns the land
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Details of the Buyer who sent the enquiry
  buyerName: { 
    type: String, 
    required: true 
  },
  buyerPhone: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  }, 
  
  // Status of the enquiry (For Farmer's dashboard tracking)
  status: { 
    type: String, 
    enum: ['Pending', 'Contacted', 'Closed'],
    default: 'Pending' 
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('LandEnquiry', enquirySchema);