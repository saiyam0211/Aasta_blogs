const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createOrder,
  verifyPayment,
  getInvestmentsData
} = require('../controllers/paymentController');

const router = express.Router();

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation middleware for order creation
const orderValidation = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isInt({ min: 100 })
    .withMessage('Amount must be at least ₹1 (100 paise)'),
  body('currency')
    .optional()
    .isString()
    .withMessage('Currency must be a string'),
  body('receipt')
    .notEmpty()
    .withMessage('Receipt ID is required')
    .isString()
    .withMessage('Receipt ID must be a string'),
  handleValidationErrors
];

// Validation middleware for payment verification
const paymentVerificationValidation = [
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Payment signature is required'),
  body('investorName')
    .notEmpty()
    .withMessage('Investor name is required'),
  body('investorEmail')
    .notEmpty()
    .isEmail()
    .withMessage('Valid investor email is required'),
  body('investorPhone')
    .notEmpty()
    .withMessage('Investor phone is required'),
  body('investmentAmount')
    .notEmpty()
    .isNumeric()
    .withMessage('Investment amount is required'),
  body('investorLinkedIn')
    .optional()
    .isString(),
  handleValidationErrors
];

// POST /api/payments/create-order - Create Razorpay order
router.post('/create-order', orderValidation, createOrder);

// POST /api/payments/verify - Verify payment signature
router.post('/verify', paymentVerificationValidation, verifyPayment);

// GET /api/payments/data - Get investments data (total amount, recent investors)
router.get('/data', getInvestmentsData);

module.exports = router;

