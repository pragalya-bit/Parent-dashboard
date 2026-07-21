// A cute chibi astronaut — white helmet, golden reflective visor, blue accents —
// used as the student character across the dashboard. Pure SVG, no assets.
export function AstronautAvatar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="You">
      <defs>
        <radialGradient id="astroBg" cx="50%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#4663b0" />
          <stop offset="100%" stopColor="#1d2b58" />
        </radialGradient>
        <linearGradient id="astroSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe4f1" />
        </linearGradient>
        <linearGradient id="astroVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd980" />
          <stop offset="55%" stopColor="#f0b347" />
          <stop offset="100%" stopColor="#cf8f2a" />
        </linearGradient>
      </defs>

      {/* space background */}
      <rect width="100" height="100" fill="url(#astroBg)" />
      <circle cx="22" cy="24" r="1.6" fill="#fff" opacity="0.8" />
      <circle cx="80" cy="20" r="1.2" fill="#fff" opacity="0.7" />
      <circle cx="86" cy="60" r="1.3" fill="#fff" opacity="0.6" />
      <circle cx="16" cy="64" r="1.1" fill="#fff" opacity="0.6" />

      {/* antenna */}
      <line x1="50" y1="16" x2="50" y2="26" stroke="#c6d2e8" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="50" cy="14" r="3.2" fill="#ff7a59" />

      {/* helmet */}
      <circle cx="50" cy="52" r="33" fill="url(#astroSuit)" />
      <circle cx="50" cy="52" r="33" fill="none" stroke="#c3cee2" strokeWidth="2" />
      {/* side ear pods */}
      <circle cx="17" cy="54" r="7" fill="#8fc0e6" stroke="#ffffff" strokeWidth="2" />
      <circle cx="83" cy="54" r="7" fill="#8fc0e6" stroke="#ffffff" strokeWidth="2" />

      {/* golden visor */}
      <rect x="28" y="38" width="44" height="34" rx="16" fill="url(#astroVisor)" stroke="#ffffff" strokeWidth="2.5" />
      {/* visor reflections */}
      <ellipse cx="41" cy="48" rx="6" ry="3.6" fill="#ffffff" opacity="0.55" />
      <ellipse cx="60" cy="62" rx="4" ry="2.6" fill="#ffffff" opacity="0.3" />

      {/* chest collar peeking at the bottom */}
      <path d="M 28 84 Q 50 74 72 84 L 72 100 L 28 100 Z" fill="url(#astroSuit)" />
      <circle cx="50" cy="88" r="2.6" fill="#7fb2d9" />
    </svg>
  )
}
