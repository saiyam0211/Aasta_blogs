import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

export const FoodieSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to mascot position
  const mascotY = useTransform(scrollYProgress, [0, 1], [300, -100]);
  const mascotScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const mascotRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <section ref={ref} className="relative bg-[#32463b] py-14 sm:py-16 lg:py-20 overflow-hidden">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left -mb-1 sm:-mb-2 ml-8 sm:ml-16 text-white/60 text-lg sm:text-3xl">
          It's always about that
        </div>
        {/* FOODIE! Text */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-5xl font-dela sm:text-7xl lg:text-8xl xl:text-[10rem] font-black text-primary leading-tight">
            #FoodHack!
          </h2>
        </motion.div>
        {/* <motion.div
          className="absolute -right-16 top-40 flex justify-center mb-8"
          style={{
            scale: useTransform(scrollYProgress, [0, 0.7], [1, 2])
          }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 20
          }}
        >
          <img
            src="/burger_doodle.png"
            alt="Burger Doodle"
            className="w-40 h-40 object-contain"
            style={{ rotate: "20deg" }}
            draggable={false}
          />
        </motion.div> */}

        {/* Card with How It Works */}
        <div className="relative">
          {/* Big Mascot - Animated on scroll with Framer Motion */}
          <motion.div 
            className="absolute -top-[20rem] sm:-top-[26rem] md:-top-[30rem] inset-0 flex items-center justify-center w-[28rem] h-[28rem] sm:w-[40rem] sm:h-[40rem] md:w-[55rem] md:h-[55rem] mx-auto"
            style={{ 
              y: mascotY,
              scale: mascotScale,
              rotate: mascotRotate
            }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 30,
              mass: 0.8
            }}
          >
            <img 
              src="/big_mascot.svg" 
              alt="Big Mascot" 
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Card */}
          <div 
            className="bg-card-bg border-2 border-primary rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 mt-40 sm:mt-48 lg:mt-56 relative z-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23151f1a' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          >
            {/* Repeating FOODIE! text on top */}
            {/* <div className="absolute -top-4 left-0 right-0 overflow-hidden">
              <div className="flex animate-marquee">
                <span className="text-primary font-black text-2xl whitespace-nowrap mr-8">FOODIE!</span>
                <span className="text-primary font-black text-2xl whitespace-nowrap mr-8">FOODIE!</span>
                <span className="text-primary font-black text-2xl whitespace-nowrap mr-8">FOODIE!</span>
                <span className="text-primary font-black text-2xl whitespace-nowrap mr-8">FOODIE!</span>
                <span className="text-primary font-black text-2xl whitespace-nowrap mr-8">FOODIE!</span>
              </div>
            </div> */}

            {/* How It Works Content */}
            <div className="">
              <div className="text-center mb-6 sm:mb-10 lg:mb-12">
                <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-2 sm:mb-4 font-dela drop-shadow-lg">
                   How It Works
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-white/70 mt-1 sm:mt-2 max-w-2xl mx-auto">
                  Get your favorite meals delivered in <span className="text-primary font-bold"><br className="block sm:hidden" />four simple steps</span>
                </p>
              </div>

              {/* Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                {/* Step 1 */}
                <div className="text-center group transition-all duration-300 hover:-translate-y-2">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full  group-hover:scale-125 transition-all duration-300"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center z-10 border-4 border-secondary shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-secondary font-black text-xl sm:text-2xl lg:text-3xl">1</span>
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-primary mb-1 sm:mb-2 font-dela group-hover:text-[#d0ee8a] transition-colors duration-300">Browse Restaurants</h4>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
                    Discover top-rated local restaurants and explore a variety of cuisines available near you. Find new favorites or revisit classics with just a few clicks.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center group transition-all duration-300 hover:-translate-y-2">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full   group-hover:scale-125 transition-all duration-300"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center z-10 border-4 border-secondary shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-secondary font-black text-xl sm:text-2xl lg:text-3xl">2</span>
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-primary mb-1 sm:mb-2 font-dela group-hover:text-[#d0ee8a] transition-colors duration-300">Pick Your Meal</h4>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
                    Select your favorite dishes, customize your order, and add everything you crave to your cart. Mix and match from different menus for the perfect meal.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center group transition-all duration-300 hover:-translate-y-2">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full   group-hover:scale-125 transition-all duration-300"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center z-10 border-4 border-secondary shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-secondary font-black text-xl sm:text-2xl lg:text-3xl">3</span>
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-primary mb-1 sm:mb-2 font-dela group-hover:text-[#d0ee8a] transition-colors duration-300">Secure Checkout</h4>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
                    Review your order, apply any discounts, and pay securely using your preferred payment method. Your order is instantly confirmed.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="text-center group transition-all duration-300 hover:-translate-y-2">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full   group-hover:scale-125 transition-all duration-300"></div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center z-10 border-4 border-secondary shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-secondary font-black text-xl sm:text-2xl lg:text-3xl">4</span>
                    </div>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-primary mb-1 sm:mb-2 font-dela group-hover:text-[#d0ee8a] transition-colors duration-300">Track & Enjoy</h4>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
                    Track your meal in real-time from kitchen to doorstep. Get notified when your food is on the way and enjoy every bite as soon as it arrives!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
