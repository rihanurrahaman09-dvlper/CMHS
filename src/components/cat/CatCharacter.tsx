import type { CatMood } from '../../context/CatCompanionContext';

interface CatCharacterProps {
  mood: CatMood;
  className?: string;
}

export function CatCharacter({ mood, className = 'w-16 h-16 sm:w-20 sm:h-20' }: CatCharacterProps) {
  const isCelebrating = mood === 'celebrating';
  const isWatchingEmail = mood === 'watching-email';
  const isWatchingPassword = mood === 'watching-password';
  const isHover = mood === 'hover';

  // Subtle pupil offset when user focuses email/password
  const pupilOffsetX = isWatchingEmail ? -1.5 : isWatchingPassword ? 1.5 : 0;
  const pupilOffsetY = isWatchingEmail || isWatchingPassword ? -0.8 : 0;

  // Gentle head tilt
  const headTransform = isWatchingEmail
    ? 'rotate(-3deg)'
    : isWatchingPassword
      ? 'rotate(3deg)'
      : isHover
        ? 'translateY(-1.5px)'
        : 'rotate(0deg)';

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none drop-shadow-md ${
        isCelebrating ? 'animate-cat-celebrate' : 'animate-cat-breathe'
      }`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="catBodyGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6D4C41" />
          <stop offset="65%" stopColor="#4E342E" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        <radialGradient id="catHeadGrad" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#795548" />
          <stop offset="60%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
        <radialGradient id="catEyeGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="55%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="50" cy="91" rx="26" ry="5" fill="#0F172A" fillOpacity="0.14" />

      {/* Animated tail */}
      <path
        d="M28 75 C14 73, 12 58, 22 54 C26 52, 29 56, 26 60 C21 65, 24 70, 31 71 Z"
        fill="#4E342E"
        className="animate-cat-tail"
      />

      {/* Chubby rounded body */}
      <ellipse cx="50" cy="70" rx="25" ry="20" fill="url(#catBodyGrad)" />

      {/* Soft chest highlight */}
      <ellipse cx="50" cy="73" rx="13" ry="11" fill="#8D6E63" fillOpacity="0.35" />

      {/* Rounded front paws */}
      <ellipse cx="38" cy="86" rx="7" ry="4.5" fill="#4E342E" />
      <ellipse cx="62" cy="86" rx="7" ry="4.5" fill="#4E342E" />
      <ellipse cx="38" cy="85.5" rx="4.5" ry="2.5" fill="#6D4C41" fillOpacity="0.5" />
      <ellipse cx="62" cy="85.5" rx="4.5" ry="2.5" fill="#6D4C41" fillOpacity="0.5" />

      {/* Head group with subtle tilt */}
      <g style={{ transform: headTransform, transformOrigin: '50px 44px', transition: 'transform 220ms ease' }}>
        {/* Left & Right Ears */}
        <path d="M26 35 L22 14 L40 24 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M74 35 L78 14 L60 24 Z" fill="#4E342E" stroke="#3E2723" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Inner ears */}
        <path d="M27 31 L25 19 L36 25 Z" fill="#D7CCC8" fillOpacity="0.45" />
        <path d="M73 31 L75 19 L64 25 Z" fill="#D7CCC8" fillOpacity="0.45" />

        {/* Chubby rounded head */}
        <ellipse cx="50" cy="43" rx="28" ry="23" fill="url(#catHeadGrad)" />

        {/* Subtle cheek blush */}
        <ellipse cx="31" cy="48" rx="4.5" ry="2.5" fill="#F48FB1" fillOpacity="0.25" />
        <ellipse cx="69" cy="48" rx="4.5" ry="2.5" fill="#F48FB1" fillOpacity="0.25" />

        {/* Large expressive golden/amber eyes with natural blinking */}
        <g className="animate-cat-blink">
          {/* Left eye */}
          <circle cx="38.5" cy="41" r="7.5" fill="url(#catEyeGrad)" />
          <circle cx={38.5 + pupilOffsetX} cy={41 + pupilOffsetY} r="4.2" fill="#1C1917" />
          <circle cx={36.8 + pupilOffsetX} cy={38.8 + pupilOffsetY} r="1.8" fill="#FFFFFF" />
          <circle cx={40.5 + pupilOffsetX} cy={42.8 + pupilOffsetY} r="0.9" fill="#FFFFFF" fillOpacity="0.85" />

          {/* Right eye */}
          <circle cx="61.5" cy="41" r="7.5" fill="url(#catEyeGrad)" />
          <circle cx={61.5 + pupilOffsetX} cy={41 + pupilOffsetY} r="4.2" fill="#1C1917" />
          <circle cx={59.8 + pupilOffsetX} cy={38.8 + pupilOffsetY} r="1.8" fill="#FFFFFF" />
          <circle cx={63.5 + pupilOffsetX} cy={42.8 + pupilOffsetY} r="0.9" fill="#FFFFFF" fillOpacity="0.85" />
        </g>

        {/* Small nose */}
        <path d="M47.5 47.5 Q50 46 52.5 47.5 L50 50.5 Z" fill="#F48FB1" />

        {/* Friendly mouth */}
        <path
          d="M45.5 52 Q48 54.5 50 51.5 Q52 54.5 54.5 52"
          stroke="#271815"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Whiskers */}
        <line x1="20" y1="45" x2="28" y2="46.5" stroke="#8D6E63" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="19" y1="50" x2="28" y2="49.5" stroke="#8D6E63" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="80" y1="45" x2="72" y2="46.5" stroke="#8D6E63" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="81" y1="50" x2="72" y2="49.5" stroke="#8D6E63" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
      </g>
    </svg>
  );
}
