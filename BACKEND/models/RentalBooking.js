const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RentalBooking', bookingSchema);