import Hero from '../components/home/Hero';
import AboutHack26 from '../components/home/AboutHack26';
import TracksSection from '../components/home/TracksSection';
import FormatAndPrizes from '../components/home/FormatAndPrizes';
import SpecTable from '../components/home/SpecTable';
import WhyParticipate from '../components/home/WhyParticipate';
import ResearchAndCta from '../components/home/ResearchAndCta';
import FaqSection from '../components/home/FaqSection';

export default function HomePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#f5f5f4', overflowX: 'hidden' }}>
      {/* 1. Global Full-Page Pixel-Art Forest Background (Fills 100% of viewport across the entire page) */}
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
      />

      {/* 2. Soft atmospheric vignette overlay ensuring text, badges, and cards remain razor-sharp */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(7, 7, 9, 0.28) 0%, rgba(7, 7, 9, 0.58) 100%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* 3. Interactive Page Content Layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* 1. Hero Section (Eyebrow, Headline, Subhead, Meta line, CTAs, CRT Monitor) */}
      <Hero />

      {/* 2. About Section, What's Happening Section, On-the-Ground / Infrastructure Section */}
      <AboutHack26 />

      {/* 3. Innovation Vectors / Tracks Section (Pick a track. Build something that ships.) */}
      <TracksSection />

      {/* 4. Format & Prize Section, Scoring & Judging Section, Timeline Section */}
      <FormatAndPrizes />

      {/* 5. Why HACK 26 (Comparison) Section */}
      <SpecTable />

      {/* 6. Why Participate Section */}
      <WhyParticipate />

      {/* 7. FAQ Section */}
      <FaqSection />

        {/* 8. Dispatches / Guides, Closing CTA (Ready to build? Code • Play • Vibe • Repeat) */}
        <ResearchAndCta />
      </div>
    </div>
  );
}
