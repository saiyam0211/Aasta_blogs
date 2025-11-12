const Razorpay = require('razorpay');
const asyncHandler = require('../middleware/asyncHandler');
const CustomError = require('../middleware/customError');
const Investment = require('../models/Investment');

let cachedConversionRate = {
  value: 0.01136, // ~₹88 per $1
  timestamp: 0
};

const CONVERSION_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const fetchConversionRate = async () => {
  const now = Date.now();
  if (now - cachedConversionRate.timestamp < CONVERSION_CACHE_TTL) {
    return cachedConversionRate.value;
  }

  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=INR&symbols=USD');
    if (!response.ok) {
      throw new Error(`Failed to fetch conversion rate: ${response.status}`);
    }
    const data = await response.json();
    const usdRate = data?.rates?.USD;
    if (usdRate) {
      cachedConversionRate = {
        value: usdRate,
        timestamp: now
      };
      return usdRate;
    }
  } catch (error) {
    console.error('Error fetching INR->USD conversion rate:', error);
  }

  return cachedConversionRate.value || 0.01136;
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

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new CustomError('Payment verification data is required', 400));
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  const isSignatureValid = generatedSignature === razorpay_signature;

  if (!isSignatureValid) {
    return next(new CustomError('Invalid payment signature', 400));
  }

  // Check if investment already exists
  const existingInvestment = await Investment.findOne({ 
    razorpayPaymentId: razorpay_payment_id 
  });

  if (existingInvestment) {
    return res.status(200).json({
      success: true,
      message: 'Payment already verified',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  }

  // Save investment to database
  const investment = new Investment({
    investorName,
    investorEmail,
    investorPhone,
    investorLinkedIn: investorLinkedIn || '',
    investmentAmount,
    currency: 'INR',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: 'completed'
  });

  await investment.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified and investment saved successfully',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    investmentId: investment._id
  });
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

