import React from 'react';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No blog posts found.</p>
        <p className="text-sm mt-2">Create your first blog post to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {blog.title}
            </h3>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(blog)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                title="Edit blog"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(blog._id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                title="Delete blog"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-sm text-gray-600">
              By <span className="font-medium">{blog.author}</span>
            </p>
            <p className="text-xs text-gray-500">
              Created: {formatDate(blog.createdAt)}
              {blog.updatedAt !== blog.createdAt && (
                <span> • Updated: {formatDate(blog.updatedAt)}</span>
              )}
            </p>
          </div>
          
          <p className="text-gray-700 text-sm mb-2">
            {truncateContent(blog.content)}
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Slug: {blog.slug}</span>
            <span>ID: {blog._id.substring(0, 8)}...</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export { BlogList };