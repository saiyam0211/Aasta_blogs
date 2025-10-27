const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const CustomError = require('../middleware/customError');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create a new blog post
const createBlog = asyncHandler(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.array = () => errors.array();
    return next(error);
  }

  const { title, content, author, category, headline } = req.body;

  // Create new blog post
  const blog = new Blog({
    title,
    content,
    author,
    category,
    headline
  });

  const savedBlog = await blog.save();

  res.status(201).json({
    success: true,
    message: 'Blog post created successfully',
    data: savedBlog
  });
});

// Get all blog posts
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .sort({ createdAt: -1 }) // Sort by creation date in descending order
    .select('_id title content author category headline createdAt updatedAt slug');

  res.status(200).json({
    success: true,
    message: 'Blog posts retrieved successfully',
    data: blogs,
    count: blogs.length
  });
});

// Get a specific blog post by ID
const getBlogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return next(new CustomError('Invalid blog post ID format', 400));
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    return next(new CustomError('Blog post not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Blog post retrieved successfully',
    data: blog
  });
});

// Update a blog post
const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return next(new CustomError('Invalid blog post ID format', 400));
  }

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.array = () => errors.array();
    return next(error);
  }

  const { title, content, author, category, headline } = req.body;

  // Find and update the blog post
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { title, content, author, category, headline },
    { 
      new: true, // Return the updated document
      runValidators: true // Run schema validators
    }
  );

  if (!updatedBlog) {
    return next(new CustomError('Blog post not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Blog post updated successfully',
    data: updatedBlog
  });
});

// Delete a blog post
const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return next(new CustomError('Invalid blog post ID format', 400));
  }

  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return next(new CustomError('Blog post not found', 404));
  }

  res.status(204).json({
    success: true,
    message: 'Blog post deleted successfully'
  });
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};