import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface PitchDeckSectionProps {
  slides: Slide[];
}

export const PitchDeckSection = ({ slides }: PitchDeckSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && slides.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000); // 10 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, slides.length]);

  // Scroll active navigation point to top
  useEffect(() => {
    if (navItemRefs.current[currentSlide] && scrollContainerRef.current) {
      const navItem = navItemRefs.current[currentSlide];
      const container = scrollContainerRef.current;
      
      // Calculate the position to scroll to (top of the item)
      const itemTop = navItem.offsetTop;
      
      // Scroll to show the item at the top of the container
      container.scrollTo({
        top: itemTop - container.offsetTop,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  // Pause auto-play when user interacts
  const handleNavigation = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 30 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 30000);
  };

  const slideVariants = {
    enter: {
      y: '100%',
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: '-100%',
      opacity: 0,
    },
  };

  const transition = {
    type: 'tween' as const,
    ease: [0.4, 0, 0.2, 1] as const, // Custom cubic-bezier for smoother animation
    duration: 0.3, // Faster animation (reduced from 0.6 to 0.3)
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Pitch Deck Display */}
          <div className="relative flex flex-col justify-center items-center">
            <div
              className="bg-card-bg rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-primary/30 overflow-hidden relative"
              style={{
                aspectRatio: "16 / 9",
                width: "100%",
                maxWidth: "1200px",
                minWidth: "700px",
                height: "auto",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <img
                    src={slides[currentSlide]?.image || '/placeholder-slide.png'}
                    alt={slides[currentSlide]?.title || `Slide ${currentSlide + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                    loading="lazy"
                    style={{ aspectRatio: '16 / 9' }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Animated Progress Indicator */}
            <div className="relative mt-4 w-[75%] flex items-center justify-center gap-3 z-10">
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className="relative flex-1 h-3 rounded-full overflow-hidden"
                    style={{
                      minWidth: idx === currentSlide ? 60 : 28,
                      maxWidth: idx === currentSlide ? 120 : 44,
                      transition: "min-width 0.3s, max-width 0.3s"
                    }}
                  >
                    {/* Inactive bar background */}
                    <div
                      className={`absolute inset-0 h-3 rounded-full
                        ${idx === currentSlide ? 'bg-primary/30' : 'bg-primary/20'}`}
                    ></div>
                    {/* Animated progress bar for active step */}
                    {idx === currentSlide && isAutoPlaying && (
                      <motion.div
                        key={currentSlide}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 5,
                          ease: "linear",
                        }}
                        className="absolute inset-0 h-3 bg-primary rounded-full"
                        onAnimationComplete={() => {
                          if (currentSlide < slides.length - 1) {
                            setCurrentSlide(currentSlide + 1);
                          } else {
                            setCurrentSlide(0);
                          }
                        }}
                      />
                    )}
                    {/* Static progress bar when paused */}
                    {idx === currentSlide && !isAutoPlaying && (
                      <div className="absolute inset-0 h-3 bg-primary rounded-full" style={{ width: "100%" }} />
                    )}
                  </div>
                ))}
                {/* Pause/Play Button */}
                <button
                  onClick={toggleAutoPlay}
                  className="ml-3 bg-primary/20 hover:bg-primary/30 border-2 border-primary/50 rounded-full p-2 transition-all duration-300 flex items-center justify-center"
                  aria-label={isAutoPlaying ? 'Pause' : 'Play'}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-5 h-5 text-primary" />
                  ) : (
                    <Play className="w-5 h-5 text-primary" />
                  )}
                </button>
            </div>
          </div>

          {/* Right Side - Navigation Points */}
          <div className="space-y-4 w-full ml-20 -mt-20">
            {/* <h3 className="font-dela text-2xl sm:text-3xl text-primary mb-6">
              Our Story
            </h3> */}
            <div 
              ref={scrollContainerRef}
              className="space-y-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  ref={(el) => {
                    navItemRefs.current[index] = el;
                  }}
                  onClick={() => handleNavigation(index)}
                  className={`w-full text-left p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-card-bg border-white/10 text-white/80 hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        currentSlide === index
                          ? 'bg-primary text-black'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-dela text-lg sm:text-xl mb-2 transition-colors ${
                          currentSlide === index ? 'text-primary' : 'text-white'
                        }`}
                      >
                        {slide.title}
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed transition-colors ${
                          currentSlide === index ? 'text-white/90' : 'text-white/60'
                        }`}
                      >
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

