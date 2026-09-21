import { Link } from 'react-router-dom';
import OvermindEye from '../common/OvermindEye';
import { Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: '#f26207',
        color: '#0a0a0c',
        padding: '60px 0 50px 0',
        position: 'relative',
        zIndex: 30,
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div className="page-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 1.4fr) repeat(2, minmax(140px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* Col 1: Brand & Organization */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#0a0a0c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <OvermindEye size={24} color="#f26207" />
              </div>
              <span className="font-pixel" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0a0a0c', letterSpacing: '0.08em' }}>
                HackMe'26
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#1a1a1a', lineHeight: 1.55, maxWidth: '340px', fontWeight: 600 }}>
              HackMe'26 — organized by Cyborgs, CSE Technical Association, VISAT Engineering College. 24 hours. Build, compete, and celebrate.
            </p>

            <div style={{ marginTop: '16px', fontSize: '0.82rem', color: '#0a0a0c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={14} color="#0a0a0c" />
              <span>25–26 September 2026</span>
            </div>
          </div>

          {/* Col 2: Tracks */}
          <div>
            <div className="font-pixel" style={{ fontSize: '0.85rem', color: '#0a0a0c', fontWeight: 800, marginBottom: '14px', textTransform: 'uppercase' }}>
              Tracks
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', fontWeight: 600, padding: 0, margin: 0 }}>
              <li><Link to="/vectors" style={{ color: '#171717', textDecoration: 'none' }}>AI/ML</Link></li>
              <li><Link to="/vectors" style={{ color: '#171717', textDecoration: 'none' }}>Web & App Dev</Link></li>
              <li><Link to="/vectors" style={{ color: '#171717', textDecoration: 'none' }}>IoT & Embedded</Link></li>
              <li><Link to="/vectors" style={{ color: '#171717', textDecoration: 'none' }}>Open Innovation</Link></li>
            </ul>
          </div>

          {/* Col 3: Event */}
          <div>
            <div className="font-pixel" style={{ fontSize: '0.85rem', color: '#0a0a0c', fontWeight: 800, marginBottom: '14px', textTransform: 'uppercase' }}>
              Event
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', fontWeight: 600, padding: 0, margin: 0 }}>
              <li><Link to="/schedule" style={{ color: '#171717', textDecoration: 'none' }}>Schedule</Link></li>
              <li><Link to="/prizes" style={{ color: '#171717', textDecoration: 'none' }}>Prizes</Link></li>
              <li><Link to="/rules" style={{ color: '#171717', textDecoration: 'none' }}>Rules</Link></li>
              <li><Link to="/team" style={{ color: '#171717', textDecoration: 'none' }}>Team</Link></li>
              <li><Link to="/rubric" style={{ color: '#171717', textDecoration: 'none' }}>Judging Rubric</Link></li>
              <li><a href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" target="_blank" rel="noopener noreferrer" style={{ color: '#171717', textDecoration: 'none' }}>Register</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Line */}
        <div
          style={{
            borderTop: '2px solid rgba(0, 0, 0, 0.25)',
            marginTop: '40px',
            paddingTop: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#1a1a1a',
            fontWeight: 700
          }}
        >
          <div>
            © 2026 HackMe'26 • VISAT ENGINEERING COLLEGE • CYBORGS CSE ASSOCIATION.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>CODE • PLAY • VIBE • REPEAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
