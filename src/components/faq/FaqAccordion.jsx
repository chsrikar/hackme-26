import { useState } from 'react';
import FaqItem from './FaqItem';
import { faqs } from '../../data/faqs';

export default function FaqAccordion({ limit }) {
  // Open the first FAQ by default
  const [openId, setOpenId] = useState('faq-eligibility');

  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faq-container" role="region" aria-label="Frequently Asked Questions Accordion">
      {displayedFaqs.map((faq) => (
        <FaqItem
          key={faq.id}
          item={faq}
          isOpen={openId === faq.id}
          onToggle={() => handleToggle(faq.id)}
        />
      ))}
    </div>
  );
}
