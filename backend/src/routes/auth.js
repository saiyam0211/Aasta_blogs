const express = require('express');
const { body, validationResult } = require('express-validator');
const { login } = require('../controllers/authController');

const router = express.Router();

// Validation middleware for login
const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];

// Middleware to handle validation errors
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

// POST /api/auth/login - Admin login endpoint
router.post('/login', loginValidation, handleValidationErrors, login);

module.exports = router;