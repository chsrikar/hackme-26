import { ChevronDown } from 'lucide-react';

export default function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="faq-question-btn"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-header-${item.id}`}
      >
        <span>{item.question}</span>
        <ChevronDown size={20} className="faq-icon-arrow" />
      </button>

      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          role="region"
          aria-labelledby={`faq-header-${item.id}`}
          className="faq-answer"
        >
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
}
