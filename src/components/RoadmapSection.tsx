import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService, type Blog } from '../services/api';

export const RoadmapSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [cardWidthPercent, setCardWidthPercent] = useState(33.333); // responsive width
  const [marginPercent, setMarginPercent] = useState(2); // responsive margin spacing used in x calc

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const fetchedBlogs = await apiService.getAllBlogs();
        setBlogs(fetchedBlogs);
        // Set initial stage to middle if we have blogs
        if (fetchedBlogs.length > 0) {
          setCurrentStage(fetchedBlogs.length); // Start in the middle of the triple array
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Update transform percentages on resize for responsiveness
  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm breakpoint
        setCardWidthPercent(70); // show partial neighbors
        setMarginPercent(0);
      } else if (width < 1024) { // md to lg-
        setCardWidthPercent(50);
        setMarginPercent(2);
      } else {
        setCardWidthPercent(33.333);
        setMarginPercent(2);
      }
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  // Helper functions for blog data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const createExcerpt = (headline: string, maxLength: number = 120) => {
    if (headline.length <= maxLength) return headline;
    return headline.substring(0, maxLength).trim() + '...';
  };

  const nextBlog = () => {
    if (blogs.length === 0) return;
    setCurrentStage((prev) => {
      const next = prev + 1;
      // If we reach the end of the second set, jump to the start of the second set
      if (next >= blogs.length * 2) {
        return blogs.length; // Start of second set
      }
      return next;
    });
  };

  const prevBlog = () => {
    if (blogs.length === 0) return;
    setCurrentStage((prev) => {
      const prevBlog = prev - 1;
      // If we go below the start of the second set, jump to the end of the second set
      if (prevBlog < blogs.length) {
        return blogs.length * 2 - 1; // End of second set
      }
      return prevBlog;
    });
  };

  // Handle seamless transitions when jumping between sets
  useEffect(() => {
    const handleTransition = () => {
      if (currentStage >= blogs.length * 2) {
        // Jump to equivalent position in second set
        setCurrentStage(currentStage - blogs.length);
      } else if (currentStage < blogs.length) {
        // Jump to equivalent position in second set
        setCurrentStage(currentStage + blogs.length);
      }
    };

    const timeoutId = setTimeout(handleTransition, 500); // After animation completes
    return () => clearTimeout(timeoutId);
  }, [currentStage, blogs.length]);



  return (
    <section id="blogs" className="pt-20 sm:pt-24 lg:pt-28 bg-[#32463b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left: Heading */}
          <div className="justify-center md:justify-start text-center md:text-left">
            <div className="text-2xl sm:text-4xl lg:text-2xl font-black text-white/60">
              Blogs
            </div>
            <div className="font-dela text-5xl sm:text-6xl lg:text-8xl font-black text-primary mb-2 sm:mb-4">
              From Our Community
            </div>
          </div>
          {/* Right: Character Illustration */}
          <div className="hidden lg:block relative ml-12">
            <div className="w-[35rem] h-[35rem] relative">
              <picture>
                <source srcSet="/blogs_mascot.avif" type="image/avif" />
                <source srcSet="/blogs_mascot.webp" type="image/webp" />
                <img
                  src="/blogs_mascot.png"
                  alt="Mascot"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </div>
          </div>
          <div className="block lg:hidden relative">
            <div className="w-[25rem] h-[25rem] relative">
              <picture>
                <source srcSet="/blogs_mascot.avif" type="image/avif" />
                <source srcSet="/blogs_mascot.webp" type="image/webp" />
                <img
                  src="/blogs_mascot.png"
                  alt="Mascot"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </div>
          </div>
        </div>


        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-white font-semibold">Loading blog posts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-black rounded-full font-black hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/70 font-semibold text-lg mb-4">No blog posts available yet</p>
            <p className="text-white/60">Create your first blog post in the admin panel!</p>
            <button
              onClick={() => window.open('/admin', '_blank')}
              className="mt-4 px-6 py-3 bg-primary text-black rounded-full font-black hover:scale-105 transition-transform"
            >
              Go to Admin
            </button>
          </div>
        )}

        {/* Carousel Navigation - only show if we have blogs */}
        {!loading && !error && blogs.length > 0 && (
          <div className="flex justify-center z-20 relative -mb-3 sm:-mb-5">
            <div className="flex gap-4">
              <button
                onClick={prevBlog}
                className="w-10 sm:w-12 h-8 flex items-center justify-center z-20 relative"
              >
                <img
                  src="/arrow-button.avif"
                  alt="Previous"
                  className="w-10 sm:w-12 h-10 sm:h-12 rotate-180"
                />
              </button>
              <button
                onClick={nextBlog}
                className="w-10 sm:w-12 h-8 flex items-center justify-center z-20 relative"
              >
                <img
                  src="/arrow-button.avif"
                  alt="Next"
                  className="w-10 sm:w-12 h-10 sm:h-12"
                />
              </button>
            </div>
          </div>
        )}

        {/* Blog Carousel with Infinite Loop - only show if we have blogs */}
        {!loading && !error && blogs.length > 0 && (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex w-full sm:w-[95%]"
              animate={{ x: -currentStage * (cardWidthPercent + marginPercent) + "%" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              {/* Render blogs in a loop to create infinite effect */}
              {[...blogs, ...blogs, ...blogs].map((blog, index) => (
                <div
                  key={`${Math.floor(index / blogs.length)}-${index % blogs.length}`}
                  className="flex-shrink-0 w-[70%] sm:w-1/2 lg:w-1/3 bg-cream border-r-8 border-t-8 border-black rounded-t-full py-10 sm:py-12 lg:py-14 px-4 sm:px-6 mr-3 sm:mr-5 ml-1 flex flex-col h-auto"
                >
                  {/* Blog Content */}
                  <div className="flex flex-col h-full">
                    {/* Category Badge */}
                    <div className="font-dela inline-block justify-center text-center flex items-center text-black px-3 py-1 rounded-full text-base sm:text-xl mb-2 sm:mb-3">
                      {blog.category || 'Blog Post'}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-black text-black leading-tight px-2 sm:px-4 text-center h-[60px] sm:h-[72px] flex items-start justify-center mb-2 sm:mb-3">
                      {blog.title}
                    </h3>

                    {/* Author and Time */}
                    <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2 text-xs sm:text-sm text-black/70 min-h-[18px] sm:min-h-[20px] mb-2 sm:mb-3">
                      <span className="font-medium">By {blog.author}</span>
                      <span>•</span>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>

                    {/* Headline (Eye-catching text) */}
                    <p className="text-black/80 mt-1 sm:mt-2 text-sm leading-relaxed flex-grow min-h-[50px] sm:min-h-[60px] mb-2 sm:mb-3">
                      {createExcerpt(blog.headline || blog.content)}
                    </p>

                    {/* Read More Button */}
                    <a href={`/blogs/${blog._id}`} className="w-full mt-6 sm:mt-[5.5rem] text-base sm:text-xl py-3 sm:py-4 text-black px-4 rounded-full font-bold bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black hover:scale-105 transition-all mt-auto text-center">
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
