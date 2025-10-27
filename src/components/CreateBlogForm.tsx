import React, { useState } from 'react';
import { Plus, X, Save, Edit } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';

interface CreateBlogFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingBlog?: any;
}

export const CreateBlogForm: React.FC<CreateBlogFormProps> = ({ onClose, onSuccess, editingBlog }) => {
  const { createBlog, updateBlog } = useBlogs();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    headline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with editing blog data
  React.useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || '',
        content: editingBlog.content || '',
        author: editingBlog.author || '',
        category: editingBlog.category || '',
        headline: editingBlog.headline || '',
      });
    }
  }, [editingBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim() || 
        !formData.category.trim() || !formData.headline.trim()) {
      setError('All fields are required');
      return;
    }

    if (formData.title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    if (formData.author.length > 100) {
      setError('Author name must be 100 characters or less');
      return;
    }

    if (formData.category.length > 50) {
      setError('Category must be 50 characters or less');
      return;
    }

    if (formData.headline.length > 300) {
      setError('Headline must be 300 characters or less');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (editingBlog) {
        // Update existing blog
        await updateBlog(editingBlog._id, formData);
      } else {
        // Create new blog
        await createBlog(formData);
      }
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingBlog ? 'update' : 'create'} blog post`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-cream rounded-3xl border-4 border-darkest-green max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-darkest-green flex items-center gap-2">
              {editingBlog ? <Edit className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-darkest-green/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-darkest-green" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-2xl">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-darkest-green font-black text-lg mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                className="w-full px-4 py-3 border-3 border-darkest-green rounded-2xl focus:outline-none focus:border-moss bg-white font-medium"
                placeholder="Enter blog post title..."
                required
              />
              <p className="text-sm text-darkest-green/60 mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            <div>
              <label htmlFor="author" className="block text-darkest-green font-black text-lg mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-3 border-3 border-darkest-green rounded-2xl focus:outline-none focus:border-moss bg-white font-medium"
                placeholder="Enter author name..."
                required
              />
              <p className="text-sm text-darkest-green/60 mt-1">
                {formData.author.length}/100 characters
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-darkest-green font-black text-lg mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                maxLength={50}
                className="w-full px-4 py-3 border-3 border-darkest-green rounded-2xl focus:outline-none focus:border-moss bg-white font-medium"
                placeholder="e.g. Food Guide, Technology, Health..."
                required
              />
              <p className="text-sm text-darkest-green/60 mt-1">
                {formData.category.length}/50 characters
              </p>
            </div>

            <div>
              <label htmlFor="headline" className="block text-darkest-green font-black text-lg mb-2">
                Eye-Catching Headline *
              </label>
              <textarea
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                maxLength={300}
                rows={3}
                className="w-full px-4 py-3 border-3 border-darkest-green rounded-2xl focus:outline-none focus:border-moss bg-white font-medium resize-vertical"
                placeholder="Write a catchy headline that will appear in the blog card preview..."
                required
              />
              <p className="text-sm text-darkest-green/60 mt-1">
                {formData.headline.length}/300 characters
              </p>
            </div>

            <div>
              <label htmlFor="content" className="block text-darkest-green font-black text-lg mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-3 border-3 border-darkest-green rounded-2xl focus:outline-none focus:border-moss bg-white font-medium resize-vertical"
                placeholder="Write your blog post content here..."
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-moss text-darkest-green rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-darkest-green border-t-transparent rounded-full animate-spin" />
                    {editingBlog ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 bg-darkest-green/10 text-darkest-green rounded-2xl font-black text-lg hover:bg-darkest-green/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};