import { useState, useEffect } from 'react';
import { Plus, Trash2, LogOut, Eye, Calendar, User, Edit } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import { CreateBlogForm } from '../components/CreateBlogForm';
import { LoginForm } from '../components/LoginForm';
import { apiService } from '../services/api';

export const AdminPage = () => {
  const { blogs, loading, error, fetchBlogs, deleteBlog, updateBlog } = useBlogs();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  useEffect(() => {
    setIsAuthenticated(apiService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchBlogs(); // Refresh blogs after login
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlog(id);
      } catch (err) {
        alert('Failed to delete blog post');
      }
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingBlog(null);
    setShowCreateForm(false);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const createExcerpt = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-forest-green flex items-center justify-center p-4">
        <div className="bg-cream rounded-3xl border-4 border-darkest-green p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-black text-darkest-green mb-4">Blog Admin</h1>
          <p className="text-darkest-green/70 mb-6">Please login to manage blog posts</p>
          <button
            onClick={() => setShowLoginForm(true)}
            className="px-8 py-4 bg-moss text-darkest-green rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-lg"
          >
            Login
          </button>
        </div>

        {showLoginForm && (
          <LoginForm
            onClose={() => setShowLoginForm(false)}
            onSuccess={handleLogin}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-green">
      {/* Header */}
      <div className="bg-darkest-green text-moss p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Blog Admin</h1>
            <p className="text-moss/70 mt-1">Manage your blog posts</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-moss text-darkest-green rounded-2xl font-black hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss"></div>
            <span className="ml-4 text-moss font-semibold">Loading blog posts...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6 mb-6">
            <p className="text-red-700 font-semibold">{error}</p>
            <button 
              onClick={fetchBlogs}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {!blogs || blogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-cream rounded-3xl border-4 border-darkest-green p-12 max-w-md mx-auto">
                  <h2 className="text-3xl font-black text-darkest-green mb-4">No Blog Posts Yet</h2>
                  <p className="text-darkest-green/70 mb-6">Create your first blog post to get started!</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-8 py-4 bg-moss text-darkest-green rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="bg-cream rounded-2xl border-3 border-darkest-green p-4">
                  <h2 className="text-2xl font-black text-darkest-green mb-4">
                    Blog Posts ({blogs?.length || 0})
                  </h2>
                </div>

                {blogs?.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-cream rounded-2xl border-3 border-darkest-green p-6 hover:border-moss transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-moss text-darkest-green rounded-full text-sm font-black">
                            {blog.category || 'Blog Post'}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-darkest-green mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        {blog.headline && (
                          <p className="text-darkest-green/80 mb-2 line-clamp-2 font-semibold italic">
                            "{blog.headline}"
                          </p>
                        )}
                        
                        <p className="text-darkest-green/70 mb-4 line-clamp-2">
                          {createExcerpt(blog.content)}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-darkest-green/60">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="font-semibold">{blog.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          {blog.updatedAt !== blog.createdAt && (
                            <div className="text-moss font-semibold">
                              Updated: {formatDate(blog.updatedAt)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/blogs/${blog._id}`, '_blank')}
                          className="p-3 bg-darkest-green/10 text-darkest-green rounded-xl hover:bg-darkest-green/20 transition-colors"
                          title="View Post"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateForm && (
        <CreateBlogForm
          onClose={handleCancelEdit}
          onSuccess={() => {
            fetchBlogs(); // Refresh the list
          }}
          editingBlog={editingBlog}
        />
      )}

      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onSuccess={handleLogin}
        />
      )}
    </div>
  );
};