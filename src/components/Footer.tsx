export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Main Content */}
        <div className="text-center">
          {/* AASTA Title */}
          <h1 
            className="text-7xl sm:text-7xl md:text-[10rem] text-primary mb-8 sm:mb-12 cursor-pointer font-dela transition-transform"
            onClick={scrollToTop}
          >
            AASTA
          </h1>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 lg:gap-40 mb-8 sm:mb-12">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-primary transition-colors font-semibold text-lg sm:text-2xl md:text-3xl cursor-pointer hover:scale-105 transition-transform"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('blogs')}
              className="text-gray-300 hover:text-primary transition-colors font-semibold text-lg sm:text-2xl md:text-3xl cursor-pointer hover:scale-105 transition-transform"
            >
              Blogs
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-gray-300 hover:text-primary transition-colors font-semibold text-lg sm:text-2xl md:text-3xl cursor-pointer hover:scale-105 transition-transform"
            >
              FAQ
            </button>
          </div>

          {/* App Store & Play Store Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <button
              className="w-full sm:w-auto bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full py-4 sm:py-6 px-10 sm:px-24 text-black font-black text-lg sm:text-2xl opacity-60 cursor-not-allowed"
              disabled
            >
              App Store <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
            </button>
            <button
              className="w-full sm:w-auto bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full py-4 sm:py-6 px-10 sm:px-24 text-black font-black text-lg sm:text-2xl opacity-60 cursor-not-allowed"
              disabled
            >
              Play Store <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
            </button>
          </div>
        </div>

        {/* Bottom Footer with Mascot */}
        <div className="flex items-end justify-between relative mt-10">
          {/* Left side - Copyright */}
          <div className="hidden sm:flex items-end z-10">
            <p className="text-gray-400 text-sm sm:text-lg font-bold ">
              © AASTA, 2025
            </p>
          </div>

          {/* Center - Mascot Character */}
          <div className="flex-1 flex justify-center">
            <div className="relative sm:-mb-[6rem] md:-mb-[8rem]">
              <picture>
                <source srcSet="/footer_mascot.avif" type="image/avif" />
                <source srcSet="/footer_mascot.webp" type="image/webp" />
                <img
                  src="/footer_mascot.png"
                  alt="AASTA Mascot"
                  className="w-96 h-96 sm:w-60 sm:h-60 md:w-[30rem] md:h-[30rem] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

          {/* Right side - Tagline */}
          <div className="hidden sm:flex items-end z-10">
            <p className="text-gray-400 text-sm sm:text-lg font-bold ">
              WITH LOVE FOR FOOD
            </p>
          </div>

          {/* Mobile stacked bottom texts */}
          <div className="absolute -bottom-6 left-0 right-0 flex sm:hidden flex-col items-center z-10">
            <p className="text-gray-400 text-xs font-bold">© AASTA, 2025</p>
            <p className="text-gray-400 text-xs font-bold">WITH LOVE FOR FOOD</p>
          </div>
        </div>
      </div>

      {/* Cloud decorations */}
      <img
        src="/cloud.svg"
        alt="Cloud decoration"
        className="absolute bottom-0 left-0 sm:left-28 w-[50rem] h-[50rem] sm:w-[60rem] sm:h-[60rem] object-cover -translate-x-1/4 translate-y-1/4 z-0"
        loading="lazy"
        decoding="async"
      />
      <img
        src="/cloud.svg"
        alt="Cloud decoration"
        className="absolute bottom-0 right-0 sm:right-28 w-[50rem] h-[50rem] sm:w-[60rem] sm:h-[60rem] object-cover translate-x-1/4 translate-y-1/4 transform -scale-x-100 z-0"
        loading="lazy"
        decoding="async"
      />
    </footer>
  );
};
