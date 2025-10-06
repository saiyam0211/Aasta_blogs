import { MapPin, Zap, Truck, Gift, Heart, Clock, Shield, Award } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={targetRef}
      className={`bg-cream rounded-3xl p-8 border-4 border-darker-green hover:border-moss hover:scale-105 card-lift transition-all duration-300 hover:shadow-2xl hover:shadow-moss/30 ${
        isIntersecting ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-20 h-20 bg-darkest-green rounded-2xl flex items-center justify-center mb-6 shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-darkest-green mb-3">{title}</h3>
      <p className="text-darkest-green/70 text-lg leading-relaxed font-medium">{description}</p>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="bg-darker-green py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <span className="text-moss font-black text-sm uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            Why Choose Asta?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Experience food delivery like never before with features designed for you
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<MapPin className="w-10 h-10 text-moss" />}
            title="Discover Local Favorites"
            description="Explore the best restaurants and hidden gems in your neighborhood"
            delay={0}
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-moss" />}
            title="Order in Seconds"
            description="Lightning-fast ordering with our intuitive interface and saved preferences"
            delay={100}
          />
          <FeatureCard
            icon={<Truck className="w-10 h-10 text-moss" />}
            title="Track Your Delivery"
            description="Real-time tracking so you know exactly when your food will arrive"
            delay={200}
          />
          <FeatureCard
            icon={<Gift className="w-10 h-10 text-moss" />}
            title="Exclusive Offers"
            description="Get access to special deals and rewards with every order"
            delay={300}
          />
          <FeatureCard
            icon={<Heart className="w-10 h-10 text-moss" />}
            title="Save Favorites"
            description="Bookmark your favorite restaurants and meals for quick reordering"
            delay={400}
          />
          <FeatureCard
            icon={<Clock className="w-10 h-10 text-moss" />}
            title="Schedule Orders"
            description="Plan ahead by scheduling your deliveries for later"
            delay={500}
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-moss" />}
            title="Safe & Secure"
            description="Your data and payments are protected with top-tier encryption"
            delay={600}
          />
          <FeatureCard
            icon={<Award className="w-10 h-10 text-moss" />}
            title="Loyalty Rewards"
            description="Earn points with every order and unlock exclusive perks"
            delay={700}
          />
        </div>
      </div>
    </section>
  );
};
