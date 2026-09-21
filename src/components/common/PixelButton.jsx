import { Link } from 'react-router-dom';

export default function PixelButton({
  children,
  to,
  href,
  onClick,
  variant = 'stone', // 'white' | 'copper' | 'stone' | 'phosphor'
  size = 'md',       // 'sm' | 'md' | 'lg'
  className = '',
  type = 'button',
  icon,
  ...props
}) {
  const variantStyles = {
    white: 'bg-core-white text-stone-900 font-bold hover:bg-neutral-200',
    copper: 'bg-copper-500 text-white font-bold hover:bg-copper-400',
    orange: 'bg-orange-500 text-white font-bold hover:bg-orange-400',
    stone: 'bg-stone-800 text-stone-100 hover:bg-stone-700',
    phosphor: 'bg-emerald-500 text-stone-950 font-bold hover:bg-emerald-400'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const styleObj = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 120ms ease, background-color 150ms ease, box-shadow 150ms ease',
    userSelect: 'none',
    border: 'none'
  };

  const activeBg =
    variant === 'white' ? '#ffffff' :
    (variant === 'copper' || variant === 'orange') ? '#f26207' :
    variant === 'phosphor' ? '#00ff80' : '#292524';

  const activeColor =
    variant === 'white' ? '#0a0a0a' :
    (variant === 'copper' || variant === 'orange') ? '#ffffff' :
    variant === 'phosphor' ? '#0a0a0a' : '#f5f5f4';

  const inner = (
    <div
      className="clip-pixel-corners"
      style={{
        backgroundColor: activeBg,
        color: activeColor,
        padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '9px 20px',
        fontSize: size === 'sm' ? '0.78rem' : size === 'lg' ? '0.95rem' : '0.85rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 600,
        boxShadow: (variant === 'copper' || variant === 'orange') ? '0 0 16px rgba(242, 98, 7, 0.45)' : variant === 'phosphor' ? '0 0 16px rgba(0, 255, 128, 0.35)' : 'none'
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={styleObj} className={`pixel-btn-wrap ${className}`} {...props}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} style={styleObj} className={`pixel-btn-wrap ${className}`} target="_blank" rel="noopener noreferrer" {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} style={styleObj} className={`pixel-btn-wrap ${className}`} {...props}>
      {inner}
    </button>
  );
}
