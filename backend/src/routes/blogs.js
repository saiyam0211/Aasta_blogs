const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

const router = express.Router();

// Validation middleware for blog creation and updates
const blogValidation = [
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
    .trim(),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
    .trim(),
  body('headline')
    .notEmpty()
    .withMessage('Headline is required')
    .isLength({ max: 300 })
    .withMessage('Headline cannot exceed 300 characters')
    .trim()
];

// Public routes - GET endpoints (no authentication required)
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes - POST, PUT, DELETE (authentication required)
router.post('/', authenticateToken, blogValidation, createBlog);
router.put('/:id', authenticateToken, blogValidation, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

module.exports = router;