import { useState } from 'react';
import { faqs } from '../data/faqs';
import { Plus, Minus } from 'lucide-react';

export default function FaqPage() {
  const [openId, setOpenId] = useState('faq-eligibility');

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="denmu-section-header">
        <div>
          <span className="mono-tag" style={{ color: 'var(--color-accent)', display: 'block', marginBottom: '8px' }}>
            // PROTOCOL RULES & INFORMATION
          </span>
          <h1 className="denmu-section-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
        </div>
        <span className="mono-tag">8 PROTOCOLS</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        {faqs.map((item, idx) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                padding: '24px 0',
                cursor: 'pointer'
              }}
              onClick={() => toggle(item.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>0{idx + 1}.</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
                    {item.question}
                  </h3>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '16px 0 8px 40px' }}>
                  <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
