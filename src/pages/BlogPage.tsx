import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

type Blog = {
  id: number;
  title: string;
  author: string;
  time: string;
  image: string;
  excerpt: string;
  category: string;
  content?: string[];
};

const BLOGS: Blog[] = [
  {
    id: 1,
    title: 'The Future of Food Delivery: How AASTA is Revolutionizing the Industry',
    author: 'Sarah Johnson',
    time: '2 hours ago',
    image: '/blog_1.png',
    excerpt:
      "Discover how AASTA is transforming the food delivery landscape with innovative technology and sustainable practices.",
    category: 'Technology',
    content: [
      'AASTA is building a smarter, faster, and greener food delivery experience. From route optimization to real‑time insights, we are rethinking every step so you get your favorites fresher and faster while reducing waste. Instead of treating delivery as a simple point‑to‑point courier task, we view it as a living system that balances demand, kitchen capacity, courier availability, and travel time. That systems view allows us to orchestrate thousands of micro‑decisions every minute that quietly make your order feel effortless.',
      'Under the hood, our demand‑aware routing minimizes idle time for couriers and avoids congestion around busy kitchens. We aggregate signals such as driver proximity, order prep progress, road conditions, and weather to generate more reliable ETAs. The payoff is tangible: fewer cold meals, fewer cancellations, and far fewer back‑and‑forth calls. For restaurants, this means steadier ticket flow and clearer timing. For customers, it means accurate expectations and meals that arrive hot and on time.',
      'Technology should also help kitchens focus on food, not screens. We are investing in practical tools—live prep insights, menu health scoring, and fair batching—that translate complex operations into simple, actionable views. When kitchens can see which dishes slow the line, which modifiers repeatedly cause delays, and when the next pickup will arrive, they can make better decisions with less stress. Our goal is to reduce anxiety on the line so cooks and chefs can pour their energy into taste and consistency.',
      'Finally, we believe great delivery must be responsible delivery. Every optimized route and informed prep decision reduces wasted miles and unnecessary emissions. As we scale, these small wins compound into meaningful environmental impact. AASTA is still early, but our direction is clear: combine thoughtful design with real‑world logistics to create a food delivery experience that feels modern, reliable, and kinder to the planet.',
      'Our platform architecture favors modularity so that each city can adapt to its own rhythms. Lunch in a dense business district behaves differently from late‑night orders in a residential area. By composing local policies for batching, pickup windows, and handoff points, we keep the system flexible without rewriting core logic. The result is a network that learns from place and seasonality rather than forcing one rigid pattern onto every neighborhood.',
      'We also pay attention to the small UX details that shape trust: clear substitution flows when an item runs out, proactive status nudges when a kitchen gets slammed, and simple ways to split an order among friends. These moments do not make headlines, but they remove friction from the experience. When a delivery app feels considerate rather than transactional, people return without being bribed by constant coupons.',
      'On the courier side, we design for fairness and predictability. Transparent earnings, sensible route planning, and accurate pickup timing reduce the stressful “hurry up and wait” loop that burns people out. Couriers are the face of delivery; when their day runs smoothly, the whole experience improves. We constantly test route adjustments and staging locations that minimize pointless circling while keeping wait times short for customers.',
      'Security and privacy underpin everything. Payments are tokenized, personally identifiable information is minimized in operational views, and sensitive routes are masked after completion. We apply the same care to restaurant data: prep times, volumes, and menu performance are surfaced in aggregate to help partners improve while protecting their competitive edge.',
      'Looking ahead, we see opportunity in dynamic packaging and temperature‑aware routing. Not all dishes travel the same. By tagging items with heat, chill, humidity, and fragility profiles, we can choose the best packing configuration and route shape to protect texture. Crispy foods should avoid long sealed steam baths; delicate desserts should skip bumpy detours. These small decisions significantly affect delight at the table.',
      'AASTA’s north star is simple: a delivery experience that feels invisible until the exact moment it delivers joy. When the logistics fade into the background and the food takes center stage, we know the system is doing its job. That is the standard we build toward—one release, one kitchen, and one ride at a time.'
    ]
  },
  {
    id: 2,
    title: 'Sustainable Eating: Reducing Food Waste One Meal at a Time',
    author: 'Mike Chen',
    time: '5 hours ago',
    image: '/blog_1.png',
    excerpt:
      'Learn about our mission to reduce food waste and create a more sustainable future for our planet.',
    category: 'Sustainability',
    content: [
      'Food should feel good—from how it tastes to how it is made and moved. At AASTA, sustainability is not a sticker on a box; it is a set of daily choices that help kitchens prepare just enough, drivers travel just the distance needed, and customers receive meals at their best. We partner with restaurants that care about sourcing and portioning, and then support them with forecasting tools that make planning for the rush less guesswork and more science.',
      'Accurate demand prediction is our first lever. By blending historical patterns with live signals like weather, events, and neighborhood activity, we help restaurants prep smarter. That means fewer trays abandoned at the end of the night and fewer ingredients pulled “just in case.” When kitchens prep the right amount, quality improves, margins improve, and waste drops dramatically. Everyone wins—especially the planet.',
      'Sustainability also lives on the road. Our dispatch system favors shorter handoffs, bundles nearby drops only when it preserves food quality, and avoids routing patterns that trap couriers in traffic or long returns. Each small optimization reduces fuel use and frustration. At scale, these micro‑savings become a meaningful reduction in emissions and noise in the neighborhoods we serve.',
      'Most importantly, we keep the experience joyful. You should not have to trade delight for responsibility. By aligning logistics with taste—hot items first, fragile items handled gently, and accurate ETAs—we deliver meals that feel better and do better. With our partners and customers, we are proving that convenience and care can live on the same plate.',
      'Behind the scenes, we run continuous experiments to measure the real impact of packaging choices and route tweaks. Does vented compostable fiber preserve crispness better than standard clamshells for certain dishes? At what distance should we switch from single‑carry to bundled drops without sacrificing quality? These are not philosophical debates; they are measurable questions answered with telemetry and tastings.',
      'We are equally focused on education. Restaurants get simple dashboards that translate demand signals into prep guidance—think color‑coded indicators for likely spikes or lulls, plus ingredient alerts when supplier delays loom. Customers see subtle prompts about reheating best practices or how to store leftovers safely. Empowered decisions reduce waste after the delivery arrives, which is a dimension often overlooked in sustainability conversations.',
      'Long term, we aim to report an easy‑to‑understand “impact receipt” with each order—showing estimated emissions averted through efficient routing and batching as well as packaging choices used. When people can see the effect of their choices, many choose the greener option—especially when it still tastes great.'
    ]
  },
  {
    id: 3,
    title: 'Community Spotlight: Meet Our Amazing Restaurant Partners',
    author: 'Emma Davis',
    time: '1 day ago',
    image: '/blog_1.png',
    excerpt:
      "Get to know the local restaurants that make AASTA's mission possible and the stories behind their success.",
    category: 'Community',
    content: [
      'Local restaurants shape the flavor of a city. They are the memories we share with friends, the late‑night fixes, and the celebrations that matter. At AASTA, we partner with teams who put craft before hype, and we try to amplify the details that make each spot special—from the family spice blend to the extra‑crispy edge on a house‑made flatbread. Food is culture, and culture deserves care.',
      'Working closely with neighborhood kitchens has taught us that technology is most helpful when it disappears. The best tools are the ones that keep the line moving and let people focus on hospitality. That is why we design for clarity: live prep timelines, courier arrival windows, and tidy batching that respects each restaurant’s rhythm. When operations feel smoother, staff have more time to greet a regular, refine a recipe, or teach a new cook a technique.',
      'We also love telling the stories behind the menu. Every week we highlight new partners, their signature dishes, and the people who bring them to life. These spotlights help customers discover something delightful nearby and help restaurants reach new fans without shouting over the noise of generic ads. Discovery should feel like a friend’s recommendation, not an algorithm shouting into your feed.',
      'Ultimately, our community grows through trust. When restaurants see that we care about their craft and customers taste the difference, the whole ecosystem feels more connected. AASTA exists to make those connections easier—so great food can travel farther without losing what makes it special.',
      'We invest in thoughtful onboarding for new partners: menu digitization that preserves nuance, photography guidelines that celebrate real portions, and training on pacing items for delivery without compromising the in‑house experience. Great delivery does not mean cloning a dine‑in dish; it means capturing its soul in a form that survives the ride. Together with our partners, we iterate until the delivered version sings.',
      'Community also means accountability. We highlight restaurants that mentor youth, reduce waste, and source responsibly. When customers choose these partners, they are voting for the kind of food scene they want to see. In turn, we reinvest a portion of proceeds into neighborhood food initiatives and culinary training programs that widen access to the industry.'
    ]
  },
  {
    id: 4,
    title: 'Tech Behind the Scenes: Building the Perfect Food Discovery Platform',
    author: 'Alex Rodriguez',
    time: '2 days ago',
    image: '/blog_1.png',
    excerpt:
      "An inside look at the technology and algorithms that power AASTA's food discovery and recommendation system.",
    category: 'Technology',
    content: [
      'Choosing what to eat should be the fun part—not the frustrating part. Our discovery system blends your preferences with real‑time logistics so the dishes we surface are not just appealing but also likely to arrive hot and quickly. We look at cuisine, ingredients, dietary tags, and even portion style to understand taste, then weigh that against courier capacity, kitchen load, and road conditions to deliver suggestions that make sense right now.',
      'Great recommendations are as much about what not to show as what to show. If a popular spot is temporarily slammed, we will favor an equally tasty option that can deliver a better experience in the moment. When things calm down, it naturally reappears. This dynamic ranking keeps quality and speed in healthy balance and prevents the “famous but always late” trap many delivery apps fall into.',
      'Transparency matters too. We aim for clear ETAs, reliable live tracking, and consistent quality signals so you can choose with confidence. Small touches—like calling out travel time sensitivity for crispy or chilled dishes—help set expectations and reduce disappointment. Our goal is to replace guessing with guidance that feels friendly, not bossy.',
      'As the platform grows, we will continue investing in models that learn from feedback while protecting privacy. The future of food discovery is personal, contextual, and kind to your time. With AASTA, we want every recommendation to feel like a great suggestion from someone who knows your taste and the city’s current rhythm.',
      'We are exploring richer semantics for menus—beyond dish names and prices. Texture attributes, spice progression, portion geometry, and packaging compatibility all matter during delivery. When our system understands these nuances, it can better match cravings with conditions: recommending a brothy noodle when traffic is light or steering toward a saucy rice bowl when a longer ride might soften crisp edges.',
      'Even the checkout can help with discovery. If a customer builds a cart that mixes items likely to travel at different speeds, we can suggest slight swaps that preserve quality without compromising intent—perhaps switching fries for a potato salad on a rainy night or nudging toward a dessert that holds its structure better in warm weather. These are gentle, optional helpers, not hard rules.'
    ]
  }
];

export const BlogPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);

  const blog = useMemo(() => BLOGS.find(b => b.id === id) ?? BLOGS[0], [id]);

  // Dynamic SEO tags for each blog
  useEffect(() => {
    const siteUrl = 'https://aasta.food';
    const url = `${siteUrl}/blogs/${blog.id}`;
    const title = `${blog.title} | AASTA Blog`;
    const description = blog.excerpt;
    const image = `${siteUrl}${blog.image}`;

    document.title = title;

    const ensureMeta = (name: string, property: string | null, content: string) => {
      let tag: HTMLMetaElement | null = null;
      if (name) tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag && property) tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        if (name) tag.setAttribute('name', name);
        if (property) tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
      return tag;
    };

    const setLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
      return link;
    };

    // Standard
    const metaDesc = ensureMeta('description', null, description);
    setLink('canonical', url);

    // Open Graph
    const ogTitle = ensureMeta('', 'og:title', title);
    const ogDesc = ensureMeta('', 'og:description', description);
    const ogType = ensureMeta('', 'og:type', 'article');
    const ogUrl = ensureMeta('', 'og:url', url);
    const ogImg = ensureMeta('', 'og:image', image);

    // Twitter
    const twCard = ensureMeta('twitter:card', null, 'summary_large_image');
    const twTitle = ensureMeta('twitter:title', null, title);
    const twDesc = ensureMeta('twitter:description', null, description);
    const twImg = ensureMeta('twitter:image', null, image);

    // Article JSON-LD
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description,
      author: { '@type': 'Person', name: blog.author },
      datePublished: new Date().toISOString(),
      image: [image],
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      publisher: {
        '@type': 'Organization',
        name: 'AASTA',
        logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` }
      }
    });
    document.head.appendChild(ld);

    return () => {
      // Cleanup JSON-LD script to avoid duplicates on route change
      document.head.removeChild(ld);
      // Do not remove meta/link to preserve back/forward cache benefits
      // but you may opt to reset if needed.
    };
  }, [blog]);

  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard');
      }
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 sm:pt-32 md:pt-36">
        {/* Fixed background under navbar area to prevent content peeking at sides (desktop only) */}
        <div className="hidden md:block fixed top-0 left-0 right-0 h-32 bg-background z-20" />
        <div className="w-full max-w-[95%] md:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 bg-background">
          {/* Breadcrumb / Back */}
          <div className="bg-background md:sticky md:top-10 z-30 pb-6 sm:pb-8 md:pb-10">
            <button
              onClick={() => navigate(-1)}
              className="text-black md:sticky z-50 md:top-10 bg-[#fcfab2] border-b-8 border-r-4 border-t-2 border-black rounded-full px-3 py-2 sm:px-4 sm:py-3 font-bold hover:scale-105 transition-transform text-sm sm:text-base"
            >
              ← Back
            </button>

            {/* Sticky Title (same offset as Back button) */}
            <h1 className="mt-4 sm:mt-6 md:mt-8 font-dela text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary leading-tight md:sticky md:top-32 z-30 bg-background py-1 sm:py-2 pr-2 sm:pr-4">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-white/70">
              <span className="font-semibold text-sm sm:text-base">By {blog.author}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-sm sm:text-base">{blog.time}</span>
            </div>
          </div>


          {/* Main Image */}
          {/* <div className="mt-8 rounded-3xl overflow-hidden border-4 border-black bg-cream">
            <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover" />
          </div> */}

          {/* Content */}
          <article className="max-w-none mt-10 text-black">
            {blog.content?.map((para, idx) => (
              <p key={idx} className="text-xl text-white leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};


