import { ArrowRight, Clock, User, BookOpen, Sparkles } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface BlogCardProps {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  delay?: number;
}

const BlogCard = ({ category, title, excerpt, author, readTime, delay = 0 }: BlogCardProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      ref={targetRef}
      className={`bg-cream rounded-3xl overflow-hidden border-4 border-darkest-green hover:border-moss hover:scale-105 card-lift hover:shadow-2xl hover:shadow-moss/30 transition-all duration-300 group ${
        isIntersecting ? 'animate-fade-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-52 bg-gradient-to-br from-moss/40 to-moss/10 relative overflow-hidden flex items-center justify-center">
        <BookOpen className="w-20 h-20 text-darkest-green/40" />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-2 bg-darkest-green text-moss rounded-full text-sm font-black shadow-lg">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-black text-darkest-green group-hover:text-forest-green transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-darkest-green/70 line-clamp-3 font-medium">{excerpt}</p>

        <div className="flex items-center justify-between pt-4 border-t-2 border-darkest-green/10">
          <div className="flex items-center gap-4 text-sm text-darkest-green/60 font-semibold">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readTime}</span>
            </div>
          </div>

          <button className="text-darkest-green font-black flex items-center gap-1 hover:gap-2 transition-all hover:text-forest-green">
            Read
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const BlogSection = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const blogPosts = [
    {
      category: 'Food Guide',
      title: '5 Best Burger Joints in Town',
      excerpt: 'Discover the juiciest, most delicious burgers that will make your taste buds dance. From classic beef to innovative plant-based options.',
      author: 'Sarah Chen',
      readTime: '5 min'
    },
    {
      category: 'Tips & Tricks',
      title: 'How to Get the Most Out of Food Delivery',
      excerpt: 'Expert tips to save money, get faster delivery, and always receive hot, fresh meals. Learn the insider secrets of power users.',
      author: 'Mike Johnson',
      readTime: '7 min'
    },
    {
      category: 'Restaurant Spotlight',
      title: 'Hidden Gems: Local Favorites You Need to Try',
      excerpt: 'Explore the best-kept secrets in your neighborhood. These family-owned restaurants serve authentic flavors you won\'t find anywhere else.',
      author: 'Emma Davis',
      readTime: '6 min'
    },
    {
      category: 'Health',
      title: 'Healthy Eating Made Easy with Asta',
      excerpt: 'Nutritious meals delivered to your door. Discover how to maintain a balanced diet without sacrificing convenience or flavor.',
      author: 'Dr. James Lee',
      readTime: '8 min'
    },
    {
      category: 'Community',
      title: 'Supporting Local Restaurants',
      excerpt: 'Learn how your food orders help local businesses thrive and strengthen your community. Every meal makes a difference.',
      author: 'Lisa Park',
      readTime: '4 min'
    },
    {
      category: 'Cuisine',
      title: 'A Journey Through Asian Street Food',
      excerpt: 'From Bangkok to Tokyo, experience the vibrant flavors of Asian street food without leaving your home. A culinary adventure awaits.',
      author: 'Kevin Nguyen',
      readTime: '10 min'
    }
  ];

  return (
    <section id="blog" className="bg-forest-green py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          ref={targetRef}
          className={`text-center mb-20 ${isIntersecting ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-moss/20 rounded-full border-2 border-moss mb-6">
            <Sparkles className="w-5 h-5 text-moss" />
            <span className="text-moss font-black text-sm uppercase tracking-wider">Blog & Insights</span>
            <Sparkles className="w-5 h-5 text-moss" />
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-moss mb-6 text-glow uppercase">
            From Our Blog
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Discover food guides, tips, and stories from the Asta community
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} {...post} delay={index * 100} />
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-5 bg-moss text-darkest-green rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl inline-flex items-center gap-2">
            View All Articles
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};
