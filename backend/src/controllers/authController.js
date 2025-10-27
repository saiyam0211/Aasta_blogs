const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asyncHandler');
const CustomError = require('../middleware/customError');
require('dotenv').config();

// Hardcoded admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// Login controller
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return next(new CustomError('Username and password are required', 400));
  }

  // Check credentials against hardcoded admin credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return next(new CustomError('Invalid credentials', 401));
  }

  // Generate JWT token
  const token = generateToken({
    userId: 'admin',
    username: ADMIN_USERNAME
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: 'admin',
      username: ADMIN_USERNAME
    }
  });
});

module.exports = {
  login
};