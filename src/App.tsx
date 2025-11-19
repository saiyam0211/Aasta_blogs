import { DownloadModal } from './components/DownloadModal';
import { SplashScreen } from './components/SplashScreen';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BlogPage } from './pages/BlogPage';
import { AdminPage } from './pages/AdminPage';
import { FactsPage } from './pages/FactsPage';
import { BecomeAnInvestorPage } from './pages/BecomeAnInvestorPage';

function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
