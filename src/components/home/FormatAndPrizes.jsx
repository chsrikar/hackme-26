import { Calendar, MapPin, Clock, Award, Users, Globe, GitBranch, Video, Presentation, CheckCircle2 } from 'lucide-react';
import PixelButton from '../common/PixelButton';

export default function FormatAndPrizes() {
  const formatStats = [
    { label: "FORMAT", val: "24-Hour Hackathon", icon: <Clock size={16} color="#00ff80" /> },
    { label: "DATES", val: "25 & 26 September 2026", icon: <Calendar size={16} color="var(--color-overmind-orange)" /> },
    { label: "VENUE", val: "VISAT Engineering College", icon: <MapPin size={16} color="#38bdf8" /> },
    { label: "REGISTRATION", val: "₹50 per person", icon: <Award size={16} color="#fbbf24" /> },
    { label: "TEAM SIZE", val: "2-5 Members", icon: <Users size={16} color="#a855f7" /> },
    { label: "ELIGIBILITY", val: "Open to students from all colleges", icon: <Globe size={16} color="#10b981" /> }
  ];

  const rubric = [
    { criteria: "Innovation & Originality", weight: "30%", color: "#00ff80" },
    { criteria: "Technical Depth", weight: "30%", color: "var(--color-overmind-orange)" },
    { criteria: "UI/UX & Execution", weight: "20%", color: "#38bdf8" },
    { criteria: "Working Prototype", weight: "20%", color: "#fbbf24" }
  ];

  const timelineEvents = [
    { time: "Day 1, 10:00 AM", activity: "Hackathon Briefing & Rules", tag: "Briefing" },
    { time: "Day 1, 11:00 AM", activity: "Room Allocation & Work Setup", tag: "Setup" },
    { time: "Day 1, 2:00 PM", activity: "Hackathon Work Begins", tag: "Sprint Start" },
    { time: "Day 1, 5:00 PM", activity: "Games & Music Band", tag: "Social & Music" },
    { time: "Day 1, 9:30 PM", activity: "Overnight Hackathon Continues", tag: "Overnight" },
    { time: "Day 2, 9:00 AM", activity: "Final Submission Deadline", tag: "Deadline" },
    { time: "Day 2, 9:00 AM", activity: "Project Presentations & Judging", tag: "Evaluation" },
    { time: "Day 2, 11:00 AM", activity: "Association Inauguration & Programme Close", tag: "Ceremony" }
  ];

  return (
    <div style={{ background: 'transparent', padding: '60px 0', display: 'flex', flexDirection: 'column', gap: '80px' }}>
      {/* 1. Format & Prize Section */}
      <section className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="pixel-tag" style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)', background: '#1c160b' }}>
            EVENT SNAPSHOT // 24-HOUR SPRINT
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', color: '#ffffff', fontWeight: 800, marginTop: '8px' }}>
            Format & Prize Overview
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
          {formatStats.map((stat, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners"
              style={{
                background: '#0d0d12',
                border: '1px solid #20202a',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{ padding: '8px', background: '#171720', borderRadius: '4px' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
                <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.98rem', marginTop: '2px' }}>
                  {stat.val}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Scoring & Judging Section */}
      <section className="page-container">
        <div
          className="clip-pixel-corners"
          style={{
            background: '#0e0e13',
            border: '1px solid #242430',
            padding: 'clamp(28px, 5vw, 48px)'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <span className="pixel-tag" style={{ color: '#00ff80', borderColor: 'rgba(0, 255, 128, 0.4)', background: '#0e1c14' }}>
              TRANSPARENT EVALUATION // 100% MERIT
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#ffffff', fontWeight: 800, marginTop: '10px' }}>
              Judged on what you built, not how you pitched it
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {/* Criteria Table */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                // SCORING WEIGHTS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rubric.map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#13131a',
                      border: '1px solid #22222d',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.95rem' }}>
                      {r.criteria}
                    </span>
                    <span className="font-pixel" style={{ color: r.color, fontSize: '1.2rem' }}>
                      {r.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Requirements */}
            <div style={{ background: '#121217', border: '1px solid #202028', padding: '24px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
                // SUBMISSION REQUIREMENTS
              </h3>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#d1d5db' }}>
                  <GitBranch size={18} color="#00ff80" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>GitHub repository</strong> with a clear setup README explaining how to run the project.
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#38bdf8' }}>
                  <Video size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Working demo</strong> (live deployment URL or pre-recorded walkthrough video).
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#fbbf24' }}>
                  <Presentation size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Short presentation</strong> to the judging panel at the end of the 24 hours.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Timeline Section */}
      <section className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#1c140e' }}>
            CHRONOLOGICAL RUNBOOK // 24 HOURS
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', color: '#ffffff', fontWeight: 800, marginTop: '8px' }}>
            Hackathon Timeline
          </h2>
        </div>

        <div
          className="clip-pixel-corners"
          style={{
            background: '#0d0d12',
            border: '1px solid #23232e',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <table style={{ width: '100%', minWidth: '480px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#15151c', borderBottom: '2px solid #282834' }}>
                <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: 'var(--color-overmind-orange)', width: '32%' }}>TIME</th>
                <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: '#e5e7eb', width: '48%' }}>ACTIVITY</th>
                <th style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: '#9ca3af', width: '20%' }}>PHASE</th>
              </tr>
            </thead>
            <tbody>
              {timelineEvents.map((ev, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < timelineEvents.length - 1 ? '1px solid #1a1a24' : 'none',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 700 }}>
                    {ev.time}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                    {ev.activity}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="pixel-tag" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#13131a', borderColor: '#2c2c38', color: '#a1a1aa' }}>
                      {ev.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
