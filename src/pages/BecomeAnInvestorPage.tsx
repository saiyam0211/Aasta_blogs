import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PitchDeckSection } from '../components/PitchDeckSection';
import { InvestmentModal } from '../components/InvestmentModal';
import { CheckCircle } from 'lucide-react';

export const BecomeAnInvestorPage = () => {
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  // Pitch deck slides data - automatically extracted from pitchdeck.zip during build
  const pitchDeckSlides = [
    {
      id: 1,
      image: '/pitch-deck/slide-1.jpg',
      title: 'The Problem',
      description: 'India wastes 67 million tonnes of food annually while millions go hungry. Restaurants discard perfectly good meals daily due to surplus inventory.',
    },
    {
      id: 2,
      image: '/pitch-deck/slide-2.jpg',
      title: 'Our Solution',
      description: 'AASTA connects restaurants with surplus food to customers seeking affordable meals, reducing waste while providing 50-70% savings.',
    },
    {
      id: 3,
      image: '/pitch-deck/slide-3.jpg',
      title: 'Market Opportunity',
      description: 'India\'s food delivery market is growing rapidly. We\'re targeting the underserved segment seeking quality food at honest prices.',
    },
    {
      id: 4,
      image: '/pitch-deck/slide-4.jpg',
      title: 'Business Model',
      description: 'We partner with local restaurants to offer surplus and signature dishes at discounted prices, creating a win-win for all parties.',
    },
    {
      id: 5,
      image: '/pitch-deck/slide-5.jpg',
      title: 'Technology Platform',
      description: 'Our app features real-time tracking, secure payments, and seamless UX. Built for scale with modern tech stack.',
    },
    {
      id: 6,
      image: '/pitch-deck/slide-6.jpg',
      title: 'Traction & Growth',
      description: 'Currently serving Bengaluru with plans to expand. Strong restaurant partnerships and growing customer base.',
    },
    {
      id: 7,
      image: '/pitch-deck/slide-7.jpg',
      title: 'Financial Projections',
      description: 'Projected revenue growth with scalable unit economics. Clear path to profitability through efficient operations.',
    },
    {
      id: 8,
      image: '/pitch-deck/slide-8.jpg',
      title: 'Investment Ask',
      description: 'Seeking ₹50L+ to scale operations, expand to new cities, and build technology infrastructure for growth.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Rotating Star Background */}
        <div className="absolute inset-0 opacity-20 hidden md:block z-0">
          <div className="-mt-40 inset-0 flex items-center justify-center pointer-events-none z-0">
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

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* <div className="inline-block px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
              <span className="text-moss font-black text-sm uppercase tracking-wider">INVESTMENT OPPORTUNITY</span>
            </div> */}
            
            <h1 className="font-dela text-5xl sm:text-6xl md:text-[8rem] text-[#d0ee8a] mb-6 mt-56">
              BECOME OUR
              <br />
              INVESTOR
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium mb-8">
              Join Aasta — Where Every Meal Saved, Feeds Someone            
            </p>

            <div className="flex justify-center mb-40">
        <button
          type="button"
          onClick={() => setIsInvestmentModalOpen(true)}
          className="w-full max-w-xs bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full py-4 sm:py-6 px-8 text-black font-black text-lg sm:text-xl hover:scale-105 transition-transform"
        >
          Become an Investor
        </button>
      </div>

            {/* <div className="flex justify-center mb-12">
              <button
                onClick={() => {
                  const formSection = document.getElementById('investment-form');
                  if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full px-8 py-4 sm:px-12 sm:py-6 text-black font-black text-lg sm:text-2xl md:text-3xl hover:scale-105 transition-transform"
              >
                Become an Investor
              </button>
            </div> */}
          </div>
        </div>
      </section>

       {/* Fundraising Progress Section */}
       <section className="py-12 sm:py-16 bg-background relative overflow-hidden">
        {/* Enhanced Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-dela text-4xl sm:text-5xl md:text-7xl text-primary mb-6">
              JOIN THE REVOLUTION
            </h2>
            <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto">
              Help us build India's leading food waste solution
            </p>
          </div>

          {/* Amount Raised Display - Enhanced */}
          <div className="relative mb-16">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-2xl transform scale-105"></div>
            
            <div className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 rounded-[3rem] p-8 sm:p-12 lg:p-16 border-4 border-primary/40 shadow-2xl backdrop-blur-sm">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] rounded-[3rem]" style={{
                backgroundImage: 'radial-gradient(circle, #d0ee8a 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>

              <div className="relative z-10 text-center">
                <div className="inline-block px-6 py-2 bg-primary/30 rounded-full border-2 border-primary/50 mb-8 backdrop-blur-sm">
                  <span className="text-primary font-bold text-sm sm:text-base uppercase tracking-wider">
                    Amount Raised
                  </span>
                </div>
                <div className="font-dela text-7xl sm:text-8xl md:text-[10rem] text-primary mb-6 leading-none" style={{
                  textShadow: '0 0 40px rgba(208, 238, 138, 0.3), 0 0 80px rgba(208, 238, 138, 0.2)'
                }}>
                  $2,500
                </div>
                <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 border-2 border-primary/30">
                  <span className="text-white/70 text-base sm:text-lg">of</span>
                  <span className="text-primary font-bold text-xl sm:text-2xl">$5,000</span>
                  <span className="text-white/70 text-base sm:text-lg">goal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar with Milestones - Stepper Style */}
          <div className="relative">
            <div className="relative">
              <div className="relative">
                {/* Horizontal Track */}
                <div className="relative h-8 top-12 bg-primary-600 rounded-full border border-primary/30 mb-12 sm:mb-16">
                  {/* Completed Track (green up to current position - 50%) */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '50%' }} // $2,500 / $5,000 = 50%
                  ></div>
                  
                  {/* Future Track (grey for remaining) */}
                  <div 
                    className="absolute right-0 top-0 h-full bg-primary-600 rounded-full"
                    style={{ width: '50%', left: '50%' }}
                  ></div>
                </div>

                {/* Step Indicators */}
                <div className="relative flex justify-between items-center -mt-14 sm:-mt-16 mb-8">
                  {/* $1K Step - Active (solid green with white checkmark) */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%' }}>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-background mb-4">
                      <CheckCircle className="w-7 h-7 sm:w-9 sm:h-9 text-black" strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$1K</span>
                    </div>
                  </div>
                  
                  {/* $3K Step - Future (outlined with green checkmark) */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%', position: 'absolute', left: '60%', transform: 'translateX(-50%)' }}>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background rounded-full flex items-center justify-center shadow-xl border-4 border-primary mb-4">
                      <CheckCircle className="w-7 h-7 sm:w-9 sm:h-9 text-primary" strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$3K</span>
                    </div>
                  </div>
                  
                  {/* $5K Step - Future (outlined with green checkmark) */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%', marginLeft: 'auto' }}>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background rounded-full flex items-center justify-center shadow-xl border-4 border-primary mb-4">
                      <CheckCircle className="w-7 h-7 sm:w-9 sm:h-9 text-primary" strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$5K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Modal */}
      <InvestmentModal 
        isOpen={isInvestmentModalOpen} 
        onClose={() => setIsInvestmentModalOpen(false)} 
      />


      {/* How It Works Section */}
      <section className="py-8 sm:py-12 bg-background z-50 mt-28">
        <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-dela text-4xl sm:text-5xl md:text-7xl text-primary mb-4 z-50">
              We're on a Mission <br /> to End Food Waste.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Step 1 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-sm sm:text-2xl leading-relaxed">
              India throws away over <b className="text-primary">67 million tonnes of food every year</b>, even when millions go hungry.
              Restaurants dump perfectly edible meals daily — not because it’s bad, but because it’s left over.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-sm sm:text-2xl leading-relaxed">
              Aasta bridges that gap — collecting safe, untouched surplus food from verified restaurants, and offering it to people at <b className="text-primary">half the price</b> through our app and local points.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-sm sm:text-2xl leading-relaxed">
              We make sure <b className="text-primary">every meal saved counts</b> — for the planet, for people, for the restaurant, and for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pitch Deck Section */}
      <PitchDeckSection slides={pitchDeckSlides} />


      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-dela text-4xl sm:text-5xl md:text-7xl text-primary mb-4">
              WHY INVEST IN AASTA?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Massive Market Opportunity</h3>
              <p className="text-white/80 text-sm sm:text-base mb-3">
                ₹92,000cr - ₹1.5L cr/year wasted in the HoReCa industry. Over 20% is consumable, with ₹30,000 crore monetizable.
              </p>
              <p className="text-primary text-sm font-semibold">
                TAM: ₹30,000 cr | SAM: ₹25,000 cr+ | SOM: ₹240 Cr
              </p>
            </div>

            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Untapped Market Segment</h3>
              <p className="text-white/80 text-sm sm:text-base">
                Low-income and working-class consumers in India rarely use Swiggy or Zomato due to high prices. AASTA's goal is to monetize this underserved market.
              </p>
            </div>

            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Edible Food Waste</h3>
              <p className="text-white/80 text-sm sm:text-base">
                75% of food wastage produced in the food sector is perfectly edible before disposal (WRAP). AASTA's goal is to monetize this opportunity.
              </p>
            </div>

            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Diverse Revenue Streams</h3>
              <p className="text-white/80 text-sm sm:text-base">
                Multiple revenue channels: 10-15% commissions from restaurants, ₹6 platform fee per order, featured placements, brand partnerships, surprise meal boxes, and subscription models.
              </p>
            </div>

            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Strong Financial Projections</h3>
              <p className="text-white/80 text-sm sm:text-base mb-3">
                ₹15 revenue per order. Target: 10,000 daily customers. Monthly revenue potential: ₹4.5M. Timeline to ₹10M: 3-4 months.
              </p>
              <p className="text-primary text-sm font-semibold">
                ₹4.5M/month × 4 months = ₹10M target
              </p>
            </div>

            <div className="bg-card-bg rounded-[2rem] p-6 sm:p-8 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">Meaningful Impact</h3>
              <p className="text-white/80 text-sm sm:text-base">
                Building India's leading force against food wastage. Crafting policies, creating awareness, and partnering with the government to redefine how India thinks about food waste.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      

      {/* FAQ Section */}
      {/* <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-dela text-4xl sm:text-5xl md:text-7xl text-primary mb-4">
              INVESTOR FAQ
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-card-bg rounded-2xl p-6 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">
                What is the minimum investment amount?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                The minimum investment amount is ₹5,000. You can invest any amount above this threshold.
              </p>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">
                What are the expected returns?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Returns are based on company performance and growth. We provide detailed financial projections during the investment process.
              </p>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">
                How do I track my investment?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Investors receive regular updates via email and have access to a dedicated investor portal with financial reports and milestones.
              </p>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 border-2 border-primary/30">
              <h3 className="font-dela text-xl sm:text-2xl text-primary mb-3">
                Is my investment secure?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Yes, all investments are processed through secure payment gateways and are subject to our investor agreement terms.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

