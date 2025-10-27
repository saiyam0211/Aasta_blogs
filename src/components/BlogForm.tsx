import React, { useState, useEffect } from 'react';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  headline?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormProps {
  blog?: Blog | null;
  onSave: (blogData: Omit<Blog, '_id' | 'slug' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel?: () => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({ blog, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    headline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when blog prop changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        category: blog.category || '',
        headline: blog.headline || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        author: '',
        category: '',
        headline: ''
      });
    }
    setErrors({});
  }, [blog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 100) {
      newErrors.author = 'Author name cannot exceed 100 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    } else if (formData.category.length > 50) {
      newErrors.category = 'Category cannot exceed 50 characters';
    }

    if (!formData.headline.trim()) {
      newErrors.headline = 'Headline is required';
    } else if (formData.headline.length > 300) {
      newErrors.headline = 'Headline cannot exceed 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      if (!blog) {
        // Reset form only for new blogs
        setFormData({
          title: '',
          content: '',
          author: '',
          category: '',
          headline: ''
        });
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        author: blog.author,
        category: blog.category || '',
        headline: blog.headline || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        author: '',
        category: '',
        headline: ''
      });
    }
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 admin-form">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter blog title"
          maxLength={200}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.title.length}/200 characters</p>
      </div>

      {/* Author Field */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Author *
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
            errors.author ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter author name"
          maxLength={100}
        />
        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.author.length}/100 characters</p>
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g. Food Guide, Technology, Health"
          maxLength={50}
        />
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.category.length}/50 characters</p>
      </div>

      {/* Headline Field */}
      <div>
        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
          Eye-Catching Headline *
        </label>
        <textarea
          id="headline"
          name="headline"
          value={formData.headline}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical text-gray-900 bg-white placeholder-gray-500 ${
            errors.headline ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write a catchy headline that will appear in the blog card preview..."
          maxLength={300}
        />
        {errors.headline && <p className="mt-1 text-sm text-red-600">{errors.headline}</p>}
        <p className="mt-1 text-xs text-gray-500">{formData.headline.length}/300 characters</p>
      </div>

      {/* Content Field */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          rows={8}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical text-gray-900 bg-white placeholder-gray-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write your blog content here..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};