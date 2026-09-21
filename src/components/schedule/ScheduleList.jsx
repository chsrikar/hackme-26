import { useState } from 'react';
import TimelineItem from './TimelineItem';
import { scheduleDays } from '../../data/schedule';
import { useScrollReveal } from '../../animations/useAnime';

export default function ScheduleList({ initialDay = 'day-1', compact = false }) {
  const [activeDayId, setActiveDayId] = useState(initialDay);
  const containerRef = useScrollReveal('.anime-timeline-item');

  const currentDay = scheduleDays.find((d) => d.dayId === activeDayId) || scheduleDays[0];

  return (
    <div>
      {/* Day Switcher Tabs */}
      <div className="schedule-tabs" role="tablist" aria-label="Schedule Days">
        {scheduleDays.map((day) => (
          <button
            key={day.dayId}
            role="tab"
            aria-selected={activeDayId === day.dayId}
            className={`schedule-tab-btn ${activeDayId === day.dayId ? 'active' : ''}`}
            onClick={() => setActiveDayId(day.dayId)}
          >
            {day.dayLabel} • {day.date.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Active Day Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ fontSize: '1.4rem' }}>{currentDay.theme}</h3>
        <p style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          {currentDay.date}
        </p>
      </div>

      {/* Timeline Rail & Events */}
      <div className="timeline-container" ref={containerRef}>
        <div className="timeline-rail" />
        {currentDay.events.map((event, idx) => (
          <TimelineItem key={`${currentDay.dayId}-${idx}`} event={event} />
        ))}
      </div>
    </div>
  );
}
