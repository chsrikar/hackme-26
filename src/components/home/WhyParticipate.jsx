import { Rocket, Users, Trophy, Flame } from 'lucide-react';
import PixelButton from '../common/PixelButton';

export default function WhyParticipate() {
  const reasons = [
    {
      title: "Build something real in 24 hours, not a semester",
      desc: "Cut through bureaucracy and theoretical coursework. Prototype, build, and ship a functional product in one weekend.",
      icon: <Rocket size={24} color="var(--color-overmind-orange)" />,
      color: "var(--color-overmind-orange)"
    },
    {
      title: "Meet people from other departments and colleges who build the way you do",
      desc: "Connect with like-minded coders, hardware makers, and designers from across universities who share your drive.",
      icon: <Users size={24} color="#38bdf8" />,
      color: "#38bdf8"
    },
    {
      title: "Win a cash prize and get your work in front of judges who matter",
      desc: "Showcase your codebase and live demo directly to experienced technical evaluators and claim the 1st place cash award.",
      icon: <Trophy size={24} color="#fbbf24" />,
      color: "#fbbf24"
    },
    {
      title: "End the grind with a campfire, not a deadline",
      desc: "Celebrate the 24 hours of hacking with great food, good music, friends, and late-night stories around the fire.",
      icon: <Flame size={24} color="#00ff80" />,
      color: "#00ff80"
    }
  ];

  return (
    <section className="page-container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="pixel-tag" style={{ color: 'var(--color-overmind-orange)', borderColor: 'rgba(242, 98, 7, 0.4)', background: '#1c140e' }}>
          THE BUILDER EXPERIENCE // VALUE
        </span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', color: '#ffffff', fontWeight: 800, marginTop: '10px' }}>
          Why Participate
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Four reasons to step into the HACK 26 arena this September.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
        {reasons.map((r, idx) => (
          <div
            key={idx}
            className="clip-pixel-corners"
            style={{
              background: '#0d0d12',
              border: '1px solid #22222c',
              padding: 'clamp(18px, 4vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 150ms ease, transform 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = r.color;
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#22222c';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{ padding: '8px', background: '#171720', borderRadius: '4px', width: 'fit-content', marginBottom: '16px' }}>
                {r.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, marginBottom: '10px' }}>
                {r.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {r.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
