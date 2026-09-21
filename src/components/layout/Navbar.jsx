import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import OvermindEye from '../common/OvermindEye';
import PixelButton from '../common/PixelButton';
import { WebPet } from "@/components/web-pet";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="overmind-header page-container">
      <nav className="overmind-nav-container clip-pixel-corners" aria-label="Overmind navigation">
        {/* Retro WebPet Crab Companion on Navbar */}
        <WebPet
          animal="crab"
          color="red"
          speed={3.4}
          scale={0.5}
          className="web-pet-companion"
        />

        {/* Left Navigation Items (Exact Overmind Navbar) */}
        <div className="overmind-nav-left">
          <NavLink
            to="/schedule"
            className={({ isActive }) => `nav-pixel-link clip-pixel-corners ${isActive ? 'active' : ''}`}
          >
            Schedule
          </NavLink>

          <NavLink to="/team" className={({ isActive }) => `nav-pixel-link clip-pixel-corners ${isActive ? 'active' : ''}`}>
            Team
          </NavLink>

          <NavLink to="/faq" className={({ isActive }) => `nav-pixel-link clip-pixel-corners ${isActive ? 'active' : ''}`}>
            FAQ
          </NavLink>
        </div>

        {/* Center Cybernetic Eye Emblem */}
        <div className="overmind-nav-center">
          <Link to="/" onClick={closeMenu} title="HackMe'26 // Flagship Hackathon" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <OvermindEye size={30} color="#f26207" />
            <span className="font-pixel" style={{ color: '#ffffff', fontSize: '0.95rem', letterSpacing: '0.1em' }}>
              HackMe'26
            </span>
          </Link>
        </div>

        {/* Right CTAs */}
        <div className="overmind-nav-right">
          <PixelButton
            to="/contact"
            variant="stone"
            size="sm"
            className="hidden md:inline-flex"
          >
            Talk to the team
          </PixelButton>

          <PixelButton
            href="https://forms.gle/Z1KZCfkG4Jqq4eqj9"
            variant="orange"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register
          </PixelButton>

          {/* Mobile Menu Toggle Button */}
          <button
            className="overmind-mobile-toggle clip-pixel-corners"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="overmind-mobile-menu">
          <Link to="/" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>🏠</span> Home
          </Link>
          <Link to="/schedule" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>📅</span> Schedule
          </Link>
          <Link to="/vectors" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>🎯</span> Tracks
          </Link>
          <Link to="/prizes" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>🏆</span> Prizes
          </Link>
          <Link to="/team" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>👥</span> Team
          </Link>
          <Link to="/faq" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>❓</span> FAQ
          </Link>
          <Link to="/contact" onClick={closeMenu} className="nav-pixel-link">
            <span style={{ marginRight: '8px' }}>📞</span> Contact
          </Link>
          
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <PixelButton 
              href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" 
              variant="orange" 
              size="md" 
              onClick={closeMenu} 
              style={{ width: '100%', justifyContent: 'center' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now (₹50/person)
            </PixelButton>
          </div>
        </div>
      )}
    </header>
  );
}
