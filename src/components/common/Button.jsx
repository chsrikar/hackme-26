import { Link } from 'react-router-dom';

/**
 * Universal Button component supporting links and buttons with distinct variants
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className = '',
  type = 'button',
  disabled = false,
  glow = false,
  ...props
}) {
  const baseClasses = `btn btn-${variant} btn-${size} ${glow ? 'btn-glow' : ''} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={props.target || '_blank'}
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
