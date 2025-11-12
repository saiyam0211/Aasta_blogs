const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  investorName: {
    type: String,
    required: true,
    trim: true
  },
  investorEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  investorPhone: {
    type: String,
    required: true,
    trim: true
  },
  investorLinkedIn: {
    type: String,
    trim: true,
    default: ''
  },
  investmentAmount: {
    type: Number,
    required: true,
    min: 1000 // Minimum ₹1,000
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true
  },
  razorpaySignature: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
investmentSchema.index({ createdAt: -1 });
investmentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Investment', investmentSchema);

