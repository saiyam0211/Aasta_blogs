import { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Disable body scroll when splash is visible
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = (document.body.style as any).touchAction;
    document.body.style.overflow = 'hidden';
    (document.body.style as any).touchAction = 'none';

    // Start fade out after 2.5 seconds, hide completely after 3 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      // Restore body scroll after splash is hidden
      document.body.style.overflow = originalOverflow;
      (document.body.style as any).touchAction = originalTouchAction;
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      // Restore body scroll on cleanup
      document.body.style.overflow = originalOverflow;
      (document.body.style as any).touchAction = originalTouchAction;
    };
  }, []);

  if (!showSplash) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 overflow-hidden ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#002a01' }}
    >
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-8">
        <Player
          autoplay
          loop={false}
          src="/aasta.json"
          style={{ width: '100%', height: '100%' }}
          speed={1}
        />
      </div>
    </div>
  );
};

