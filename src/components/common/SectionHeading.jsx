/**
 * Reusable section heading with eyebrow tag, main title, and subtitle
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  className = ''
}) {
  return (
    <div className={`section-heading-wrap ${align === 'left' ? 'left-align' : ''} ${className}`}>
      {eyebrow && <span className="section-eyebrow">// {eyebrow}</span>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
