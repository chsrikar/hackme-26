/**
 * Standard page wrapper ensuring uniform padding, semantic main tag, and layout structure
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`page-wrapper ${className}`} style={{ minHeight: 'calc(100vh - var(--nav-height) - 300px)', paddingTop: 'var(--nav-height)' }}>
      {children}
    </main>
  );
}
