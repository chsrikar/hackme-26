import { useState } from 'react';
import { Terminal, Network, Radio, Cpu, Sparkles, Folder, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CrtMonitor() {
  const apps = [
    { id: 'schedule', name: 'Schedule', icon: <Clock size={22} color="#f26207" />, color: '#f26207', desc: '36-Hour Chronological Runbook & Milestones', path: '/schedule' },
    { id: 'vectors', name: 'Vectors', icon: <Cpu size={22} color="#00ff80" />, color: '#00ff80', desc: 'Frontier AI, Systems, Hardware & Web3 Tracks', path: '/vectors' },
    { id: 'prizes', name: 'Prizes', icon: <Sparkles size={22} color="#fbbf24" />, color: '#fbbf24', desc: 'Prize Pool & Recognition // Announced Soon', path: '/prizes' },
    { id: 'rules', name: 'Rules', icon: <Shield size={22} color="#38bdf8" />, color: '#38bdf8', desc: 'Code of Conduct, Submission Deadlines & Team Size', path: '/rules' },
    { id: 'mentors', name: 'Mentors', icon: <Network size={22} color="#a855f7" />, color: '#a855f7', desc: '1-on-1 Senior Engineers & Faculty Office Hours', path: '/mentors' },
    { id: 'rubric', name: 'Rubric', icon: <Radio size={22} color="#00ff80" />, color: '#00ff80', desc: 'Transparent Automated Evaluation & Scoring Rubric', path: '/rubric' },
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={22} color="#f26207" />, color: '#f26207', desc: "HACKME'26 CLI & Git Submission Portal", path: '/terminal' },
    { id: 'register', name: 'Register', icon: <Folder size={22} color="#38bdf8" />, color: '#38bdf8', desc: 'Merit-Based Campus Residency Application', path: 'https://forms.gle/Z1KZCfkG4Jqq4eqj9', isExternal: true },
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', width: '100%', position: 'relative' }}>
      {/* Vintage Rounded Heavy CRT Monitor Chassis */}
      <div
        className="clip-pixel-corners"
        style={{
          background: 'linear-gradient(180deg, #2b2826 0%, #151413 100%)',
          border: '4px solid #3d3936',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), inset 0 2px 4px rgba(255, 255, 255, 0.15)',
          padding: 'clamp(14px, 2.8vw, 24px)',
          position: 'relative'
        }}
      >
        {/* CRT Bezel Top Status & Screws */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff80', boxShadow: '0 0 10px #00ff80' }} />
            <span className="font-pixel" style={{ fontSize: '0.75rem', color: '#a8a29e', letterSpacing: '0.08em' }}>
              HACKME'26 // RETRO-CRT TERMINAL OS v2.6
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#3d3835', borderRadius: '1px' }} />
            <span style={{ width: '8px', height: '8px', background: '#3d3835', borderRadius: '1px' }} />
            <span style={{ width: '8px', height: '8px', background: '#3d3835', borderRadius: '1px' }} />
          </div>
        </div>

        {/* Inner Curved Phosphor Screen with Pixel Sky Backdrop */}
        <div
          style={{
            background: 'linear-gradient(180deg, #9bb8cc 0%, #d5e5f0 38%, #b5ccd8 70%, #7d9ba8 100%)',
            border: '3px solid #141715',
            borderRadius: '6px',
            minHeight: '440px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}
        >
          {/* Subtle Pixel Cloud Graphics Inside Screen */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.85 }}>
            {/* SVG Pixel Cloud Cluster */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
              <defs>
                <pattern id="pixelGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="4" height="4" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pixelGrid)" />
              {/* Cloud silhouettes */}
              <g fill="#ffffff" fillOpacity="0.4">
                <rect x="60" y="80" width="120" height="24" rx="2" />
                <rect x="80" y="68" width="80" height="36" rx="2" />
                <rect x="740" y="110" width="160" height="30" rx="2" />
                <rect x="770" y="94" width="100" height="42" rx="2" />
              </g>
            </svg>
          </div>

          {/* Top Bar of Desktop */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 5 }}>
            <span className="font-pixel" style={{ color: '#1c1917', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.65)', padding: '2px 8px', borderRadius: '2px' }}>
              SYSTEM_READY // HACKME26_ARENA
            </span>
            <span className="font-mono" style={{ color: '#1c1917', fontSize: '0.75rem', fontWeight: 600 }}>
              12:00:00 UTC
            </span>
          </div>

          {/* 8 Desktop Application Icons Grid (Clicking any redirects to that particular page!) */}
          <div
            className="crt-app-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
              gap: 'clamp(10px, 2.5vw, 24px)',
              maxWidth: '100%',
              margin: '24px auto',
              width: '100%',
              position: 'relative',
              zIndex: 5,
              padding: '0 8px'
            }}
          >
            {apps.map((app) => {
              const Component = app.isExternal ? 'a' : Link;
              const linkProps = app.isExternal 
                ? { href: app.path, target: '_blank', rel: 'noopener noreferrer' }
                : { to: app.path };

              return (
                <Component
                  key={app.id}
                  {...linkProps}
                  className="clip-pixel-corners glass-card glass-card-hover"
                  style={{
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = app.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  title={`Open ${app.name} (${app.path})`}
                >
                  <div style={{ padding: '6px', background: '#0a0d10', borderRadius: '4px', display: 'flex' }}>
                    {app.icon}
                  </div>
                  <span className="font-pixel" style={{ color: '#ffffff', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
                    {app.name}
                  </span>
                </Component>
              );
            })}
          </div>

          {/* CRT Desktop Taskbar Dock */}
          <div
            className="clip-pixel-corners"
            style={{
              background: 'rgba(15, 17, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--color-overmind-orange)', fontWeight: 800, fontSize: '0.9rem' }}>⊞</span>
              <span className="font-pixel" style={{ color: '#ffffff', fontSize: '0.78rem' }}>
                HACKME'26 OS
              </span>
            </div>

            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00ff80' }}>
              8 APPS RUNNING • CLUSTER SYNCED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
