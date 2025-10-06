import { Star, Quote } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  delay?: number;
}

const TestimonialCard = ({ name, location, rating, comment, avatar, delay = 0 }: TestimonialCardProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={targetRef}
      className={`bg-cream rounded-3xl p-8 border-4 border-darkest-green hover:border-moss hover:scale-105 card-lift transition-all duration-300 relative ${
        isIntersecting ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Quote className="absolute top-6 right-6 w-12 h-12 text-moss/20" />

      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 ${
              i < rating ? 'fill-moss text-moss' : 'text-moss/30'
            }`}
          />
        ))}
      </div>

      <p className="text-darkest-green/80 leading-relaxed text-lg mb-6 font-medium">{comment}</p>

      <div className="flex items-center gap-4 pt-6 border-t-2 border-darkest-green/10">
        <div className="w-14 h-14 bg-darkest-green rounded-2xl flex items-center justify-center text-xl font-black text-moss shadow-lg">
          {avatar}
        </div>
        <div>
          <h4 className="text-lg font-black text-darkest-green">{name}</h4>
          <p className="text-darkest-green/60 text-sm font-semibold">{location}</p>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const testimonials = [
    {
      name: 'Alex Rivera',
      location: 'San Francisco, CA',
      rating: 5,
      comment: 'Asta has completely changed how I order food. The app is incredibly fast, and the real-time tracking gives me peace of mind. Plus, the restaurant selection is amazing!',
      avatar: 'AR'
    },
    {
      name: 'Priya Patel',
      location: 'Austin, TX',
      rating: 5,
      comment: 'I love discovering new local restaurants through Asta. The interface is beautiful and intuitive. The exclusive deals have saved me so much money!',
      avatar: 'PP'
    },
    {
      name: 'Marcus Johnson',
      location: 'New York, NY',
      rating: 4,
      comment: 'Best food delivery app I\'ve used. Lightning-fast delivery, hot food every time, and the customer support is top-notch. Highly recommend!',
      avatar: 'MJ'
    }
  ];

  return (
    <section id="testimonials" className="bg-darker-green py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={targetRef}
          className={`text-center mb-20 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-block px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <span className="text-moss font-black text-sm uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            What Our Users Say
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Join thousands of satisfied food lovers
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};
