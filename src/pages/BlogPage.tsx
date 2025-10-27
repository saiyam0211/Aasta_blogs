import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { apiService, type Blog } from '../services/api';

// Helper function to validate MongoDB ObjectId format
const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const BlogPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const blogId = params.id;

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        setError('Blog ID not provided');
        setLoading(false);
        return;
      }

      // Validate ObjectId format before making API call
      if (!isValidObjectId(blogId)) {
        setError('Invalid blog post ID format. Please check the URL and try again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedBlog = await apiService.getBlogById(blogId);
        setBlog(fetchedBlog);
      } catch (err) {
        console.error('Error fetching blog:', err);
        
        // Provide more specific error messages
        if (err instanceof Error) {
          if (err.message.includes('Blog post not found')) {
            setError('Blog post not found. It may have been deleted or moved.');
          } else {
            setError(`Failed to load blog post: ${err.message}`);
          }
        } else {
          setError('Failed to load blog post');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleShare = async () => {
    if (!blog) return;
    
    const shareData = {
      title: blog.title,
      text: `Check out this blog post: ${blog.title}`,
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      console.error('Error sharing:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 sm:pt-32 md:pt-36">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-white font-semibold">Loading blog post...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 sm:pt-32 md:pt-36">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-white/70 mb-6">{error || 'The requested blog post could not be found.'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 sm:pt-32 md:pt-36">
        <div className="hidden md:block fixed top-0 left-0 right-0 h-32 bg-background z-20" />
        <div className="w-full max-w-[95%] md:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 bg-background">
          {/* Breadcrumb / Back */}
          <div className="bg-background md:sticky md:top-10 z-30 pb-6 sm:pb-8 md:pb-10">
            <button
              onClick={() => navigate(-1)}
              className="text-black md:sticky z-50 md:top-10 bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full px-3 py-2 sm:px-4 sm:py-3 font-bold hover:scale-105 transition-transform text-sm sm:text-base"
            >
              ← Back
            </button>

            {/* Title */}
            <h1 className="mt-4 sm:mt-6 md:mt-8 font-dela text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary leading-tight md:sticky md:top-32 z-30 bg-background py-1 sm:py-2 pr-2 sm:pr-4">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-white/70">
              <span className="font-semibold text-sm sm:text-base">By {blog.author}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm sm:text-base">{formatDate(blog.createdAt)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm sm:text-base">{calculateReadTime(blog.content)}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleShare}
                className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Share
              </button>
              <span className="bg-white/10 text-white px-3 py-2 rounded-full text-xs font-medium">
                ID: {blog._id.slice(-6)}
              </span>
            </div>
          </div>

          {/* Content */}
          <article className="max-w-none mt-10">
            <div className="prose prose-lg prose-invert max-w-none">
              {blog.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p key={idx} className="text-xl text-white leading-relaxed mb-6">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </article>

          {/* Blog Info Footer */}
          <div className="mt-16 p-6 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg mb-2">About this post</h3>
                <p className="text-white/70 text-sm">
                  Published on {formatDate(blog.createdAt)}
                  {blog.updatedAt !== blog.createdAt && (
                    <span> • Last updated {formatDate(blog.updatedAt)}</span>
                  )}
                </p>
              </div>
              <button
                onClick={handleShare}
                className="bg-primary text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Share Post
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};