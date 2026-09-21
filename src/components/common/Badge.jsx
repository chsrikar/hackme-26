/**
 * Badge component for tags, track categories, and status indicators
 */
export default function Badge({
  children,
  variant = 'cyan', // 'cyan' | 'purple' | 'emerald' | 'amber'
  className = ''
}) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
