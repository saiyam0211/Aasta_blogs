import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FoodieSection } from './components/FoodieSection';
import { RoadmapSection } from './components/RoadmapSection';
import { HowToOrderSection } from './components/HowToOrderSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogPage } from './pages/BlogPage';
import { AdminPage } from './pages/AdminPage';
import { FactsPage } from './pages/FactsPage';
import { BecomeAnInvestorPage } from './pages/BecomeAnInvestorPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/"
            element={(
              <>
                <Navbar />
                <HeroSection />
                <AboutSection />
                <FoodieSection />
                <RoadmapSection />
                <HowToOrderSection />
                <FAQSection />
                <Footer />
              </>
            )}
          />
          <Route path="/blogs/:id" element={<BlogPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/facts" element={<FactsPage />} />
          <Route path="/becomeaninvestor" element={<BecomeAnInvestorPage />} />
        </Routes>
        <DownloadModal />
      </div>
    </BrowserRouter>
  );
}

export default App;
