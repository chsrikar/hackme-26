import { useState, useEffect, useRef } from 'react';

/**
 * WebPet - Retro Animated Desktop / Navbar Companion
 * 
 * Props:
 *  - animal: "crab" (default)
 *  - color: string (e.g. "red", "#ef4444")
 *  - speed: number (e.g. 3.4)
 *  - scale: number (e.g. 0.5)
 */
export function WebPet({
  animal = 'crab',
  color = 'red',
  speed = 3.4,
  scale = 0.5,
  className = '',
  style = {}
}) {
  const [posX, setPosX] = useState(20); // percentage 0 - 100
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [legFrame, setLegFrame] = useState(0);
  const [clawSnip, setClawSnip] = useState(false);
  const [bubbleText, setBubbleText] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const containerRef = useRef(null);

  // Map color names to hex codes
  const primaryColor =
    color === 'red' ? '#ef4444' :
    color === 'orange' ? '#f26207' :
    color === 'cyan' ? '#06b6d4' :
    color === 'green' ? '#10b981' :
    color === 'purple' ? '#a855f7' :
    color || '#ef4444';

  const darkColor =
    color === 'red' ? '#991b1b' :
    color === 'orange' ? '#9a3412' :
    '#1e293b';

  const lightColor =
    color === 'red' ? '#fca5a5' :
    color === 'orange' ? '#fdba74' :
    '#ffffff';

  const quotes = [
    "🦀 snip snip!",
    "hack or snack?",
    "🦀 36h sprint!",
    "Ferris approved!",
    "bug pinched!",
    "🦀 *scuttle scuttle*"
  ];

  // Walking loop along parent navbar
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const move = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setPosX((prev) => {
        const step = (speed * 4.5) * delta * direction;
        let next = prev + step;

        // Bounce at boundaries (5% to 92%)
        if (next >= 92) {
          next = 92;
          setDirection(-1);
        } else if (next <= 5) {
          next = 5;
          setDirection(1);
        }
        return next;
      });

      // Leg scuttling cycle
      setLegFrame((f) => (f + 1) % 4);

      animId = requestAnimationFrame(move);
    };

    animId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animId);
  }, [speed, direction]);

  // Periodic random eye blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setClawSnip(true);
    setTimeout(() => setClawSnip(false), 600);

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setBubbleText(randomQuote);
    setTimeout(() => setBubbleText(null), 2500);
  };

  // Leg positions based on animation frame
  const legOffsetLeft = legFrame === 0 || legFrame === 2 ? 2 : -2;
  const legOffsetRight = legFrame === 1 || legFrame === 3 ? 2 : -2;

  return (
    <div
      ref={containerRef}
      className={`web-pet-wrapper ${className}`}
      onClick={handleClick}
      title="HACKME'26 WebPet • Click me to interact!"
      style={{
        position: 'absolute',
        left: `${posX}%`,
        top: '-14px',
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        zIndex: 1005,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'left 80ms linear',
        ...style
      }}
    >
      {/* Speech Bubble */}
      {bubbleText && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-6px)',
            background: '#090a0f',
            border: '2px solid #f26207',
            padding: '3px 8px',
            color: '#ffffff',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
            imageRendering: 'pixelated'
          }}
        >
          {bubbleText}
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #f26207'
            }}
          />
        </div>
      )}

      {/* Retro Pixel Crab SVG Graphic */}
      <div
        style={{
          width: '64px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: direction === -1 ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'transform 100ms ease'
        }}
      >
        <svg
          width="64"
          height="48"
          viewBox="0 0 64 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Shadow beneath crab */}
          <ellipse cx="32" cy="42" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />

          {/* Left Walking Legs */}
          <g stroke={darkColor} strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="28" x2="6" y2={`${36 + legOffsetLeft}`} />
            <line x1="20" y1="32" x2="8" y2={`${40 - legOffsetLeft}`} />
            <line x1="22" y1="35" x2="12" y2={`${44 + legOffsetLeft}`} />
          </g>

          {/* Right Walking Legs */}
          <g stroke={darkColor} strokeWidth="3" strokeLinecap="round">
            <line x1="46" y1="28" x2="58" y2={`${36 + legOffsetRight}`} />
            <line x1="44" y1="32" x2="56" y2={`${40 - legOffsetRight}`} />
            <line x1="42" y1="35" x2="52" y2={`${44 + legOffsetRight}`} />
          </g>

          {/* Left Pincer Arm & Claw */}
          <g>
            <path
              d="M 20 25 Q 12 18 10 14"
              stroke={primaryColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Claw Pincers (Animated on click / snip) */}
            <g transform={clawSnip ? "rotate(-15 10 14)" : "rotate(0 10 14)"}>
              {/* Upper Claw Pincer */}
              <path
                d="M 10 14 C 6 10 2 10 2 15 C 2 17 6 17 10 15 Z"
                fill={primaryColor}
                stroke={darkColor}
                strokeWidth="1.2"
              />
              {/* Lower Claw Pincer */}
              <path
                d="M 10 15 C 6 20 1 18 1 13 C 1 12 6 13 10 14 Z"
                fill={primaryColor}
                stroke={darkColor}
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* Right Pincer Arm & Claw */}
          <g>
            <path
              d="M 44 25 Q 52 18 54 14"
              stroke={primaryColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Claw Pincers (Animated on click / snip) */}
            <g transform={clawSnip ? "rotate(15 54 14)" : "rotate(0 54 14)"}>
              {/* Upper Claw Pincer */}
              <path
                d="M 54 14 C 58 10 62 10 62 15 C 62 17 58 17 54 15 Z"
                fill={primaryColor}
                stroke={darkColor}
                strokeWidth="1.2"
              />
              {/* Lower Claw Pincer */}
              <path
                d="M 54 15 C 58 20 63 18 63 13 C 63 12 58 13 54 14 Z"
                fill={primaryColor}
                stroke={darkColor}
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* Main Carapace / Shell */}
          <ellipse
            cx="32"
            cy="28"
            rx="16"
            ry="11"
            fill={primaryColor}
            stroke={darkColor}
            strokeWidth="1.8"
          />

          {/* Shell Pattern / Ridges */}
          <path
            d="M 22 26 Q 32 30 42 26"
            stroke={darkColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 25 31 Q 32 34 39 31"
            stroke={darkColor}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Shell Highlight */}
          <ellipse cx="28" cy="23" rx="7" ry="2.5" fill={lightColor} opacity="0.65" />

          {/* Left Eye Stalk & Eye */}
          <line x1="26" y1="20" x2="26" y2="12" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="11" r="4.5" fill="#ffffff" stroke={darkColor} strokeWidth="1.2" />
          {!isBlinking && (
            <circle cx={direction === 1 ? "27.5" : "24.5"} cy="11" r="2" fill="#000000" />
          )}
          {isBlinking && (
            <line x1="23" y1="11" x2="29" y2="11" stroke="#000" strokeWidth="1.5" />
          )}

          {/* Right Eye Stalk & Eye */}
          <line x1="38" y1="20" x2="38" y2="12" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="38" cy="11" r="4.5" fill="#ffffff" stroke={darkColor} strokeWidth="1.2" />
          {!isBlinking && (
            <circle cx={direction === 1 ? "39.5" : "36.5"} cy="11" r="2" fill="#000000" />
          )}
          {isBlinking && (
            <line x1="35" y1="11" x2="41" y2="11" stroke="#000" strokeWidth="1.5" />
          )}

          {/* Cute Rosy Blushing Cheeks */}
          <circle cx="23" cy="29" r="2" fill="#f43f5e" opacity="0.75" />
          <circle cx="41" cy="29" r="2" fill="#f43f5e" opacity="0.75" />
        </svg>
      </div>
    </div>
  );
}

export default WebPet;
