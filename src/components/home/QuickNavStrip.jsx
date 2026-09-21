export default function QuickNavStrip() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { num: '1', title: 'INNOVATION VECTORS & TRACKS', target: 'section-context-graph' },
    { num: '2', title: 'HACKER GPU & LAB SANDBOX', target: 'section-traces-datasets' },
    { num: '3', title: 'AUTOMATED EVALS & SCORING', target: 'section-automated-evals' },
    { num: '4', title: '₹1.45L+ PRIZES & REWARDS', target: 'section-model-training' }
  ];

  return (
    <div style={{ paddingTop: '60px', paddingBottom: '40px', background: '#0a0a0c' }}>
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Tag */}
        <div>
          <span
            className="pixel-tag"
            style={{
              color: 'var(--color-overmind-orange)',
              borderColor: 'rgba(242, 98, 7, 0.4)',
              background: '#151210'
            }}
          >
            HOW HACKME'26 WORKS // EVENT ARCHITECTURE
          </span>
        </div>

        {/* 4 Stepped Pill Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.num}
              onClick={() => scrollTo(item.target)}
              className="clip-pixel-corners"
              style={{
                background: '#151518',
                border: '1px solid #292930',
                color: '#e5e7eb',
                padding: '12px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#222228';
                e.currentTarget.style.borderColor = 'var(--color-overmind-orange)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#151518';
                e.currentTarget.style.borderColor = '#292930';
                e.currentTarget.style.color = '#e5e7eb';
              }}
            >
              <span style={{ color: 'var(--color-overmind-orange)', fontWeight: 700 }}>
                {item.num}.
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
