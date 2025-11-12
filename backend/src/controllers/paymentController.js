const Razorpay = require('razorpay');
const asyncHandler = require('../middleware/asyncHandler');
const CustomError = require('../middleware/customError');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Create Razorpay order
const createOrder = asyncHandler(async (req, res, next) => {
  const { amount, currency = 'INR', receipt } = req.body;

  // Validate required fields
  if (!amount || amount < 100) {
    return next(new CustomError('Amount must be at least ₹1 (100 paise)', 400));
  }

  if (!receipt) {
    return next(new CustomError('Receipt ID is required', 400));
  }

  try {
    const options = {
      amount: amount, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: {
        // Add any additional notes here
        description: 'Investment in AASTA'
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return next(new CustomError(
      error.error?.description || 'Failed to create payment order',
      error.statusCode || 500
    ));
  }
});

// Verify payment signature (optional - for additional security)
const verifyPayment = asyncHandler(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new CustomError('Payment verification data is required', 400));
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  const isSignatureValid = generatedSignature === razorpay_signature;

  if (isSignatureValid) {
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } else {
    return next(new CustomError('Invalid payment signature', 400));
  }
});

module.exports = {
  createOrder,
  verifyPayment
};

