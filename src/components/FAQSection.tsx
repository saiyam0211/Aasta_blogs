import { useState } from 'react';
import { Plus } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is AASTA and how does it work?",
      answer: "AASTA is India's first food hack company. We partner with restaurants to offer signature dishes at 50% off while reducing food waste."
    },
    {
      question: "How do I download the AASTA app?",
      answer: "Download easily from the App Store or Google Play Store. Just search for 'AASTA' and install to start your food hacking journey today!"
    },
    {
      question: "What makes AASTA different from other food delivery apps?",
      answer: "We focus on 'Food Hacking' - offering restaurant signature dishes at 50% off while supporting local businesses and reducing waste."
    },
    {
      question: "How does the 50% off pricing work?",
      answer: "We partner with restaurants to offer surplus and signature dishes at unbeatable prices, helping them reduce waste and reach new customers."
    },
    {
      question: "What areas does AASTA currently serve?",
      answer: "Currently, we only serve in Bengaluru (Whitefield and Hopefarm areas). We're expanding to other areas soon! Join our WhatsApp community for quicker updates.",
    },
    {
      question: "How can I track my order?",
      answer: "Track your order in real-time through the AASTA app. Get notifications about preparation, pickup, and delivery status."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-[#32463b] relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' %3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          opacity: 0.12,
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-dela text-primary mb-4 sm:mb-6">
            GOT SOME FAQ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group relative bg-[#fcfab2] rounded-[3rem] sm:rounded-[3rem] lg:rounded-[3rem] px-8 py-20 sm:p-12 lg:p-20 transition-all duration-500 cursor-pointer overflow-hidden border-b-8 border-r-4 border-t-2 border-black ${
                openIndex === index ? 'flex items-start' : 'flex items-center'
              }`}
              onClick={() => toggleFAQ(index)}
            >
              {/* Icon container with animations */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 mr-4 sm:mr-6">
                <img
                  src="/plus_button.svg"
                  alt="Expand FAQ"
                  className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-20 lg:h-20 transition-all duration-500 ease-in-out ${
                    openIndex === index 
                      ? 'rotate-45'
                      : 'rotate-0 group-hover:rotate-90'
                  }`}
                  draggable={false}
                />
              </div>

              {/* Content container */}
              <div className="flex-1 relative">
                {/* Question with slide up animation */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    openIndex === index 
                      ? 'opacity-0 -translate-y-8 absolute top-0 left-0 right-0' 
                      : 'opacity-100 translate-y-0'
                  }`}
                >
                  <h3 className="text-[#1a3d2e] font-bold text-base sm:text-lg lg:text-xl leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {faq.question}
                  </h3>
                </div>

                {/* Answer with slide up animation */}
                <div 
                  className={`transition-all duration-500 ease-in-out ${
                    openIndex === index 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8 absolute top-0 left-0 right-0'
                  }`}
                >
                  <p className="text-[#1a3d2e] leading-tight text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};