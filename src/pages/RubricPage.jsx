import { useState } from 'react';
import { Radio, CheckSquare, Layers, Award, ArrowLeft, BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PixelButton from '../components/common/PixelButton';

export default function RubricPage() {
  const criteria = [
    {
      percentage: "30%",
      name: "Innovation & Originality",
      color: "#00ff80",
      description: "How novel and ambitious is the concept? Does it push existing patterns beyond trivial wrappers?",
      breakdown: [
        "Novel architecture or conceptual approach to the problem",
        "Creative synthesis across different technical domains",
        "Differentiation from existing off-the-shelf solutions"
      ]
    },
    {
      percentage: "25%",
      name: "Technical Complexity & Depth",
      color: "var(--color-overmind-orange)",
      description: "Depth of engineering, system architecture, robustness of algorithms, and code cleanliness.",
      breakdown: [
        "Quality of codebase, modularity, and error handling",
        "Appropriate choice of low-level or high-performance frameworks",
        "Implementation of non-trivial algorithmic or distributed logic"
      ]
    },
    {
      percentage: "20%",
      name: "Working Execution & Live Demo",
      color: "#38bdf8",
      description: "Does the project work reliably in a live setting? Is there a tangible working artifact or demo?",
      breakdown: [
        "Functioning prototype during the 5-minute team pitch",
        "Handling edge cases and live input without crashing",
        "Demonstrated test passes and reproducible deployment"
      ]
    },
    {
      percentage: "15%",
      name: "Practical Utility & Impact",
      color: "#fbbf24",
      description: "Does this address a real problem with tangible societal, developer, or commercial value?",
      breakdown: [
        "Clear definition of target users or beneficiaries",
        "Viability of continuous open-source or commercial lifecycle",
        "Potential to scale beyond the 36-hour sprint"
      ]
    },
    {
      percentage: "10%",
      name: "Presentation Craft & Jury Q&A",
      color: "#a855f7",
      description: "Clarity of communication, slide design, time adherence (5 min pitch), and answers during 2 min Q&A.",
      breakdown: [
        "Concise articulation of problem, solution, and architecture",
        "Equal participation across all team members",
        "Crisp, confident responses to technical jury queries"
      ]
    }
  ];

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
                color: '#00ff80',
                borderColor: 'rgba(0, 255, 128, 0.4)',
                background: '#0d1f14'
              }}
            >
              SCORING CRITERIA // 100-POINT BENCHMARK
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
            Judging Rubric & Scoring
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
            Scoring at HACKME'26 is completely transparent. Every project is evaluated across 5 weighted pillars by jury panels on Day 2.
          </p>
        </div>

        {/* Weightage Percentage Bar */}
        <div
          className="clip-pixel-corners"
          style={{
            background: '#111116',
            border: '1px solid #23232c',
            padding: '20px',
            marginBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>TOTAL EVALUATION WEIGHT: 100%</span>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#00ff80' }}>5 PILLARS</span>
          </div>
          <div style={{ display: 'flex', height: '14px', borderRadius: '2px', overflow: 'hidden', gap: '2px' }}>
            <div style={{ width: '30%', background: '#00ff80' }} title="Innovation (30%)" />
            <div style={{ width: '25%', background: '#f26207' }} title="Technical Depth (25%)" />
            <div style={{ width: '20%', background: '#38bdf8' }} title="Working Execution (20%)" />
            <div style={{ width: '15%', background: '#fbbf24' }} title="Impact (15%)" />
            <div style={{ width: '10%', background: '#a855f7' }} title="Presentation (10%)" />
          </div>
        </div>

        {/* 5 Pillars Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '60px' }}>
          {criteria.map((crit, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners"
              style={{
                background: '#0f0f13',
                border: '1px solid #23232c',
                padding: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '20px',
                transition: 'border-color 120ms ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = crit.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#23232c'; }}
            >
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: '1.4rem',
                      color: crit.color,
                      background: 'rgba(255,255,255,0.04)',
                      padding: '4px 10px',
                      border: `1px solid ${crit.color}40`
                    }}
                  >
                    {crit.percentage}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {crit.name}
                  </h3>
                </div>

                <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {crit.description}
                </p>

                <div style={{ borderTop: '1px dashed #242430', paddingTop: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#e5e7eb', marginBottom: '8px', textTransform: 'uppercase' }}>
                    What Judges Look For:
                  </div>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {crit.breakdown.map((item, bIdx) => (
                      <li key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#d1d5db' }}>
                        <span style={{ color: crit.color }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  SLOT WEIGHT
                </span>
                <span className="font-pixel" style={{ fontSize: '1.8rem', color: '#ffffff' }}>
                  {crit.percentage.replace('%', ' PTS')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="clip-pixel-corners"
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
              Have questions on problem statements or scoring?
            </h4>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              Jury rubrics are explained during the Hackathon Briefing on Day 1 at 11:30 AM.
            </p>
          </div>
          <PixelButton to="/schedule" variant="orange" size="md">
            View Schedule
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
