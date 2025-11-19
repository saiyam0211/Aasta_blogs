import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { FoodieSection } from '../components/FoodieSection';
import { RoadmapSection } from '../components/RoadmapSection';
import { HowToOrderSection } from '../components/HowToOrderSection';
import { FAQSection } from '../components/FAQSection';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when page loads or hash changes
    const handleHashScroll = () => {
      const hash = location.hash || window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the # symbol
        // Wait a bit for the page to render, especially after navigation
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 300);
      }
    };

    // Wait for splash screen to finish (3 seconds) before scrolling on initial load
    // But if navigating from another page, scroll immediately
    const isInitialLoad = !location.hash && !window.location.hash;
    const delay = isInitialLoad ? 3100 : 100;
    
    const timer = setTimeout(() => {
      handleHashScroll();
    }, delay);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FoodieSection />
      <RoadmapSection />
      <HowToOrderSection />
      <FAQSection />
      <Footer />
    </>
  );
};

