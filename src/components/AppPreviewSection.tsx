import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const screens = [
  {
    title: 'Home Screen',
    description: 'Discover restaurants and trending dishes',
    gradient: 'from-[#cefd4f]/20 to-[#cefd4f]/5'
  },
  {
    title: 'Restaurant Listing',
    description: 'Browse through curated restaurant collections',
    gradient: 'from-[#cefd4f]/30 to-[#cefd4f]/10'
  },
  {
    title: 'Menu Page',
    description: 'Explore detailed menus with mouth-watering photos',
    gradient: 'from-[#cefd4f]/25 to-[#cefd4f]/5'
  },
  {
    title: 'Checkout Flow',
    description: 'Quick and secure payment process',
    gradient: 'from-[#cefd4f]/20 to-[#cefd4f]/10'
  },
  {
    title: 'Order Tracking',
    description: 'Real-time updates on your delivery',
    gradient: 'from-[#cefd4f]/30 to-[#cefd4f]/5'
  }
];

const AstaBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        {/* AASTA text with top-to-bottom gradient fade */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="text-[300px] font-black leading-none opacity-40">
            <span className="bg-gradient-to-b from-moss to-moss/0 bg-clip-text text-transparent">
              AASTA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppPreviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screens.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screens.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-medium-green py-24 px-6 lg:px-8 overflow-hidden relative">
      {/* AASTA Background */}
      <AstaBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={targetRef}
          className={`text-center mb-20 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-block px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <span className="text-moss font-black text-sm uppercase tracking-wider">App Preview</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            Experience the App
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            A seamless journey from browsing to delivery
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              onClick={handlePrev}
              className="w-16 h-16 bg-moss rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
            >
              <ChevronLeft className="w-8 h-8 text-darkest-green" />
            </button>

            <div className="relative w-full max-w-5xl h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                {screens.map((_, index) => {
                  const distance = Math.abs(index - currentIndex);
                  const isActive = index === currentIndex;

                  return (
                    <div
                      key={index}
                      className={`absolute transition-all duration-500 ${isActive
                          ? 'scale-100 opacity-100 z-20'
                          : distance === 1
                            ? 'scale-75 opacity-50 z-10'
                            : 'scale-50 opacity-20 z-0'
                        }`}
                      style={{
                        transform: `translateX(${(index - currentIndex) * 280}px) scale(${isActive ? 1 : distance === 1 ? 0.75 : 0.5
                          })`
                      }}
                    >
                      <div className="w-[280px] h-[560px] bg-cream rounded-[3rem] border-8 border-darkest-green overflow-hidden shadow-2xl">
                        <div className="h-full bg-gradient-to-br from-moss/10 to-transparent">
                          <div className="w-full h-8 bg-darkest-green flex items-center justify-center">
                            <div className="w-20 h-4 bg-cream/20 rounded-full"></div>
                          </div>
                          <div className="p-6 pt-6 space-y-4">
                            <div className="bg-darkest-green rounded-2xl h-44 mb-4 shadow-lg"></div>
                            <div className="space-y-3">
                              <div className="bg-darkest-green rounded-xl h-24 shadow-md"></div>
                              <div className="bg-darkest-green rounded-xl h-24 shadow-md"></div>
                              <div className="bg-darkest-green rounded-xl h-24 shadow-md"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-16 h-16 bg-moss rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-10"
            >
              <ChevronRight className="w-8 h-8 text-darkest-green" />
            </button>
          </div>

          <div className="text-center space-y-2 z-10">
            <h3 className="text-3xl font-black text-moss">{screens[currentIndex].title}</h3>
            <p className="text-white/90 text-lg font-medium">{screens[currentIndex].description}</p>
          </div>

          <div className="flex justify-center gap-2 mt-8 z-10">
            {screens.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                    ? 'bg-moss w-10'
                    : 'bg-moss/30 hover:bg-moss/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};