const Razorpay = require('razorpay');
const asyncHandler = require('../middleware/asyncHandler');
const CustomError = require('../middleware/customError');
const Investment = require('../models/Investment');

// Hardcoded conversion rate: 1 USD = 88.48 INR
// Therefore: 1 INR = 1/88.48 = 0.011301 USD
const CONVERSION_RATE = 1 / 88.48; // 0.011301 USD per INR

const fetchConversionRate = async () => {
  return CONVERSION_RATE;
};

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

// Verify payment signature and save investment
const verifyPayment = asyncHandler(async (req, res, next) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      investorName,
      investorEmail,
      investorPhone,
      investorLinkedIn,
      investmentAmount
    } = req.body;

    console.log('Payment verification request received:', {
      razorpay_order_id,
      razorpay_payment_id,
      has_signature: !!razorpay_signature,
      investorName,
      investorEmail,
      investorPhone: investorPhone || '(not provided)',
      investorLinkedIn: investorLinkedIn || '(not provided)',
      investmentAmount,
      investmentAmountType: typeof investmentAmount
    });
    
    console.log('Full request body:', JSON.stringify(req.body, null, 2));

    // Validate required Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('Missing Razorpay verification data:', {
        has_order_id: !!razorpay_order_id,
        has_payment_id: !!razorpay_payment_id,
        has_signature: !!razorpay_signature
      });
      return next(new CustomError('Payment verification data is required', 400));
    }

    // Validate required investor fields
    if (!investorName || !investorEmail) {
      console.error('Missing investor data:', {
        has_name: !!investorName,
        has_email: !!investorEmail
      });
      return next(new CustomError('Investor name and email are required', 400));
    }

    if (!investmentAmount || investmentAmount < 300) {
      console.error('Invalid investment amount:', investmentAmount);
      return next(new CustomError('Investment amount must be at least ₹300', 400));
    }

    // Verify signature
    const crypto = require('crypto');
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return next(new CustomError('Payment gateway configuration error', 500));
    }

    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Signature verification failed:', {
        generated: generatedSignature.substring(0, 20) + '...',
        received: razorpay_signature.substring(0, 20) + '...'
      });
      return next(new CustomError('Invalid payment signature', 400));
    }

    console.log('Signature verified successfully');

    // Check if investment already exists
    const existingInvestment = await Investment.findOne({ 
      razorpayPaymentId: razorpay_payment_id 
    });

    if (existingInvestment) {
      console.log('Payment already verified, returning existing investment');
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    }

    // Prepare and validate investment data
    const trimmedName = (investorName || '').trim();
    const trimmedEmail = (investorEmail || '').trim().toLowerCase();
    const trimmedPhone = investorPhone ? investorPhone.trim() : '';
    const trimmedLinkedIn = investorLinkedIn ? investorLinkedIn.trim() : '';
    const numAmount = Number(investmentAmount);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      console.error('Invalid email format:', trimmedEmail);
      return next(new CustomError('Please provide a valid email address', 400));
    }

    // Validate investment amount is a valid number
    if (isNaN(numAmount) || numAmount < 300) {
      console.error('Invalid investment amount:', numAmount, 'Type:', typeof numAmount);
      return next(new CustomError('Investment amount must be at least ₹300', 400));
    }

    // Prepare investment data
    const investmentData = {
      investorName: trimmedName,
      investorEmail: trimmedEmail,
      investorPhone: trimmedPhone,
      investorLinkedIn: trimmedLinkedIn,
      investmentAmount: numAmount,
      currency: 'INR',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'completed'
    };

    console.log('Attempting to save investment with data:', {
      investorName: investmentData.investorName,
      investorEmail: investmentData.investorEmail,
      investorPhone: investmentData.investorPhone || '(empty)',
      investorLinkedIn: investmentData.investorLinkedIn || '(empty)',
      investmentAmount: investmentData.investmentAmount,
      currency: investmentData.currency,
      razorpayOrderId: investmentData.razorpayOrderId,
      razorpayPaymentId: investmentData.razorpayPaymentId,
      razorpaySignature: investmentData.razorpaySignature.substring(0, 20) + '...',
      paymentStatus: investmentData.paymentStatus
    });

    // Save investment to database
    const investment = new Investment(investmentData);
    
    try {
      // Validate before saving
      const validationError = investment.validateSync();
      if (validationError) {
        console.error('Validation error before save:', validationError);
        const validationErrors = Object.values(validationError.errors || {}).map((err) => {
          return `${err.path}: ${err.message}`;
        }).join(', ');
        console.error('Detailed validation errors:', validationErrors);
        return next(new CustomError(`Validation failed: ${validationErrors}`, 400));
      }

      await investment.save();
      console.log('Investment saved successfully:', investment._id);
    } catch (saveError) {
      console.error('Error during save:', saveError);
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors || {}).map((err) => {
          return `${err.path}: ${err.message}`;
        }).join(', ');
        console.error('Validation errors from save:', validationErrors);
        return next(new CustomError(`Validation failed: ${validationErrors || saveError.message}`, 400));
      }
      // Re-throw if it's not a validation error
      throw saveError;
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and investment saved successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      investmentId: investment._id
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    if (error.name === 'ValidationError') {
      // Extract detailed validation errors
      const validationErrors = Object.values(error.errors || {}).map((err) => {
        return `${err.path}: ${err.message}`;
      }).join(', ');
      console.error('Validation errors:', validationErrors);
      console.error('Full error object:', JSON.stringify(error.errors, null, 2));
      return next(new CustomError(`Validation failed: ${validationErrors || error.message}`, 400));
    }
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      console.error('Duplicate payment detected on field:', duplicateField);
      return next(new CustomError(`Duplicate payment detected: ${duplicateField} already exists`, 400));
    }
    console.error('Unexpected error:', error.stack);
    return next(new CustomError(`Failed to save investment: ${error.message}`, 500));
  }
});

// Get recent investors and total amount raised
const getInvestmentsData = asyncHandler(async (req, res, next) => {
  const conversionRate = await fetchConversionRate();

  // Get total amount raised
  const totalResult = await Investment.aggregate([
    {
      $match: { paymentStatus: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$investmentAmount' },
        totalInvestors: { $sum: 1 }
      }
    }
  ]);

  const totalAmount = totalResult.length > 0 ? totalResult[0].totalAmount : 0;
  const totalInvestors = totalResult.length > 0 ? totalResult[0].totalInvestors : 0;

  // Get recent investors (last 20)
  const recentInvestors = await Investment.find({ paymentStatus: 'completed' })
    .select('investorName createdAt investmentAmount')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      totalAmount,
      totalInvestors,
      recentInvestors,
      conversionRate
    }
  });
});

module.exports = {
  createOrder,
  verifyPayment,
  getInvestmentsData
};

