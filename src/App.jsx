import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import ScrollToTop from './components/layout/ScrollToTop';

// Page Views
import HomePage from './pages/HomePage';
import FaqPage from './pages/FaqPage';
import TeamPage from './pages/TeamPage';
import NewsPage from './pages/NewsPage';
import RegisterPage from './pages/RegisterPage';
import SchedulePage from './pages/SchedulePage';
import VectorsPage from './pages/VectorsPage';
import PrizesPage from './pages/PrizesPage';
import RulesPage from './pages/RulesPage';
import MentorsPage from './pages/MentorsPage';
import RubricPage from './pages/RubricPage';
import TerminalPage from './pages/TerminalPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Overmind Signature CRT Scanline & Vignette Overlay */}
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />

      {/* Global Full-Page Pixel-Art Forest Background (visible on ALL pages) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(7, 7, 9, 0.28) 0%, rgba(7, 7, 9, 0.58) 100%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      <ScrollToTop />
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/vectors" element={<VectorsPage />} />
          <Route path="/tracks" element={<Navigate to="/vectors" replace />} />
          <Route path="/prizes" element={<PrizesPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/team" element={<MentorsPage />} />
          <Route path="/rubric" element={<RubricPage />} />
          <Route path="/terminal" element={<TerminalPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageWrapper>
      <Footer />
    </BrowserRouter>
  );
}
