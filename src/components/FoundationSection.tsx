import { Globe, Users, TrendingUp } from 'lucide-react';

export const FoundationSection = () => {
  return (
    <section id="features" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-secondary font-bold">⚡</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary">
              A STRONG FOUNDATION
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Strategic Partnerships */}
          <div className="card-asta bg-primary border-2 border-secondary text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-4">
              Strategic Partnerships
            </h3>
            <p className="text-secondary leading-relaxed">
              Collaborating with top restaurants and cloud kitchens to bring variety and quality. 
              Our network spans across major cities with exclusive partnerships for the best dining experiences.
            </p>
          </div>

          {/* Community Support */}
          <div className="card-asta bg-primary border-2 border-secondary text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-4">
              Community Support
            </h3>
            <p className="text-secondary leading-relaxed">
              Built around customer feedback and local engagement to improve continuously. 
              Our community-driven approach ensures we always deliver what you truly want.
            </p>
          </div>

          {/* Growing Ecosystem */}
          <div className="card-asta bg-primary border-2 border-secondary text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-secondary mb-4">
              Growing Ecosystem
            </h3>
            <p className="text-secondary leading-relaxed">
              Expanding features with loyalty rewards, scheduled delivery, and group orders. 
              We're constantly innovating to make your food experience even better.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
