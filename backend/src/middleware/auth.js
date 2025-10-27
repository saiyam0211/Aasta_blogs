const jwt = require('jsonwebtoken');
const CustomError = require('./customError');
require('dotenv').config();

// Authentication middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Check if token exists
    if (!token) {
      return next(new CustomError('Access token is required', 401));
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Pass JWT errors to error handler
        return next(err);
      }

      // Add user information to request object
      req.user = decoded;
      next();
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken
};