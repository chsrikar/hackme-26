export default function PixelBorderFrame({ children, className = '', style = {} }) {
  return (
    <div
      className={`pixel-frame-container ${className}`}
      style={{
        position: 'relative',
        padding: '24px',
        ...style
      }}
    >
      {/* Decorative Orange Pixel Pattern Frame (Exact signature from Overmind screenshot!) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 10px 10px, #f26207 2px, transparent 0),
            radial-gradient(circle at 25px 25px, #f97316 1.5px, transparent 0),
            radial-gradient(circle at 40px 15px, #ea580c 2px, transparent 0),
            radial-gradient(circle at 55px 35px, #c2410c 1px, transparent 0)
          `,
          backgroundSize: '70px 50px',
          opacity: 0.55,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 15%, transparent 85%, black 100%), linear-gradient(to right, black 0%, transparent 12%, transparent 88%, black 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 75%, black 100%)'
        }}
        aria-hidden="true"
      />

      {/* Outer Stepped Border Lines */}
      <div
        style={{
          position: 'absolute',
          inset: '8px',
          border: '1px dashed rgba(242, 98, 7, 0.55)',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Inner Content */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        {children}
      </div>
    </div>
  );
}
