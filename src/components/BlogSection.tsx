import { useState, useEffect } from 'react';
import { ArrowRight, Clock, User, Sparkles } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { apiService, type Blog } from '../services/api';

interface BlogCardProps {
  blog: Blog;
  delay?: number;
}

const BlogCard = ({ blog, delay = 0 }: BlogCardProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  // Helper function to calculate read time based on content length
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  // Helper function to create excerpt from content
  const createExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };



  return (
    <div
      ref={targetRef}
      className={`bg-cream rounded-3xl overflow-hidden border-4 border-darkest-green hover:border-moss hover:scale-105 card-lift hover:shadow-2xl hover:shadow-moss/30 transition-all duration-300 group cursor-pointer ${
        isIntersecting ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => window.open(`/blogs/${blog._id}`, '_blank')}
    >
      <div className="h-52 bg-gradient-to-br from-moss/40 to-moss/10 relative overflow-hidden">
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-darkest-green text-moss rounded-full text-sm font-black shadow-lg">
            {blog.category || 'Blog Post'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-black text-darkest-green group-hover:text-forest-green transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-darkest-green/70 line-clamp-3 font-medium">
          {createExcerpt(blog.headline || blog.content)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-2 border-darkest-green/10">
          <div className="flex items-center gap-4 text-sm text-darkest-green/60 font-semibold">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{calculateReadTime(blog.content)}</span>
            </div>
          </div>

          <div className="text-darkest-green font-black flex items-center gap-1 hover:gap-2 transition-all hover:text-forest-green">
            Read
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        <div className="text-xs text-darkest-green/50 font-medium">
          Published: {formatDate(blog.createdAt)}
        </div>
      </div>
    </div>
  );
};

export const BlogSection = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log('Fetching blogs from API...');
        const fetchedBlogs = await apiService.getAllBlogs();
        console.log('Fetched blogs:', fetchedBlogs);
        // Show only the 6 most recent blogs for the homepage
        setBlogs(fetchedBlogs.slice(0, 6));
        console.log('Set blogs state:', fetchedBlogs.slice(0, 6));
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="bg-forest-green py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={targetRef}
          className={`text-center mb-20 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <Sparkles className="w-5 h-5 text-moss" />
            <span className="text-moss font-black text-sm uppercase tracking-wider">Blog & Insights</span>
            <Sparkles className="w-5 h-5 text-moss" />
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            From Our Blog
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Discover food guides, tips, and stories from the Asta community
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moss"></div>
            <span className="ml-4 text-moss font-semibold">Loading blog posts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 font-semibold mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-moss text-darkest-green rounded-full font-black hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          <>
            {blogs.length > 0 ? (
              <>
                {/* Debug info - remove this in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-4 bg-white/10 rounded-lg text-white text-sm">
                    <p>Debug: Found {blogs.length} blogs</p>
                    <p>Sample IDs: {blogs.slice(0, 2).map(b => b._id).join(', ')}</p>
                    {blogs.length > 0 && (
                      <div className="mt-2">
                        <p>First blog title: {blogs[0].title}</p>
                        <p>First blog author: {blogs[0].author}</p>
                        <p>First blog content preview: {blogs[0].content.substring(0, 50)}...</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {blogs.map((blog, index) => (
                    <BlogCard key={blog._id} blog={blog} delay={index * 100} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-moss/70 font-semibold text-lg mb-4">No blog posts available yet</p>
                <p className="text-white/60">Create your first blog post in the admin panel!</p>
                <button 
                  onClick={() => window.open('/admin', '_blank')}
                  className="mt-4 px-6 py-3 bg-moss text-darkest-green rounded-full font-black hover:scale-105 transition-transform"
                >
                  Go to Admin
                </button>
              </div>
            )}
          </>
        )}

        {/* View All Button - only show if there are blogs */}
        {!loading && !error && blogs.length > 0 && (
          <div className="text-center">
            <button 
              onClick={() => window.open('/admin', '_blank')}
              className="px-10 py-5 bg-moss text-darkest-green rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl inline-flex items-center gap-2"
            >
              View All Articles
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
