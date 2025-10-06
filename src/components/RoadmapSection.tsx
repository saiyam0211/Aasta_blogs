import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const RoadmapSection = () => {
  const [currentStage, setCurrentStage] = useState(4); // Start in the middle of the triple array
  const [cardWidthPercent, setCardWidthPercent] = useState(33.333); // responsive width
  const [marginPercent, setMarginPercent] = useState(2); // responsive margin spacing used in x calc

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
  
  const blogs = [
    {
      id: 1,
      title: "The Future of Food Delivery: How AASTA is Revolutionizing the Industry",
      author: "Sarah Johnson",
      time: "2 hours ago",
      image: "/blog_1.png",
      excerpt: "Discover how AASTA is transforming the food delivery landscape with innovative technology and sustainable practices.",
      category: "Technology"
    },
    {
      id: 2,
      title: "Sustainable Eating: Reducing Food Waste One Meal at a Time",
      author: "Mike Chen",
      time: "5 hours ago",
      image: "/blog_1.png",
      excerpt: "Learn about our mission to reduce food waste and create a more sustainable future for our planet.",
      category: "Sustainability"
    },
    {
      id: 3,
      title: "Community Spotlight: Meet Our Amazing Restaurant Partners",
      author: "Emma Davis",
      time: "1 day ago",
      image: "/blog_1.png",
      excerpt: "Get to know the local restaurants that make AASTA's mission possible and the stories behind their success.",
      category: "Community"
    },
    {
      id: 4,
      title: "Tech Behind the Scenes: Building the Perfect Food Discovery Platform",
      author: "Alex Rodriguez",
      time: "2 days ago",
      image: "/blog_1.png",
      excerpt: "An inside look at the technology and algorithms that power AASTA's food discovery and recommendation system.",
      category: "Technology"
    }
  ];

  const nextBlog = () => {
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

  const getVisibleBlogs = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentStage + i) % blogs.length;
      visible.push(blogs[index]);
    }
    return visible;
  };

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
              <img
                src="/blogs_mascot.png"
                alt="Mascot"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
          <div className="block lg:hidden relative">
            <div className="w-[25rem] h-[25rem] relative">
              <img
                src="/blogs_mascot.png"
                alt="Mascot"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
        

        {/* Carousel Navigation */}
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

        {/* Blog Carousel with Infinite Loop */}
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
                    {blog.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-black leading-tight px-2 sm:px-4 text-center h-[60px] sm:h-[72px] flex items-start justify-center mb-2 sm:mb-3">
                    {blog.title}
                  </h3>

                  {/* Author and Time */}
                  <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2 text-xs sm:text-sm text-black/70 min-h-[18px] sm:min-h-[20px] mb-2 sm:mb-3">
                    <span className="font-medium">By {blog.author}</span>
                    <span>•</span>
                    <span>{blog.time}</span>
                  </div>

                  {/* Excerpt */}
                  <p className="text-black/80 mt-1 sm:mt-2 text-sm leading-relaxed flex-grow min-h-[50px] sm:min-h-[60px] mb-2 sm:mb-3">
                    {blog.excerpt}
                  </p>

                {/* Read More Button */}
                <a href={`/blogs/${blog.id}`} className="w-full mt-6 sm:mt-[5.5rem] text-base sm:text-xl py-3 sm:py-4 text-black px-4 rounded-full font-bold bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black hover:scale-105 transition-all mt-auto text-center">
                  Read More
                </a>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
