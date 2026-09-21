import { useCountUp } from '../../animations/useAnime';

function StatItem({ value, label, prefix = '', suffix = '' }) {
  const numRef = useCountUp(value, { prefix, suffix, duration: 1800 });

  return (
    <div className="stat-card">
      <div className="stat-number" ref={numRef}>
        {prefix}{value}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="stats-section" aria-label="Hackathon Statistics">
      <div className="container">
        <div className="stats-grid">
          <StatItem value={500} suffix="+" label="Hackers Expected" />
          <StatItem value={36} suffix="h" label="Non-Stop Coding" />
          <StatItem value={6} label="Technical Tracks" />
          <StatItem value={145} prefix="₹" suffix="k+" label="Total Prize Pool" />
        </div>
      </div>
    </section>
  );
}
