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

interface BlogStatsProps {
  blogs: Blog[];
}

export const BlogStats: React.FC<BlogStatsProps> = ({ blogs }) => {
  const totalBlogs = blogs.length;
  const totalAuthors = new Set(blogs.map(blog => blog.author)).size;
  const averageContentLength = blogs.length > 0 
    ? Math.round(blogs.reduce((sum, blog) => sum + blog.content.length, 0) / blogs.length)
    : 0;

  const recentBlogs = blogs
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Blog Statistics</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{totalBlogs}</div>
          <div className="text-sm text-blue-800">Total Posts</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{totalAuthors}</div>
          <div className="text-sm text-green-800">Authors</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{averageContentLength}</div>
          <div className="text-sm text-purple-800">Avg. Content Length</div>
        </div>
      </div>

      {/* Recent Posts */}
      {recentBlogs.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Recent Posts</h3>
          <div className="space-y-2">
            {recentBlogs.map((blog) => (
              <div key={blog._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm truncate max-w-xs">{blog.title}</div>
                  <div className="text-xs text-gray-600">by {blog.author}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(blog.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};