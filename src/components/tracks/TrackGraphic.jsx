export default function TrackGraphic({ type, color }) {
  if (type === 'ai-agents') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
        <rect width="800" height="450" fill="#080c14" />
        <circle cx="400" cy="225" r="180" stroke="#38bdf8" strokeWidth="1" opacity="0.25" />
        <circle cx="400" cy="225" r="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.4" />
        <circle cx="400" cy="225" r="60" fill="#38bdf8" fillOpacity="0.08" stroke="#38bdf8" strokeWidth="2" />
        <line x1="100" y1="225" x2="700" y2="225" stroke="#38bdf8" strokeWidth="0.5" opacity="0.2" />
        <line x1="400" y1="50" x2="400" y2="400" stroke="#38bdf8" strokeWidth="0.5" opacity="0.2" />
        <rect x="360" y="185" width="80" height="80" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        <text x="400" y="230" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle" letterSpacing="3">AUTONOMOUS</text>
        <path d="M250 140 L350 200 L250 260 Z" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M550 310 L450 250 L550 190 Z" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.3" />
      </svg>
    );
  }

  if (type === 'web3-decentralized') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
        <rect width="800" height="450" fill="#0b0814" />
        <polygon points="400,90 530,170 530,320 400,400 270,320 270,170" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" fill="#a855f7" fillOpacity="0.05" />
        <polygon points="400,140 480,190 480,290 400,340 320,290 320,190" stroke="#c084fc" strokeWidth="1" opacity="0.6" />
        <line x1="270" y1="170" x2="530" y2="320" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
        <line x1="530" y1="170" x2="270" y2="320" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
        <circle cx="400" cy="240" r="16" fill="#c084fc" />
        <text x="400" y="375" fill="#c084fc" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="4">VERIFIABLE_ZK</text>
      </svg>
    );
  }

  if (type === 'cyber-security') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
        <rect width="800" height="450" fill="#14080a" />
        <g opacity="0.25">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={50 + i * 60} y1="0" x2={50 + i * 60} y2="450" stroke="#f43f5e" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="0" y1={40 + i * 50} x2="800" y2={40 + i * 50} stroke="#f43f5e" strokeWidth="0.5" />
          ))}
        </g>
        <rect x="330" y="160" width="140" height="140" stroke="#f43f5e" strokeWidth="2" fill="#f43f5e" fillOpacity="0.08" />
        <rect x="360" y="190" width="80" height="80" stroke="#ffffff" strokeWidth="1" />
        <text x="400" y="235" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="4">ZERO_TRUST</text>
      </svg>
    );
  }

  if (type === 'smart-iot-edge') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
        <rect width="800" height="450" fill="#08140f" />
        <path d="M100 350 L250 150 L400 280 L550 120 L700 300" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6" />
        <circle cx="250" cy="150" r="6" fill="#34d399" />
        <circle cx="400" cy="280" r="6" fill="#34d399" />
        <circle cx="550" cy="120" r="6" fill="#34d399" />
        <line x1="250" y1="150" x2="250" y2="400" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
        <line x1="550" y1="120" x2="550" y2="400" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
        <text x="400" y="380" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="4">PHYSICAL_EDGE</text>
      </svg>
    );
  }

  if (type === 'healthtech') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
        <rect width="800" height="450" fill="#140810" />
        <path d="M150 225 L280 225 L320 120 L360 330 L400 180 L440 260 L480 225 L650 225" stroke="#ec4899" strokeWidth="2.5" fill="none" />
        <circle cx="320" cy="120" r="5" fill="#f472b6" />
        <circle cx="360" cy="330" r="5" fill="#f472b6" />
        <text x="400" y="380" fill="#ec4899" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="4">CLINICAL_TELEMETRY</text>
      </svg>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-graphic">
      <rect width="800" height="450" fill="#141008" />
      <circle cx="400" cy="225" r="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
      <polygon points="400,120 490,280 310,280" stroke="#fbbf24" strokeWidth="1.5" fill="#f59e0b" fillOpacity="0.08" />
      <circle cx="400" cy="225" r="30" fill="#ffffff" fillOpacity="0.8" />
      <text x="400" y="360" fill="#fbbf24" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="4">PUBLIC_GOODS</text>
    </svg>
  );
}
