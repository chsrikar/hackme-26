import { useState } from 'react';
import { judgesAndMentors, organizers } from '../data/organizers';
import { Network, Award, Briefcase, ArrowLeft, MessageSquare, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import PixelButton from '../components/common/PixelButton';

export default function MentorsPage() {
  const [crewFilter, setCrewFilter] = useState('ALL');
  const crewCategories = ['ALL', 'ORGANIZERS', 'DISCIPLINE', 'TECHNICAL', 'ENTERTAINMENT', 'EVENT VOLUNTEERS'];

  const filteredCrew = crewFilter === 'ALL'
    ? organizers
    : organizers.filter((org) => org.category && org.category.toUpperCase() === crewFilter);
  return (
    <div style={{ backgroundColor: '#070708', minHeight: '100vh', color: '#f5f5f4', paddingTop: '40px', paddingBottom: '90px' }}>
      <div className="page-container">
        {/* Back breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> // HOME TERMINAL
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="pixel-tag"
              style={{
                color: '#a855f7',
                borderColor: 'rgba(168, 85, 247, 0.4)',
                background: '#190f24'
              }}
            >
              TECHNICAL ADVISORY // 1-ON-1 OFFICE HOURS
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              marginBottom: '14px',
              textTransform: 'uppercase'
            }}
          >
            Mentors & Industry Jury
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#9ca3af',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Learn directly from senior systems engineers, AI alignment researchers, and venture fellows stationed on-campus for 36 hours.
          </p>
        </div>

        {/* Industry Judges & Mentors Grid */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#a855f7', letterSpacing: '0.06em', marginBottom: '18px' }}>
            // 01. INDUSTRY JURY & RESEARCH MENTORS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
            {judgesAndMentors.map((mentor, idx) => (
              <div
                key={idx}
                className="clip-pixel-corners"
                style={{
                  background: '#0f0f13',
                  border: '1px solid #23232c',
                  padding: 'clamp(18px, 4vw, 28px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 150ms ease, transform 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#23232c';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                        {mentor.name}
                      </h3>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-overmind-orange)' }}>
                        {mentor.role}
                      </div>
                    </div>
                    <span
                      className="pixel-tag"
                      style={{
                        background: '#191224',
                        borderColor: 'rgba(168, 85, 247, 0.4)',
                        color: '#d8b4fe',
                        fontSize: '0.72rem'
                      }}
                    >
                      {mentor.organization}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px dashed #282834', paddingTop: '14px', marginBottom: '14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Domain Expertise:
                    </div>
                    <div style={{ color: '#00ff80', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600 }}>
                      {mentor.expertise}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
                    {mentor.bio}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #1c1c24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'var(--font-mono)' }}>
                    DAY 1 & 2 OFFICE HOURS
                  </span>
                  <span style={{ color: '#a855f7', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    On-Premise Mentorship &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizing Committee & Faculty Leads */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-overmind-orange)', letterSpacing: '0.06em' }}>
              // 02. CSE DEPARTMENT ORGANIZING CREW & COMMITTEES
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {crewCategories.map((cat) => {
                const isActive = crewFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCrewFilter(cat)}
                    className="clip-pixel-corners"
                    style={{
                      background: isActive ? 'var(--color-overmind-orange)' : '#111116',
                      color: isActive ? '#000000' : '#9ca3af',
                      border: `1px solid ${isActive ? 'var(--color-overmind-orange)' : '#262634'}`,
                      padding: '4px 10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
            {filteredCrew.map((org, oIdx) => (
              <div
                key={oIdx}
                className="clip-pixel-corners"
                style={{
                  background: '#0d0d11',
                  border: '1px solid #202028',
                  padding: 'clamp(16px, 3.5vw, 22px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      background: '#1f1a16',
                      border: '1px solid #4a3422',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-pixel)',
                      color: 'var(--color-overmind-orange)',
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}
                  >
                    {org.avatarText}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                        {org.name}
                      </h4>
                      {org.category && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-overmind-orange)', fontFamily: 'var(--font-mono)' }}>
                          [{org.category}]
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      {org.role}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '12px' }}>
                  {org.bio}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {org.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        background: '#16161e',
                        border: '1px solid #292936',
                        color: '#cbd5e1',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 6px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div
          className="clip-pixel-corners bottom-cta-bar"
          style={{
            background: '#111116',
            border: '1px solid #282836',
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Interested in joining as an Industry Mentor?
            </h4>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              Partner with the CSE Department to mentor frontier collegiate engineers.
            </p>
          </div>
          <PixelButton to="/about" variant="stone" size="md">
            Contact Faculty Leads
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
