import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const FactsPage = () => {
  const faqs = [
    { q: 'What is AASTA?', a: 'AASTA is India’s first Food Hack platform partnering with local restaurants to offer real meals at honest prices with secure checkout and live tracking in Bengaluru.' },
    { q: 'How does AASTA work?', a: 'Browse restaurants, pick your meal, customize, pay securely, and track your order live—simple 4 steps.' },
    { q: 'Where is AASTA available?', a: 'We currently serve Bengaluru (Whitefield and Hopefarm). More areas are coming soon.' },
    { q: 'Why are prices so low?', a: 'We work with partners to offer time-bound deals on real menu items—helping reduce waste while saving you money.' },
    { q: 'Is payment secure?', a: 'Yes. We use secure payment processing and never expose sensitive data in the app.' },
    { q: 'How can I get updates?', a: 'Join our community from the homepage or follow our social profiles for launch and city updates.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 sm:pt-32 md:pt-36">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-dela text-4xl sm:text-5xl text-primary mb-8">AASTA Facts</h1>
          <ul className="space-y-6">
            {faqs.map((f, i) => (
              <li key={i} className="bg-card-bg border-2 border-black rounded-3xl p-6">
                <h2 className="text-xl font-bold text-white mb-2">{f.q}</h2>
                <p className="text-white/90">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};


