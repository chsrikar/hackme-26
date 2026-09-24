import { Terminal, Gamepad2, Music, Flame, Wifi, Cpu, Users, Building2, CheckCircle2 } from 'lucide-react';
import PixelButton from '../common/PixelButton';

export default function AboutHack26() {
  const pillars = [
    {
      title: "Hackathon",
      tagline: "Build · Code · Innovate",
      desc: "Twenty-four hours, one shot to ship. Work in a team of 2-5 Members, tackle a real problem, and walk away with something you actually built.",
      icon: <Terminal size={24} color="var(--color-overmind-orange)" />,
      color: "var(--color-overmind-orange)"
    },
    {
      title: "Games",
      tagline: "Play · Compete · Win",
      desc: "Take a break from your IDE. Compete in quick games between build sessions.",
      icon: <Gamepad2 size={24} color="#38bdf8" />,
      color: "#38bdf8"
    },
    {
      title: "Entertainments",
      tagline: "Music · Fun · Vibes",
      desc: "Good music running through the venue to keep the energy up.",
      icon: <Music size={24} color="#a855f7" />,
      color: "#a855f7"
    },
    {
      title: "Campfire",
      tagline: "Food · Friends · Stories",
      desc: "Close out the hackathon around a campfire — good food, good company, and the stories that only come out at 2 AM.",
      icon: <Flame size={24} color="#fbbf24" />,
      color: "#fbbf24"
    }
  ];

  const infrastructure = [
    {
      icon: <Wifi size={20} color="#00ff80" />,
      title: "Campus Wi-Fi access for all 24 hours",
      desc: "Continuous high-speed wireless connectivity provisioned across all hacking blocks."
    },
    {
      icon: <Cpu size={20} color="var(--color-overmind-orange)" />,
      title: "Hardware lending desk",
      desc: "Raspberry Pi, Arduino, ESP32, basic sensor kits, and prototyping tools ready on loan."
    },
    {
      icon: <Users size={20} color="#38bdf8" />,
      title: "On-ground mentors available",
      desc: "Domain mentors and faculty available for check-ins and debugging rounds through the night."
    },
    {
      icon: <Building2 size={20} color="#a855f7" />,
      title: "Dedicated hacking zone at VISAT",
      desc: "Secure, fully powered hacking rooms open continuously through both days."
    }
  ];

  return (
    <div style={{ background: 'transparent', padding: '60px 0', display: 'flex', flexDirection: 'column', gap: '80px' }}>
      {/* 1. About Section: What is HACK 26? */}
      <section className="page-container">
        <div
          className="clip-pixel-corners"
          style={{
            background: 'linear-gradient(180deg, #131318 0%, #0d0d11 100%)',
            border: '1px solid #262632',
            padding: 'clamp(28px, 5vw, 48px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="pixel-tag"
              style={{
                color: 'var(--color-overmind-orange)',
                borderColor: 'rgba(242, 98, 7, 0.4)',
                background: '#1a1410'
              }}
            >
              ABOUT THE ARENA // CYBORGS FLAGSHIP
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              fontWeight: 800,
              marginBottom: '18px',
              fontFamily: 'var(--font-serif)'
            }}
          >
            What is HACK 26?
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              color: '#d1d5db',
              lineHeight: 1.7,
              maxWidth: '860px',
              margin: '0 0 28px 0'
            }}
          >
            HACK 26 is Cyborgs' flagship 24-hour hackathon — a chance to turn an idea into something real, alongside people who think the way you do. Bring a team or find one on the spot, pick a problem worth solving, and build through the night. When the code stops, the campfire starts.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="md" target="_blank" rel="noopener noreferrer">
              Register for HACK 26
            </PixelButton>
            <PixelButton to="/schedule" variant="stone" size="md">
              Check Schedule
            </PixelButton>
          </div>
        </div>
      </section>

      {/* 2. What's Happening Section: More than a hackathon */}
      <section className="page-container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="pixel-tag" style={{ color: '#00ff80', borderColor: 'rgba(0, 255, 128, 0.4)', background: '#0e1c14' }}>
            BEYOND THE BUILD // 4 CORE PILLARS
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)',
              color: '#ffffff',
              fontWeight: 800,
              marginTop: '10px'
            }}
          >
            More than a hackathon
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Code relentlessly, pause for competitive games, soak in high-energy music, and bond under the stars.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners"
              style={{
                background: '#0e0e13',
                border: '1px solid #22222c',
                padding: 'clamp(18px, 4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 150ms ease, transform 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#22222c';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ padding: '8px', background: '#16161f', borderRadius: '4px', width: 'fit-content', marginBottom: '16px' }}>
                  {item.icon}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  {item.title}
                </h3>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: item.color, fontWeight: 600, marginBottom: '12px' }}>
                  {item.tagline}
                </div>

                <p style={{ color: '#9ca3af', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. On-the-Ground / Infrastructure Section */}
      <section className="page-container">
        <div
          className="clip-pixel-corners"
          style={{
            background: '#101015',
            border: '1px solid #252530',
            padding: 'clamp(28px, 5vw, 44px)'
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <span className="pixel-tag" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', background: '#0e1822' }}>
              CAMPUS SETUP // VISAT ENGINEERING COLLEGE
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#ffffff', fontWeight: 800, marginTop: '8px' }}>
              Everything you need to build, on-site
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1rem', marginTop: '6px' }}>
              Bring a laptop and an idea — the rest is set up for you.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
            {infrastructure.map((infra, idx) => (
              <div
                key={idx}
                style={{
                  background: '#0b0b0e',
                  border: '1px solid #1f1f28',
                  padding: 'clamp(14px, 3.5vw, 20px)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{ padding: '8px', background: '#16161d', borderRadius: '4px', flexShrink: 0 }}>
                  {infra.icon}
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                    {infra.title}
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    {infra.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
