import { useState } from 'react';
import { scheduleDays } from '../data/schedule';
import { Clock, Calendar, Table as TableIcon, LayoutList, Download, CheckCircle2 } from 'lucide-react';
import PixelButton from '../components/common/PixelButton';

export default function SchedulePage() {
  const [activeDayId, setActiveDayId] = useState('day-1');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  const currentDay = scheduleDays.find((d) => d.dayId === activeDayId) || scheduleDays[0];

  return (
    <div style={{ backgroundColor: '#070708', minHeight: '100vh', color: '#f5f5f4', paddingTop: '40px', paddingBottom: '90px' }}>
      <div className="page-container">
        {/* Page Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="pixel-tag"
              style={{
                color: 'var(--color-overmind-orange)',
                borderColor: 'rgba(242, 98, 7, 0.4)',
                background: '#161210'
              }}
            >
              OFFICIAL TIMELINE // CSE DEPARTMENT
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
            Hackathon Schedule
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
            Official runbook for the CSE Department Association Inauguration and HACKME'26 overnight hackathon.
          </p>
        </div>

        {/* Controls Bar: Day Switcher & View Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}
        >
          {/* Day Selector Tabs (Overmind Stepped Pixel Style) */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}
            role="tablist"
            aria-label="Schedule Days"
          >
            {scheduleDays.map((day) => {
              const isActive = activeDayId === day.dayId;
              return (
                <button
                  key={day.dayId}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveDayId(day.dayId)}
                  className="clip-pixel-corners"
                  style={{
                    background: isActive ? '#f26207' : '#141418',
                    color: isActive ? '#000000' : '#e5e7eb',
                    border: isActive ? '1px solid #f26207' : '1px solid #27272f',
                    padding: '10px 22px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 120ms ease'
                  }}
                >
                  <Calendar size={15} color={isActive ? '#000000' : '#9ca3af'} />
                  <span>{day.dayLabel}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: isActive ? 0.9 : 0.6,
                      padding: '2px 6px',
                      background: isActive ? 'rgba(0,0,0,0.25)' : '#202026',
                      borderRadius: '2px'
                    }}
                  >
                    {day.events.length} EVENTS
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div
            className="clip-pixel-corners"
            style={{
              display: 'flex',
              background: '#121216',
              border: '1px solid #24242e',
              padding: '4px'
            }}
          >
            <button
              onClick={() => setViewMode('table')}
              className="clip-pixel-corners"
              style={{
                background: viewMode === 'table' ? '#252530' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#9ca3af',
                border: 'none',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TableIcon size={14} color={viewMode === 'table' ? 'var(--color-overmind-orange)' : '#9ca3af'} />
              Table View
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className="clip-pixel-corners"
              style={{
                background: viewMode === 'cards' ? '#252530' : 'transparent',
                color: viewMode === 'cards' ? '#ffffff' : '#9ca3af',
                border: 'none',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutList size={14} color={viewMode === 'cards' ? 'var(--color-overmind-orange)' : '#9ca3af'} />
              Cards View
            </button>
          </div>
        </div>

        {/* Schedule Title Banner (Matches Document Header) */}
        <div
          className="clip-pixel-corners"
          style={{
            background: 'linear-gradient(180deg, #16161d 0%, #101014 100%)',
            border: '1px solid #292934',
            padding: '24px 28px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          <div>
            <span
              className="pixel-tag"
              style={{
                color: 'var(--color-overmind-orange)',
                borderColor: 'rgba(242, 98, 7, 0.4)',
                background: '#1c1613',
                marginBottom: '8px'
              }}
            >
              {currentDay.dayLabel.toUpperCase()} TIMETABLE
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                color: '#ffffff',
                fontWeight: 800,
                marginTop: '6px',
                letterSpacing: '0.02em',
                fontFamily: 'var(--font-serif)'
              }}
            >
              {currentDay.title}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
              {currentDay.theme}
            </p>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#d4d4d8',
              background: '#0d0d10',
              padding: '6px 12px',
              border: '1px solid #23232c'
            }}
          >
            {currentDay.events.length} SESSIONS SCHEDULED
          </div>
        </div>

        {/* View Mode 1: Table View (Exact representation of official document) */}
        {viewMode === 'table' && (
          <div
            className="clip-pixel-corners"
            style={{
              background: '#0f0f13',
              border: '1px solid #262630',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.92rem'
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#15151c',
                      borderBottom: '2px solid #2a2a36'
                    }}
                  >
                    <th
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--color-overmind-orange)',
                        letterSpacing: '0.08em',
                        width: '26%',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      TIME SLOT
                    </th>
                    <th
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#f3f4f6',
                        letterSpacing: '0.08em',
                        width: '32%'
                      }}
                    >
                      PROGRAM / EVENT
                    </th>
                    <th
                      style={{
                        padding: '16px 20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#f3f4f6',
                        letterSpacing: '0.08em',
                        width: '42%'
                      }}
                    >
                      DETAILS & AGENDA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDay.events.map((event, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx < currentDay.events.length - 1 ? '1px solid #1f1f28' : 'none',
                        background: idx % 2 === 0 ? 'rgba(15, 15, 19, 0.95)' : 'rgba(20, 20, 26, 0.95)',
                        transition: 'background 120ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(28, 28, 38, 0.95)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(15, 15, 19, 0.95)' : 'rgba(20, 20, 26, 0.95)';
                      }}
                    >
                      {/* Column 1: TIME SLOT */}
                      <td
                        style={{
                          padding: '18px 20px',
                          verticalAlign: 'top'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.92rem',
                              fontWeight: 700,
                              color: '#ffffff'
                            }}
                          >
                            {event.time}
                          </span>
                          {event.duration && (
                            <span
                              style={{
                                display: 'inline-block',
                                width: 'fit-content',
                                background: '#181820',
                                border: '1px solid #2a2a36',
                                padding: '2px 8px',
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-mono)',
                                color: '#9ca3af'
                              }}
                            >
                              {event.duration}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 2: PROGRAM / EVENT */}
                      <td
                        style={{
                          padding: '18px 20px',
                          verticalAlign: 'top'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: '1.05rem',
                              color: '#ffffff',
                              lineHeight: 1.4
                            }}
                          >
                            {event.activity}
                          </span>
                          {event.type && (
                            <span
                              className="pixel-tag"
                              style={{
                                width: 'fit-content',
                                fontSize: '0.65rem',
                                padding: '1px 6px',
                                background: '#121218',
                                borderColor: '#2c2c38',
                                color: '#a1a1aa'
                              }}
                            >
                              {event.type.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 3: DETAILS & AGENDA */}
                      <td
                        style={{
                          padding: '18px 20px',
                          verticalAlign: 'top'
                        }}
                      >
                        {event.agenda && event.agenda.length > 0 ? (
                          <ul
                            style={{
                              listStyleType: 'none',
                              padding: 0,
                              margin: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px'
                            }}
                          >
                            {event.agenda.map((item, aIdx) => (
                              <li
                                key={aIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '8px',
                                  color: '#d1d5db',
                                  lineHeight: 1.5,
                                  fontSize: '0.9rem'
                                }}
                              >
                                <span style={{ color: 'var(--color-overmind-orange)', flexShrink: 0, marginTop: '2px' }}>
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                            {event.details}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 2: Cards / Timeline View */}
        {viewMode === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentDay.events.map((item, idx) => (
              <div
                key={idx}
                className="clip-pixel-corners"
                style={{
                  background: '#0f0f13',
                  border: '1px solid #212128',
                  padding: '20px 24px',
                  transition: 'border-color 150ms ease, background 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(242, 98, 7, 0.5)';
                  e.currentTarget.style.background = '#14141a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#212128';
                  e.currentTarget.style.background = '#0f0f13';
                }}
              >
                {/* Row Top Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#191920',
                        border: '1px solid #2f2f3a',
                        padding: '4px 10px',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--color-overmind-orange)'
                      }}
                    >
                      <Clock size={13} />
                      <span>{item.time}</span>
                    </div>

                    {item.duration && (
                      <span
                        style={{
                          background: '#17171d',
                          border: '1px solid #292934',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#a1a1aa'
                        }}
                      >
                        {item.duration}
                      </span>
                    )}

                    {item.type && (
                      <span
                        className="pixel-tag"
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          background: '#101014',
                          borderColor: '#2d2d38',
                          color: '#cbd5e1'
                        }}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: '#52525b'
                    }}
                  >
                    SLOT #{String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}
                >
                  {item.activity}
                </h3>

                {/* Agenda Bullet points */}
                {item.agenda && item.agenda.length > 0 ? (
                  <ul
                    style={{
                      listStyleType: 'none',
                      padding: 0,
                      margin: '10px 0 0 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    {item.agenda.map((ag, aIdx) => (
                      <li
                        key={aIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '10px',
                          fontSize: '0.9rem',
                          color: '#d4d4d8',
                          lineHeight: 1.5
                        }}
                      >
                        <span style={{ color: 'var(--color-overmind-orange)', fontWeight: 700 }}>•</span>
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#9ca3af', fontSize: '0.92rem', margin: 0 }}>
                    {item.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Helper / Registration CTA */}
        <div
          className="clip-pixel-corners"
          style={{
            marginTop: '48px',
            background: '#111115',
            border: '1px solid #292934',
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              Have Questions Regarding Room Allocation or Timing?
            </h4>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', margin: 0 }}>
              Faculty coordinators, lab mentors, and student volunteers are stationed at the Help Desk throughout Day 1 and Day 2.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="sm" target="_blank" rel="noopener noreferrer">
              Register for Hackathon
            </PixelButton>
            <PixelButton to="/about" variant="stone" size="sm">
              Contact Organizing Team
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
