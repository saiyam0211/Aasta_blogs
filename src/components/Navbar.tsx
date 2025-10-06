import { Send, MessageCircle, ArrowUpDown, Twitter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBrandClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent pt-4 pb-4 sm:pt-6 sm:pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Pill-shaped navbar container */}
        <div
          className="bg-cream border-4 border-black rounded-full px-4 sm:px-6 py-2 flex items-center justify-between"
          style={{ boxShadow: 'rgb(0, 0, 0) 2px 4px 0px 0px' }}
        >
          {/* Left side - Logo */}
          <div className="flex items-center h-10">
            {/* <img
              src="/logo_icon.png"
              alt="Aasta Logo"
              className="h-14 w-auto rounded-xl"
              style={{ display: 'block' }}
            /> */}
          <span
            className="font-tanjambore text-[4rem] md:text-[5rem] text-[#002a01]"
            style={{ letterSpacing: '-0.07em' }}
            onClick={handleBrandClick}
            role="button"
            tabIndex={0}
          >
            aasta
          </span>
          </div>

          {/* Right side - Icons and buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Social Icons - visible on mobile too */}
            <div className="flex items-center gap-4">
              <a href="http://instagram.com/aasta.food" target='_blank' className="w-8 h-8 flex items-center justify-center text-black hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com/company/aastalimited" target='_blank' className="w-8 h-8 flex items-center justify-center text-black hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
            {/* Download button hidden per request */}
            {/* Download Button - only show on desktop */}
            <button
              className="hidden sm:inline-flex bg-[#fcfa9f] border-b-8 border-r-4 border-t-2 border-black rounded-full px-5 py-2 text-black font-black opacity-60 cursor-not-allowed items-center gap-2"
              disabled
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-download-modal'));
              }}
            >
              <span>Download</span>
              <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};
