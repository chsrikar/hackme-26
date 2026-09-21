import PixelButton from '../common/PixelButton';
import { Check, ArrowRight } from 'lucide-react';

export default function SpecTable() {
  const comparison = [
    { parameter: 'Team Composition', typical: '1–2 solo or ad-hoc', hack26: '3–4 builders per team' },
    { parameter: 'Duration', typical: '6–12 hours', hack26: '24 hours, continuous' },
    { parameter: 'Eligibility', typical: 'Host college only', hack26: 'Open to all colleges' },
    { parameter: 'Judging', typical: 'Subjective pitch only', hack26: 'Fixed rubric, live demo + code review' },
    { parameter: 'Beyond the Build', typical: 'None', hack26: 'Games, music, and a closing campfire' },
    { parameter: 'Prize', typical: 'Certificates', hack26: 'Cash prize for 1st place' }
  ];

  return (
    <section className="page-container" style={{ padding: '40px 0 60px 0' }}>
      <div
        className="clip-pixel-corners"
        style={{
          background: '#0e0e12',
          border: '1px solid #23232b',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden'
        }}
      >
        {/* Table Header */}
        <div
          style={{
            background: '#16161c',
            borderBottom: '1px solid #23232b',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.8rem' }}>
              // COMPARISON MATRIX
            </span>
            <h3 style={{ fontSize: '1.35rem', color: '#ffffff', fontWeight: 800, marginTop: '2px' }}>
              Why HACK 26?
            </h3>
          </div>

          <span className="pixel-tag" style={{ fontSize: '0.72rem', color: '#00ff80', borderColor: 'rgba(0,255,128,0.4)', background: '#0e1c14' }}>
            HACK 26 SPEC
          </span>
        </div>

        {/* Table Rows */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', minWidth: '520px', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#111116', color: '#6b7280', borderBottom: '1px solid #1f1f28' }}>
                <th style={{ padding: '14px 20px', width: '28%' }}>PARAMETER</th>
                <th style={{ padding: '14px 20px', width: '34%', color: '#9ca3af' }}>TYPICAL HACKATHON</th>
                <th style={{ padding: '14px 20px', width: '38%', color: 'var(--color-overmind-orange)' }}>HACK 26</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #181822',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                    color: '#d1d5db'
                  }}
                >
                  <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 700 }}>
                    {row.parameter}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6b7280' }}>
                    {row.typical}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#00ff80' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check size={16} color="#00ff80" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{row.hack26}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA Row */}
        <div
          style={{
            padding: '16px 24px',
            background: '#121217',
            borderTop: '1px solid #1f1f28',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
            Experience an authentic 24-hour builder culture — from initial commit to campfire wrap-up.
          </span>
          <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="sm" icon={<ArrowRight size={14} />} target="_blank" rel="noopener noreferrer">
            Join HACK 26
          </PixelButton>
        </div>
      </div>
    </section>
  );
}
