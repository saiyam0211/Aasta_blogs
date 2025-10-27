const { body } = require('express-validator');

// Validation rules for creating a blog post
const validateCreateBlog = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters')
    .trim(),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .trim(),
  
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 100 })
    .withMessage('Author name cannot exceed 100 characters')
    .trim()
];

// Validation rules for updating a blog post
const validateUpdateBlog = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty if provided')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters')
    .trim(),
  
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty if provided')
    .trim(),
  
  body('author')
    .optional()
    .notEmpty()
    .withMessage('Author cannot be empty if provided')
    .isLength({ max: 100 })
    .withMessage('Author name cannot exceed 100 characters')
    .trim()
];

module.exports = {
  validateCreateBlog,
  validateUpdateBlog
};