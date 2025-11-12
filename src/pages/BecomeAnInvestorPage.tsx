import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PitchDeckSection } from '../components/PitchDeckSection';
import { InvestmentModal } from '../components/InvestmentModal';
import { CheckCircle } from 'lucide-react';

interface Investor {
  investorName: string;
  createdAt: string;
  investmentAmount: number;
}

export const BecomeAnInvestorPage = () => {
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [investmentData, setInvestmentData] = useState<{
    totalAmount: number;
    totalInvestors: number;
    recentInvestors: Investor[];
  }>({
    totalAmount: 0,
    totalInvestors: 0,
    recentInvestors: []
  });
  const [currentInvestorIndex, setCurrentInvestorIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [conversionRate, setConversionRate] = useState(0.01205); // default fallback (~₹83 per $1)

  const GOAL_AMOUNT_USD = 5000;

  // Convert INR to USD using live conversion rate
  const convertINRtoUSD = (inr: number): number => {
    if (!conversionRate) return 0;
    return Math.round(inr * conversionRate * 100) / 100;
  };

  // Mask investor name (show first 2-3 letters and last 2-3 letters)
  const maskName = (name: string): string => {
    if (name.length <= 6) {
      return name.charAt(0) + '***';
    }
    const firstPart = name.substring(0, 2);
    const lastPart = name.substring(name.length - 2);
    return `${firstPart}***${lastPart}`;
  };

  const fetchInvestmentData = useCallback(async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/payments/data`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const { totalAmount, totalInvestors, recentInvestors, conversionRate: rate } = result.data;
          setInvestmentData({
            totalAmount,
            totalInvestors,
            recentInvestors
          });
          if (rate) {
            setConversionRate(rate);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching investment data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch investment data
  useEffect(() => {
    fetchInvestmentData();
    // Refresh data every 10 seconds
    const interval = setInterval(fetchInvestmentData, 10000);
    return () => clearInterval(interval);
  }, [fetchInvestmentData]);

  useEffect(() => {
    const handleInvestmentUpdated = () => {
      fetchInvestmentData();
    };
    window.addEventListener('investment-updated', handleInvestmentUpdated);
    return () => window.removeEventListener('investment-updated', handleInvestmentUpdated);
  }, [fetchInvestmentData]);

  // Rotate investor names every 5 seconds
  useEffect(() => {
    if (investmentData.recentInvestors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentInvestorIndex((prev) => 
        (prev + 1) % investmentData.recentInvestors.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [investmentData.recentInvestors.length]);

  const totalAmountUSD = convertINRtoUSD(investmentData.totalAmount);
  const progressPercentage = Math.min((totalAmountUSD / GOAL_AMOUNT_USD) * 100, 100);
  
  // Determine which milestones are achieved
  const milestone1K = totalAmountUSD >= 1000;
  const milestone3K = totalAmountUSD >= 3000;
  const milestone5K = totalAmountUSD >= 5000;

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
      <section className="relative pt-20 sm:pt-28 md:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
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
            
            <h1 className="font-dela text-4xl sm:text-6xl md:text-[8rem] text-[#d0ee8a] mb-6 mt-24 sm:mt-40 md:mt-56 leading-tight">
              BECOME OUR
              <br />
              INVESTOR
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl sm:max-w-3xl mx-auto font-medium mb-8 px-2">
              Join Aasta — Where Every Meal Saved, Feeds Someone            
            </p>

            <div className="flex justify-center mb-16 sm:mb-24 md:mb-40">
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
       <section className="py-10 sm:py-16 bg-background relative overflow-hidden">
        {/* Enhanced Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-dela text-3xl sm:text-5xl md:text-7xl text-primary mb-4 sm:mb-6">
              JOIN THE REVOLUTION
            </h2>
            <p className="text-white/80 text-base sm:text-xl max-w-2xl mx-auto px-2">
              Help us build India's leading food waste solution
            </p>
          </div>

          {/* Amount Raised Display - Enhanced */}
          <div className="relative mb-12 sm:mb-16">
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-2xl transform scale-105"></div>
            
            <div className="relative bg-gradient-to-br from-card-bg via-card-bg to-card-bg/80 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 border-4 border-primary/40 shadow-2xl backdrop-blur-sm">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] rounded-[3rem]" style={{
                backgroundImage: 'radial-gradient(circle, #d0ee8a 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>

              <div className="relative z-10 text-center">
                <div className="inline-block px-5 py-2 bg-primary/30 rounded-full border-2 border-primary/50 mb-5 sm:mb-8 backdrop-blur-sm text-xs sm:text-base">
                  <span className="text-primary font-bold text-sm sm:text-base uppercase tracking-wider">
                    Amount Raised
                  </span>
                </div>
                <div className="font-dela text-5xl sm:text-7xl md:text-[10rem] text-primary mb-4 sm:mb-6 leading-none" style={{
                  textShadow: '0 0 40px rgba(208, 238, 138, 0.3), 0 0 80px rgba(208, 238, 138, 0.2)'
                }}>
                  {loading ? (
                    <span className="text-4xl">Loading...</span>
                  ) : (
                    `$${totalAmountUSD.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                  )}
                </div>
                <div className="inline-flex items-center gap-2 sm:gap-3 bg-primary/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary/30 text-xs sm:text-base">
                  <span className="text-white/70">of</span>
                  <span className="text-primary font-bold text-lg sm:text-2xl">${GOAL_AMOUNT_USD.toLocaleString('en-US')}</span>
                  <span className="text-white/70">goal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden space-y-6">
            <div className="h-4 bg-primary-600/60 rounded-full border border-primary/30 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm text-primary font-semibold">
              <div className="space-y-1">
                <div className={`mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center ${milestone1K ? 'bg-primary text-black border-background' : 'bg-background text-primary border-primary'}`}>
                  <CheckCircle className="w-5 h-5" strokeWidth={3} />
                </div>
                <p>$1K</p>
              </div>
              <div className="space-y-1">
                <div className={`mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center ${milestone3K ? 'bg-primary text-black border-background' : 'bg-background text-primary border-primary'}`}>
                  <CheckCircle className="w-5 h-5" strokeWidth={3} />
                </div>
                <p>$3K</p>
              </div>
              <div className="space-y-1">
                <div className={`mx-auto w-10 h-10 rounded-full border-2 flex items-center justify-center ${milestone5K ? 'bg-primary text-black border-background' : 'bg-background text-primary border-primary'}`}>
                  <CheckCircle className="w-5 h-5" strokeWidth={3} />
                </div>
                <p>$5K</p>
              </div>
            </div>
          </div>

          {/* Desktop Progress Bar with Milestones */}
          <div className="relative hidden md:block">
            <div className="relative">
              <div className="relative">
                {/* Horizontal Track */}
                <div className="relative h-8 top-12 bg-primary-600 rounded-full border border-primary/30 mb-12 sm:mb-16">
                  {/* Completed Track (green up to current position) */}
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  
                  {/* Future Track (grey for remaining) */}
                  <div 
                    className="absolute right-0 top-0 h-full bg-primary-600 rounded-full"
                    style={{ width: `${100 - progressPercentage}%`, left: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Step Indicators */}
                <div className="relative flex justify-between items-center -mt-14 sm:-mt-16 mb-8">
                  {/* $1K Step */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%' }}>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${milestone1K ? 'bg-primary' : 'bg-background'} rounded-full flex items-center justify-center shadow-xl border-4 ${milestone1K ? 'border-background' : 'border-primary'} mb-4`}>
                      <CheckCircle className={`w-7 h-7 sm:w-9 sm:h-9 ${milestone1K ? 'text-black' : 'text-primary'}`} strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$1K</span>
                    </div>
                  </div>
                  
                  {/* $3K Step */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%', position: 'absolute', left: '60%', transform: 'translateX(-50%)' }}>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${milestone3K ? 'bg-primary' : 'bg-background'} rounded-full flex items-center justify-center shadow-xl border-4 ${milestone3K ? 'border-background' : 'border-primary'} mb-4`}>
                      <CheckCircle className={`w-7 h-7 sm:w-9 sm:h-9 ${milestone3K ? 'text-black' : 'text-primary'}`} strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$3K</span>
                    </div>
                  </div>
                  
                  {/* $5K Step */}
                  <div className="flex flex-col items-center relative z-20" style={{ width: '20%', marginLeft: 'auto' }}>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${milestone5K ? 'bg-primary' : 'bg-background'} rounded-full flex items-center justify-center shadow-xl border-4 ${milestone5K ? 'border-background' : 'border-primary'} mb-4`}>
                      <CheckCircle className={`w-7 h-7 sm:w-9 sm:h-9 ${milestone5K ? 'text-black' : 'text-primary'}`} strokeWidth={3} />
                    </div>
                    <div className="">
                      <span className="text-primary font-bold text-sm sm:text-3xl">$5K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Investors Carousel */}
          {investmentData.recentInvestors.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-white/60 text-sm mb-4">Recent Investors</p>
              <div className="rounded-3xl max-w-2xl mx-auto p-4 sm:p-6">
                <div className="flex items-center justify-center gap-4 min-h-[4rem]">
                  <AnimatePresence mode="wait">
                    {investmentData.recentInvestors[currentInvestorIndex] ? (
                      <motion.div
                        key={`${currentInvestorIndex}-${investmentData.recentInvestors[currentInvestorIndex].investorName}-${investmentData.recentInvestors[currentInvestorIndex].createdAt}`}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border border-primary/40 shadow-xl shadow-primary/10 text-left sm:text-left"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/20 rounded-full flex items-center justify-center shadow-inner shadow-primary/30 mx-auto sm:mx-0">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="text-left sm:flex-1">
                          <p className="text-primary/90 text-xs sm:text-sm uppercase tracking-[0.3em] mb-1">
                            latest supporter
                          </p>
                          <p className="text-white font-semibold text-lg sm:text-xl tracking-wide leading-tight">
                            {maskName(investmentData.recentInvestors[currentInvestorIndex].investorName)} just invested
                          </p>
                        </div>
                        <div className="text-primary font-black text-3xl sm:text-4xl leading-tight sm:text-right">
                            ${convertINRtoUSD(investmentData.recentInvestors[currentInvestorIndex].investmentAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                          <p className="text-white/50 text-xs mt-1">
                            Together we’re moving closer to the goal.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-investors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.9 }}
                        className="text-white/50 text-sm"
                      >
                        Be the first to invest today!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Investment Modal */}
      <InvestmentModal 
        isOpen={isInvestmentModalOpen} 
        onClose={() => setIsInvestmentModalOpen(false)} 
      />


      {/* How It Works Section */}
      <section className="py-10 sm:py-14 bg-background z-50 mt-12 sm:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-dela text-3xl sm:text-5xl md:text-7xl text-primary mb-4 z-50">
              We're on a Mission <br /> to End Food Waste.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Step 1 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-base sm:text-xl leading-relaxed">
              India throws away over <b className="text-primary">67 million tonnes of food every year</b>, even when millions go hungry.
              Restaurants dump perfectly edible meals daily — not because it’s bad, but because it’s left over.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-base sm:text-xl leading-relaxed">
              Aasta bridges that gap — collecting safe, untouched surplus food from verified restaurants, and offering it to people at <b className="text-primary">half the price</b> through our app and local points.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card-bg rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <p className="text-white/80 text-base sm:text-xl leading-relaxed">
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

