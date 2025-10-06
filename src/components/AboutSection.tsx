import { Play } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="font-dela text-5xl sm:text-5xl lg:text-7xl font-black text-[#d0ee8a] mb-6">
            WHAT IS THIS ABOUT?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Left Card - NOTHING IS IMPOSSIBLE */}
          <div className="relative bg-cream border-2 border-black lg:h-[30rem] mt-6 lg:mt-20 rounded-tr-[3rem] rounded-tl-[3rem] lg:rounded-tr-[0] lg:rounded-br-[0] lg:rounded-tl-[3rem] lg:rounded-bl-[3rem] p-6 sm:p-8 overflow-hidden">
            <h3 className="text-2xl sm:text-3xl lg:text-3xl text-black leading-tight">
              <span className="font-dela">
                NOTHING IS IMPOSSIBLE WITH <span className="font-dela text-5xl sm:text-5xl lg:text-6xl">AASTA</span>
              </span>
            </h3>
          </div>
          {/* Mobile mascot inside card */}
          <div className="absolute right-0 w-48 h-48 -mt-20 sm:w-24 sm:h-24 lg:hidden pointer-events-none select-none">
              <img src="/about_mascot.png" alt="About Mascot" className="w-full h-full object-contain" draggable={false} />
            </div>
          {/* Rocket Illustration - desktop absolute */}
          <div className="hidden lg:block absolute mt-72 left-56 right-0 w-[25rem] h-[25rem]">
            <img
              src="/about_mascot.png"
              alt="About Mascot"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
          {/* Right Card - Text Content */}
          <div className="bg-card-bg  col-span-1 lg:col-span-2 border-2 border-black rounded-bl-[3rem] rounded-br-[3rem] lg:rounded-[3rem] p-6 sm:p-8 lg:p-10 mt-0">
            <div className="space-y-4 text-white">
              <p className="text-sm sm:text-lg leading-relaxed">
                Aasta is India’s First Food Hack Platform — built for the people who hustle every day. Whether you’re a student, a young professional, or just someone who loves a good deal, Aasta is here to make eating out smarter and more affordable.
              </p>
              <p className="text-sm sm:text-lg leading-relaxed">
                We partner with local restaurants, bakeries, and cafes to bring you real food at real prices — no gimmicks, just honest deals up to <span className="font-bold">50–70% off</span>. The same food they serve on the table, now available as a smart food hack on your phone. Discover new places, support your neighborhood, and enjoy your favorites for less.
              </p>
              <p className="text-sm sm:text-lg leading-relaxed">
                Our mission? Simple — make good food accessible without burning wallets, and help restaurants earn from meals that deserve to be eaten, not wasted. Every meal you grab through Aasta helps reduce food waste and supports your favorite local spots. It’s a win-win for foodies and food makers alike.
              </p>
              <p className="text-sm sm:text-lg leading-relaxed">
                For students and hustlers — we got your back.<br />
                We know the grind, the late nights, and the end-of-month struggle. That’s why we built Aasta: to make good food reachable, affordable, and real. Because no one should sleep hungry, and no one should overpay for good food. With Aasta, you can finally treat yourself without guilt or breaking the bank.
              </p>
              <p className="text-sm sm:text-lg leading-relaxed">
                You can have <span className="font-bold">Aastha</span> on Aasta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
