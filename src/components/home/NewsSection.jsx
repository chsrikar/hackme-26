import { newsItems } from '../../data/news';
import { ArrowUpRight } from 'lucide-react';

export default function NewsSection() {
  return (
    <section className="container" style={{ paddingBottom: 'var(--space-4xl)' }} id="news-section">
      <div className="denmu-section-header">
        <h2 className="denmu-section-title">DISPATCHES & PRESS</h2>
        <span className="mono-tag">// LATEST UPDATES</span>
      </div>

      <div className="denmu-news-list">
        {newsItems.map((item, idx) => (
          <div key={idx} className="denmu-news-row">
            <span className="denmu-news-date">{item.date}</span>
            <span className="denmu-news-source">{item.source}</span>
            <div className="denmu-news-headline">{item.title}</div>
            <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
