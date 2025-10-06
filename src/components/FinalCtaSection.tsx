import { Apple, Play, Zap, Star } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const FinalCtaSection = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="bg-darkest-green py-32 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-moss rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-moss rounded-full blur-3xl"></div>
      </div>

      <div
        ref={targetRef}
        className={`max-w-4xl mx-auto text-center relative z-10 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'
          }`}
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-moss/10 rounded-full border-2 border-moss mb-10">
          <Star className="w-6 h-6 text-moss fill-moss" />
          <span className="text-moss font-black text-lg">Join 100,000+ Happy Users</span>
          <Star className="w-6 h-6 text-moss fill-moss" />
        </div>

        <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-moss mb-8  uppercase leading-tight">
          Download Asta Today
        </h2>

        <p className="text-2xl sm:text-3xl text-white/90 mb-16 max-w-3xl mx-auto font-medium">
          Join thousands of food lovers and start enjoying the best meals delivered right to your door
        </p>

        <button className="px-16 py-6 bg-moss text-darkest-green rounded-full font-black text-2xl hover:scale-105 transition-transform  mb-12 inline-flex items-center gap-3 shadow-2xl">
          <Zap className="w-8 h-8" />
          Get Started Now
          <Zap className="w-8 h-8" />
        </button>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="#"
            className="flex items-center gap-4 px-10 py-5 bg-cream rounded-2xl hover:bg-cream-dark transition-all shadow-2xl group hover:scale-105"
          >
            <div className="w-14 h-14 bg-darkest-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Apple className="w-8 h-8 text-moss" />
            </div>
            <div className="text-left">
              <div className="text-xs text-darkest-green/60 font-bold">Download on the</div>
              <div className="text-xl font-black text-darkest-green">App Store</div>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-10 py-5 bg-cream rounded-2xl hover:bg-cream-dark transition-all shadow-2xl group hover:scale-105"
          >
            <div className="w-14 h-14 bg-darkest-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-moss" />
            </div>
            <div className="text-left">
              <div className="text-xs text-darkest-green/60 font-bold">Get it on</div>
              <div className="text-xl font-black text-darkest-green">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
