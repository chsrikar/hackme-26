export default function OvermindEye({ size = 32, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Outer Pixel Eye Frame */}
      <path d="M12 2h8v2h-8V2zm-4 2h4v2H8V4zm16 0h4v2h-4V4zM4 6h4v2H4V6zm20 0h4v2h-4V6zM2 8h2v2H2V8zm26 0h2v2h-2V8zM0 10h2v12H0V10zm30 0h2v12h-2V10zM2 22h2v2H2v-2zm26 0h2v2h-2v-2zM4 24h4v2H4v-2zm20 0h4v2h-4v-2zM8 26h4v2H8v-2zm16 0h4v2h-4v-2zm-12 2h8v2h-8v-2z" />
      {/* Eye Iris & Pupil */}
      <rect x="10" y="10" width="12" height="12" fill={color} opacity="0.3" />
      <rect x="13" y="13" width="6" height="6" fill={color} />
      <rect x="14" y="14" width="2" height="2" fill="#000" />
      <rect x="12" y="8" width="8" height="2" fill={color} />
      <rect x="12" y="22" width="8" height="2" fill={color} />
    </svg>
  );
}
