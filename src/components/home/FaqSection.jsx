import { useState } from 'react';
import { faqs } from '../../data/faqs';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="page-container" style={{ padding: '60px 0' }} id="faq-section">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="pixel-tag" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', background: '#0e1822' }}>
          FREQUENTLY ASKED QUESTIONS // FAQ
        </span>
        <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.8rem)', color: '#ffffff', fontWeight: 800, marginTop: '10px' }}>
          Answers to Common Questions
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '580px', margin: '8px auto 0 auto' }}>
          Everything you need to know about team registration, venue logistics, and participation.
        </p>
      </div>

      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.id}
              className="clip-pixel-corners"
              style={{
                background: '#0d0d12',
                border: '1px solid #202028',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'border-color 150ms ease'
              }}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  {item.question}
                </h3>
                <ChevronDown
                  size={18}
                  color={isOpen ? 'var(--color-overmind-orange)' : '#9ca3af'}
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 150ms ease',
                    flexShrink: 0
                  }}
                />
              </div>

              {isOpen && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #22222e' }}>
                  <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
