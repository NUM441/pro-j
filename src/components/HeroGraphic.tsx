export default function HeroGraphic() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="210" r="150" fill="url(#hero-glow)" />

      {/* steam */}
      <g fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.75">
        <path d="M150,110 C140,95 160,85 150,70 C140,55 160,45 152,32" />
        <path d="M200,105 C190,90 210,80 200,65 C190,50 210,40 202,27" />
        <path d="M250,110 C240,95 260,85 250,70 C240,55 260,45 252,32" />
      </g>

      {/* chopsticks */}
      <g transform="rotate(28 300 150)">
        <rect x="292" y="90" width="9" height="130" rx="4.5" fill="#b97a4a" />
        <rect x="308" y="90" width="9" height="130" rx="4.5" fill="#c78a58" />
      </g>

      {/* bowl body */}
      <path
        d="M75,195 C75,195 90,320 200,320 C310,320 325,195 325,195 Z"
        fill="#ffffff"
      />
      <path
        d="M75,195 C75,195 90,320 200,320 C310,320 325,195 325,195 Z"
        fill="none"
        stroke="#e7674f"
        strokeWidth="6"
      />
      {/* bowl base */}
      <ellipse cx="200" cy="322" rx="46" ry="10" fill="#e7674f" opacity="0.9" />

      {/* soup / noodle surface */}
      <ellipse cx="200" cy="196" rx="128" ry="34" fill="#f4c463" />
      <ellipse cx="200" cy="193" rx="128" ry="30" fill="#f7d488" />

      {/* noodles */}
      <g fill="none" stroke="#e0aa57" strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <path d="M110,195 q15,-14 30,0 q15,14 30,0 q15,-14 30,0" />
        <path d="M210,200 q15,-14 30,0 q15,14 30,0" />
      </g>

      {/* green onion flecks */}
      <ellipse cx="150" cy="180" rx="7" ry="4" fill="#6fbf73" transform="rotate(20 150 180)" />
      <ellipse cx="245" cy="184" rx="7" ry="4" fill="#6fbf73" transform="rotate(-15 245 184)" />
      <ellipse cx="200" cy="170" rx="7" ry="4" fill="#7fcf82" transform="rotate(50 200 170)" />

      {/* fried egg */}
      <ellipse cx="255" cy="205" rx="28" ry="19" fill="#ffffff" />
      <circle cx="258" cy="205" r="11" fill="#f7b23b" />

      {/* cute face on the bowl */}
      <circle cx="172" cy="255" r="7" fill="#3f3a36" />
      <circle cx="228" cy="255" r="7" fill="#3f3a36" />
      <circle cx="164" cy="270" r="10" fill="#f4a0a0" opacity="0.7" />
      <circle cx="236" cy="270" r="10" fill="#f4a0a0" opacity="0.7" />
      <path
        d="M180,270 Q200,286 220,270"
        fill="none"
        stroke="#3f3a36"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
