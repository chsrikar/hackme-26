export default function AboutHackathon() {
  const manifestoItems = [
    {
      num: "01",
      title: "BACKING ICONIC HACKS",
      desc: "We look for software and systems that connect deeply with fundamental computer science principles, forge resilient architecture, and create memorable breakthroughs."
    },
    {
      num: "02",
      title: "THE BUILDER AT THE CENTER",
      desc: "We believe the best breakthroughs come from creators with clear vision. We provide the GPU clusters, runtime observability, and mentorship needed to break through."
    },
    {
      num: "03",
      title: "PRIZES & RECOGNITION",
      desc: "We bring ₹1,45,000+ in total prizes across multiple categories, recognizing innovation, technical excellence, and creative problem-solving."
    },
    {
      num: "04",
      title: "BUILD FOR THE LONG TERM",
      desc: "We invest beyond a 36-hour weekend sprint. We help teams turn prototypes into enduring open-source repositories and venture-backed research initiatives."
    },
    {
      num: "05",
      title: "BRIDGE ACADEMIA & INDUSTRY",
      desc: "We connect campus CS research laboratories with production engineering teams in frontier AI, zero-knowledge cryptography, and robotics."
    },
    {
      num: "06",
      title: "IN THE TRENCHES WITH YOU",
      desc: "From system architecture reviews to live automated evals and model fine-tuning, research engineers work directly beside you in the laboratory."
    }
  ];

  return (
    <section className="page-container section-spacer" id="about-section">
      <div className="overmind-section-header">
        <span className="pixel-tag pixel-tag-green">
          PHILOSOPHY // HACKME26 MANIFESTO
        </span>
        <h2 className="overmind-section-title">
          Built for Specialised Hackers
        </h2>
        <p className="overmind-section-desc">
          Hackathons shouldn't be about building disposable toy prototypes. HACKME26 is designed as an auteur-first engineering laboratory organized by the Department of Computer Science & Engineering.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {manifestoItems.map((item, idx) => (
          <div
            key={idx}
            className="overmind-feature-box clip-pixel-corners"
            style={{ background: '#0d0d10' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="font-pixel" style={{ color: 'var(--color-copper-400)', fontSize: '1rem' }}>
                // {item.num}
              </span>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: '#78716c' }}>
                TENET_0{idx + 1}
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', fontWeight: 700 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
