import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, ArrowLeft, Users, FileCode, Clock, BookOpen, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import PixelButton from '../components/common/PixelButton';
import { faqs } from '../data/faqs';

export default function RulesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const rulesList = [
    {
      num: "01",
      title: "Team Formation & Eligibility",
      icon: <Users size={20} color="#38bdf8" />,
      tag: "COMPOSITION",
      points: [
        "Teams must consist of 2 to 4 registered participants.",
        "Cross-department, cross-college, and cross-year teams are fully permitted and strongly encouraged.",
        "Individual solo hackers can form teams during the Day 1 morning mixer and room allocation phase."
      ]
    },
    {
      num: "02",
      title: "Fresh Code & Originality",
      icon: <FileCode size={20} color="#00ff80" />,
      tag: "INTEGRITY",
      points: [
        "All project code, schemas, and configurations must be written during the official 36-hour hackathon timeframe.",
        "Open-source libraries, public packages (npm, pip, cargo), and pre-trained open model weights (e.g. Llama, Mistral) are allowed.",
        "Pre-existing private projects or commercial IP are strictly prohibited and will result in disqualification."
      ]
    },
    {
      num: "03",
      title: "AI & Modern Toolchain Policy",
      icon: <CheckCircle2 size={20} color="var(--color-overmind-orange)" />,
      tag: "PERMITTED",
      points: [
        "The use of AI coding assistants (GitHub Copilot, Cursor, Claude, ChatGPT) is permitted and welcomed.",
        "Teams must disclose their core AI workflow during project presentation.",
        "Judges evaluate architectural novelty, toolchain synthesis, and working domain execution, not simple prompt generation."
      ]
    },
    {
      num: "04",
      title: "Strict Submission Deadlines",
      icon: <Clock size={20} color="#f43f5e" />,
      tag: "HARD DEADLINE",
      points: [
        "The submission portal locks strictly at 9:00 AM on Day 2.",
        "Submissions must include: Public GitHub repository with README, a 2-3 minute demo video or live URL, and a 5-slide pitch deck.",
        "No commits after 9:00 AM will be evaluated by the jury."
      ]
    },
    {
      num: "05",
      title: "Hardware & Campus Lab Guidelines",
      icon: <AlertTriangle size={20} color="#fbbf24" />,
      tag: "FACILITY",
      points: [
        "Teams utilizing campus IoT benches and Turing lab GPU pods must follow lab safety protocols.",
        "All borrowed microcontrollers, sensor kits, and oscilloscope stations must be checked back in before the closing ceremony.",
        "High-speed wired and wireless network infrastructure is monitored for defensive security exercises only."
      ]
    },
    {
      num: "06",
      title: "Code of Conduct & Community Ethics",
      icon: <Shield size={20} color="#a855f7" />,
      tag: "CONDUCT",
      points: [
        "HACKME'26 is committed to providing a safe, inclusive, and harassment-free environment for all participants.",
        "Plagiarism, offensive language, or malicious targeting of campus infrastructure will result in immediate removal.",
        "Mentors and volunteer organizers are available 24/7 to support safety and mediation."
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#070708', minHeight: '100vh', color: '#f5f5f4', paddingTop: '40px', paddingBottom: '90px' }}>
      <div className="page-container">
        {/* Back breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#9ca3af',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} /> // HOME TERMINAL
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              className="pixel-tag"
              style={{
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.4)',
                background: '#0d1a24'
              }}
            >
              OPERATING PROTOCOL // HACKATHON RULES
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
            Rules & Operational Guidelines
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
            Every builder is expected to adhere to our core principles of engineering integrity, transparency, and collaborative rigor.
          </p>
        </div>

        {/* Rules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {rulesList.map((rule, idx) => (
            <div
              key={idx}
              className="clip-pixel-corners"
              style={{
                background: '#0f0f13',
                border: '1px solid #23232c',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px', background: '#181822', borderRadius: '4px' }}>
                      {rule.icon}
                    </div>
                    <span className="font-pixel" style={{ color: 'var(--color-overmind-orange)', fontSize: '0.9rem' }}>
                      RULE {rule.num}
                    </span>
                  </div>
                  <span
                    className="pixel-tag"
                    style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      background: '#13131a',
                      borderColor: '#2d2d38',
                      color: '#a1a1aa'
                    }}
                  >
                    {rule.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
                  {rule.title}
                </h3>

                <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {rule.points.map((pt, pIdx) => (
                    <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--color-overmind-orange)', flexShrink: 0 }}>•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs Accordion Section */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#38bdf8', letterSpacing: '0.06em', marginBottom: '18px' }}>
            // FREQUENTLY ASKED CLARIFICATIONS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="clip-pixel-corners"
                  style={{
                    background: '#0d0d12',
                    border: '1px solid #202028',
                    padding: '16px 20px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.98rem' }}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      color="#9ca3af"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 150ms ease'
                      }}
                    />
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.6, borderTop: '1px dashed #282834', paddingTop: '10px' }}>
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner */}
        <div
          className="clip-pixel-corners"
          style={{
            background: '#111116',
            border: '1px solid #282836',
            padding: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              Ready to submit your application?
            </h4>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
              Registrations close prior to Day 1 inaugural ceremony. Confirm your team slot now.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <PixelButton href="https://forms.gle/Z1KZCfkG4Jqq4eqj9" variant="orange" size="md" target="_blank" rel="noopener noreferrer">
              Register Your Team
            </PixelButton>
            <PixelButton to="/schedule" variant="stone" size="md">
              View Schedule
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}
