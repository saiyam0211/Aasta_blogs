const mongoose = require('mongoose');

// Function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    maxlength: [100, 'Author name cannot exceed 100 characters'],
    trim: true
  },
  category: {
    type: String,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    trim: true,
    default: 'Blog Post'
  },
  headline: {
    type: String,
    maxlength: [300, 'Headline cannot exceed 300 characters'],
    trim: true,
    default: function() {
      // Use content excerpt as default headline if not provided
      if (this.content) {
        const excerpt = this.content.substring(0, 150).trim();
        return excerpt.length < this.content.length ? excerpt + '...' : excerpt;
      }
      return 'Read this interesting blog post';
    }
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to generate slug from title
blogSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  next();
});

// Pre-update middleware to regenerate slug if title is updated
blogSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = generateSlug(update.title);
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;