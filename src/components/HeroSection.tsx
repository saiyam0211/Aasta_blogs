// icons removed to reduce unused JS

export const HeroSection = () => {
  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Rotating Star Background */}
      <div className="absolute inset-0 opacity-20 hidden md:block">
        <div className=" -mt-40 inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[80rem] h-[80rem] animate-spin-slow flex items-center justify-center">
            <img 
              src="/hero_bg_star.svg" 
              alt="Rotating star background" 
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-center min-h-[55vh] sm:min-h-[60vh]">
        <div className="flex flex-col items-center w-full">
          <div className="text-center mt-10 md:mt-20 animate-fade-up w-full">
            <div className="text-white text-base sm:text-xl md:text-2xl font-bold mb-0 font-bricolage">
              INTRODUCING
            </div>

            <div className="">
              <h1 className="font-dela text-6xl md:text-[10rem] text-[#d0ee8a]">
                AASTA
              </h1>
              <p className="text-base sm:text-xl mt-4 sm:mt-6 sm:text-2xl text-white/90 max-w-xl font-medium mx-auto">
                Your next food hack, delivered.
              </p>
            </div>

            <div className="flex flex-col mt-6 w-full justify-center items-center sm:mt-10 sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/GU7bt0okmyi05ls0zq40c7?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#fcfa9f] border-b-8 border-r-4 border-t-2 border-black rounded-full px-5 py-3 sm:px-6 text-black font-black hover:scale-105 transition-transform flex items-center justify-center"
              >
                Join Community
              </a>
              <a
                href="#blogs"
                className="cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 text-white"
                onClick={e => {
                  e.preventDefault();
                  const el = document.getElementById('blogs');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="cursor-pointer">→</span>
                <span className="cursor-pointer">Our Blogs</span>
              </a>
            </div>

            {/* GET IT NOW ON Section */}
            <div className="pt-72 sm:pt-36 md:pt-44 w-full max-w-4xl mx-auto">
              <div className="bg-cream border-2 border-black w-full border-4 border-[#000] rounded-[3rem] sm:rounded-[6rem] md:rounded-[8rem] px-6 sm:px-12 md:px-20 py-6 sm:py-8 md:py-10 relative">
                {/* GET IT NOW ON Text */}
                <div className="mb-6 sm:mb-8 flex items-start">
                  <div className="text-left leading-none">
                    <h2 className="text-4xl sm:text-6xl md:text-[5rem] font-dela text-black mb-0 pb-0">
                      GET IT <img src="/sparkles.svg" alt="Sparkles" className="inline-block w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24 align-text-top ml-2" loading="lazy" />
                    </h2>
                    <h2 className="text-4xl sm:text-6xl md:text-[5rem] font-dela text-black mt-0 pt-0">
                      NOW ON:
                    </h2>
                  </div>
                </div>

                {/* Exchange Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4">
                  <button
                    className="bg-[#fcfa9f] border-b-8 border-r-4 border-t-2 border-black rounded-full px-4 py-3 text-black font-bold opacity-60 cursor-not-allowed"
                    disabled
                  >
                    Play Store <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
                  </button>
                  <button
                    className="bg-[#fcfa9f] border-b-8 border-r-4 border-t-2 border-black rounded-full px-4 py-3 text-black font-bold opacity-60 cursor-not-allowed"
                    disabled
                  >
                    App Store <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
                  </button>
                </div>

                {/* Mascot Image */}
                <div className="absolute -top-72 right-2 w-80 h-80 justify-center items-center sm:-top-24 sm:right-6 sm:w-56 sm:h-56 md:-top-56 md:-right-32 md:w-[30rem] md:h-[30rem]">
                  <picture>
                    <source srcSet="/hero_mascot.avif" type="image/avif" />
                    <source srcSet="/hero_mascot.webp" type="image/webp" />
                    <img 
                      src="/hero_mascot.png" 
                      alt="AASTA Mascot" 
                      className="w-full h-full object-contain"
                      fetchpriority="high"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
