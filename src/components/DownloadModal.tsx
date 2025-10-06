import { useEffect, useState } from 'react';

type Platform = 'choose' | 'android' | 'ios';

const ANDROID_LINK = '#';
const IOS_LINK = '#';

export const DownloadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>('choose');

  useEffect(() => {
    const openHandler = () => {
      setPlatform('choose');
      setIsOpen(true);
    };
    window.addEventListener('open-download-modal', openHandler as EventListener);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-download-modal', openHandler as EventListener);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      const previousTouchAction = (document.body.style as any).touchAction;
      document.body.style.overflow = 'hidden';
      (document.body.style as any).touchAction = 'none';
      return () => {
        document.body.style.overflow = previousOverflow;
        (document.body.style as any).touchAction = previousTouchAction;
      };
    }
  }, [isOpen]);

  const link = platform === 'android' ? ANDROID_LINK : IOS_LINK;
  const qrData = encodeURIComponent(link);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-cream border-4 border-black rounded-3xl w-full max-w-xl mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black rounded-t-3xl bg-[#fcfab2]">
          <h3 className="text-3xl font-dela text-[#002a01]">Choose your platform</h3>
          <button
            className="w-10 h-10 flex items-center justify-center font-dela text-4xl group"
            style={{ transform: 'rotate(45deg)' }}
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <img
              src="/plus_button.svg"
              alt="Close"
              className="w-8 h-8 transition-transform duration-200 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {platform === 'choose' && (
            <div className="text-center">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setPlatform('android')}
                  className="bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-2xl py-4 px-6 text-black font-black text-lg hover:scale-105 transition-transform"
                >
                  Android
                </button>
                <button
                  onClick={() => setPlatform('ios')}
                  className="bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-2xl py-4 px-6 text-black font-black text-lg hover:scale-105 transition-transform"
                >
                  iOS
                </button>
              </div>
            </div>
          )}

          {platform !== 'choose' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-3xl text-black font-bold font-dela mb-6">
                  {platform === 'android' ? 'Get it on Google Play' : 'Download on the App Store'}
                </p>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full px-4 py-2 text-black font-black hover:scale-105 transition-colors"
                >
                  {platform === 'android' ? 'Open Play Store' : 'Open App Store'}
                </a>
                <button
                  className="mt-4 text-sm underline text-black/70"
                  onClick={() => setPlatform('choose')}
                >
                  Choose a different platform
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`}
                  alt="Download QR"
                  className="w-44 h-44 border-b-8 border-r-4 border-t-2 border-black  bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


