import { useState } from 'react';

export const HowToOrderSection = () => {
  const [currentStep, setCurrentStep] = useState(4);

  const steps = [
    {
      title: "DOWNLOAD THE AASTA APP:",
      description: "Get the AASTA app from the App Store or Google Play Store. Create your account and set up your profile with your food preferences and delivery address."
    },
    {
      title: "BROWSE RESTAURANTS:",
      description: "Explore our curated list of partner restaurants and food vendors. Filter by cuisine type, price range, ratings, and delivery time to find your perfect meal."
    },
    {
      title: "CUSTOMIZE YOUR ORDER:",
      description: "Select your favorite dishes and customize them according to your taste. Add special instructions, dietary requirements, or modifications to make it perfect for you."
    },
    {
      title: "PLACE YOUR ORDER:",
      description: "Review your order, choose your payment method, and confirm your delivery details. Our smart system will calculate the best route and estimated delivery time."
    },
    {
      title: "TRACK & ENJOY:",
      description: "Track your order in real-time from kitchen to your doorstep. Get notifications about preparation status, pickup, and delivery progress. Enjoy your delicious meal!"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="how-to-order" className="pt-20 sm:pt-32 lg:pt-56 pb-16 sm:pb-24 lg:pb-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Title and Illustration Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Title Card */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 lg:p-12 flex items-center justify-center lg:col-span-3 col-span-1">
              <h2 className="font-dela text-6xl sm:text-5xl lg:text-8xl text-primary text-left">
                HOW TO ORDER?
              </h2>
            </div>

            {/* Illustration Card */}
            <div className="bg-transparent hidden md:flex rounded-[2rem] sm:rounded-[3rem] items-center justify-center lg:col-span-2 col-span-1 min-h-[12rem] sm:min-h-[16rem] relative overflow-hidden">
              {/* Mobile/Tablet: inline mascot; Desktop: large absolute */}
              <img
                src="/steps_mascot.png"
                alt="Mascot illustration for steps"
                className="w-80 h-80 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-[21rem] lg:h-[21rem] object-contain lg:absolute"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* Left side - Ready to buy card */}
            <div>
              <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10">
                <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8">
                  Ready to experience the future of food delivery? Download the AASTA app now and join thousands of satisfied customers who are already enjoying our revolutionary food ordering platform!
                </p>

                <h1 className="font-fredoka text-primary text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8">
                  #YourHack!
                </h1>
                
                {/* <div className="mb-8 flex justify-center">
                  <div className="relative w-48 h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1731536782762-076739de99b6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxoYW5kJTIwYml0Y29pbiUyMGNvaW4lMjBzcGFya2xlcyUyMGlsbHVzdHJhdGlvbnxlbnwwfDF8fHwxNzU5NjA2MzUzfDA&ixlib=rb-4.1.0&q=85"
                      alt="Pink hand holding a golden bitcoin coin with sparkles, playful illustration style on dark background - TSD Studio on Unsplash"
                      className="w-full h-full object-contain"
                      style={{ width: '192px', height: '192px' }}
                    />
                  </div>
                </div> */}
              </div>
              <button
                className="w-full mt-3 sm:mt-4 bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full py-3 sm:py-4 px-5 sm:px-6 text-black font-black text-base sm:text-lg lg:text-xl opacity-60 cursor-not-allowed"
                disabled
              >
                Download App <span className="text-[.9em] font-normal ml-2">(coming soon)</span>
              </button>
            </div>

            {/* Right side - Steps carousel */}
            <div className="relative bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[22rem] sm:min-h-[26rem] lg:min-h-[28rem] h-full overflow-hidden">
              {/* Rotating hero_bg_star background */}
              <img
                src="/steps_bg_star.svg"
                alt="Rotating star background"
                className="absolute inset-0 w-[20rem] h-[20rem] sm:w-[24rem] sm:h-[24rem] lg:w-[30rem] lg:h-[30rem] ml-40 sm:ml-40 lg:ml-56 mt-20 sm:mt-20 lg:mt-24 object-cover pointer-events-none select-none transition-transform duration-700"
                style={{
                  zIndex: 0,
                  transform: `rotate(${currentStep * 45}deg)`, // 45deg per step, adjust as needed
                  opacity: 0.18,
                }}
                draggable={false}
              />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center text-sm sm:text-base lg:text-xl font-dela text-white mb-1 sm:mb-2">STEP {currentStep + 1} :</div>
                <h3 className="font-dela text-2xl sm:text-3xl lg:text-4xl text-primary mb-3 sm:mb-4">
                  {steps[currentStep].title}
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                  {steps[currentStep].description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6 sm:mt-8 lg:mt-10 relative z-10">
                <button
                  onClick={() => {
                    if (currentStep === steps.length - 1) {
                      setCurrentStep(0);
                    } else {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className="text-white hover:text-primary transition-colors flex items-center gap-2 text-sm sm:text-md"
                >
                  {currentStep === steps.length - 1 ? (
                    <span>← back to start</span>
                  ) : (
                    <span>Next step →</span>
                  )}
                </button>
                {/* Progress indicators */}
                <div className="flex gap-1.5 sm:gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-10 h-4 sm:w-10 sm:h-2.5 lg:w-12 lg:h-3 rounded-full transition-colors ${
                        index === currentStep ? 'bg-primary' : 'bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};