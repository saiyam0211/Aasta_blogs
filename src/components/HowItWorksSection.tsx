import { Search, ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface StepSectionProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  imagePosition: 'left' | 'right';
}

const StepSection = ({ number, title, description, icon, imagePosition }: StepSectionProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={targetRef}
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        isIntersecting ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      <div
        className={`${
          imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
        } relative h-96 bg-cream rounded-[3rem] border-8 border-darkest-green overflow-hidden shadow-2xl`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-moss/10 to-transparent">
          <div className="w-40 h-40 bg-darkest-green rounded-3xl flex items-center justify-center shadow-xl">
            {icon}
          </div>
        </div>
      </div>

      <div className={imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}>
        <div className="inline-flex items-center justify-center w-24 h-24 bg-moss rounded-2xl mb-8 text-4xl font-black text-darkest-green shadow-xl">
          {number}
        </div>
        <h3 className="text-4xl sm:text-5xl font-black text-moss mb-6">{title}</h3>
        <p className="text-xl text-white/90 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};

export const HowItWorksSection = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section id="how-it-works" className="bg-dark-green py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={targetRef}
          className={`text-center mb-24 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-block px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <span className="text-moss font-black text-sm uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            Simple & Fast
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Get your favorite meals delivered in four simple steps
          </p>
        </div>

        <div className="space-y-32">
          <StepSection
            number={1}
            title="Browse Restaurants"
            description="Explore a wide variety of restaurants and cuisines in your area. Filter by rating, delivery time, or your favorite dishes."
            icon={<Search className="w-20 h-20 text-moss" />}
            imagePosition="left"
          />

          <StepSection
            number={2}
            title="Pick Your Meal"
            description="Browse menus, read reviews, and customize your order exactly how you like it. Add items to your cart with a single tap."
            icon={<ShoppingCart className="w-20 h-20 text-moss" />}
            imagePosition="right"
          />

          <StepSection
            number={3}
            title="Secure Checkout"
            description="Complete your order with our secure payment system. Save your payment methods for even faster checkout next time."
            icon={<CreditCard className="w-20 h-20 text-moss" />}
            imagePosition="left"
          />

          <StepSection
            number={4}
            title="Track & Enjoy"
            description="Follow your order in real-time from kitchen to doorstep. Get notifications at every step of the delivery process."
            icon={<CheckCircle className="w-20 h-20 text-moss" />}
            imagePosition="right"
          />
        </div>
      </div>
    </section>
  );
};
