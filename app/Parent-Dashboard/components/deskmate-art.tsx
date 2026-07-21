'use client'

// Hand-built SVG "product previews" for the Worlderly DeskMate — styled like
// clean product photography so the store works with no external image assets.

export type DeskMateVariant = 'device' | 'scene' | 'features' | 'detail'

export function DeskMateImage({ variant, className }: { variant: DeskMateVariant; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <linearGradient id="dm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#eef2f7" />
        </linearGradient>
        <linearGradient id="dm-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="dm-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#dm-bg)" />

      {variant === 'device' && <Device />}
      {variant === 'scene' && <Scene />}
      {variant === 'features' && <Features />}
      {variant === 'detail' && <Detail />}
    </svg>
  )
}

/** Overhead scanner arm capturing a document next to a laptop. */
function Device() {
  return (
    <g>
      {/* soft shadow */}
      <ellipse cx="200" cy="252" rx="150" ry="16" fill="#0f172a" opacity="0.06" />
      {/* laptop */}
      <g>
        <rect x="238" y="150" width="118" height="74" rx="6" fill="#1e293b" />
        <rect x="245" y="157" width="104" height="60" rx="3" fill="#fff7ed" />
        <rect x="252" y="165" width="90" height="6" rx="3" fill="#fdba74" />
        <rect x="252" y="177" width="70" height="4" rx="2" fill="#e2e8f0" />
        <rect x="252" y="186" width="82" height="4" rx="2" fill="#e2e8f0" />
        <rect x="252" y="195" width="60" height="4" rx="2" fill="#e2e8f0" />
        <path d="M228 224 h140 l10 12 H218 z" fill="#cbd5e1" />
      </g>
      {/* scanner base */}
      <rect x="66" y="212" width="70" height="14" rx="4" fill="url(#dm-metal)" />
      {/* vertical post */}
      <rect x="96" y="120" width="12" height="96" rx="5" fill="url(#dm-metal)" />
      {/* pivot */}
      <circle cx="102" cy="122" r="10" fill="#475569" />
      {/* arm */}
      <rect x="100" y="112" width="96" height="12" rx="6" fill="url(#dm-metal)" />
      {/* scan head */}
      <rect x="182" y="106" width="26" height="22" rx="6" fill="#1e293b" />
      <circle cx="195" cy="117" r="5" fill="#fb923c" />
      {/* light cone */}
      <path d="M195 128 L150 208 L232 208 Z" fill="#fde68a" opacity="0.35" />
      {/* document / mat */}
      <rect x="126" y="206" width="122" height="40" rx="4" fill="#ffffff" stroke="#e2e8f0" />
      <rect x="136" y="214" width="60" height="4" rx="2" fill="#94a3b8" />
      <rect x="136" y="223" width="90" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="136" y="231" width="76" height="3" rx="1.5" fill="#cbd5e1" />
      {/* wordmark */}
      <text x="200" y="288" textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155" fontFamily="system-ui">
        Worlderly DeskMate
      </text>
    </g>
  )
}

/** Child at a desk during a live class using the DeskMate. */
function Scene() {
  return (
    <g>
      {/* window */}
      <rect x="24" y="24" width="150" height="120" rx="8" fill="#dbeafe" />
      <rect x="24" y="24" width="150" height="120" rx="8" fill="none" stroke="#bfdbfe" strokeWidth="3" />
      <line x1="99" y1="24" x2="99" y2="144" stroke="#bfdbfe" strokeWidth="3" />
      <line x1="24" y1="84" x2="174" y2="84" stroke="#bfdbfe" strokeWidth="3" />
      <circle cx="150" cy="55" r="14" fill="#fde68a" opacity="0.7" />
      {/* desk */}
      <rect x="0" y="232" width="400" height="68" fill="#7c5b43" />
      <rect x="0" y="232" width="400" height="8" fill="#8a6a50" />
      {/* laptop */}
      <rect x="40" y="168" width="120" height="70" rx="5" fill="#1e293b" />
      <rect x="46" y="174" width="108" height="52" rx="3" fill="#0f172a" />
      <rect x="54" y="182" width="52" height="36" rx="3" fill="url(#dm-screen)" />
      <rect x="112" y="182" width="34" height="17" rx="3" fill="#334155" />
      <rect x="112" y="203" width="34" height="15" rx="3" fill="#334155" />
      {/* scanner */}
      <rect x="214" y="220" width="48" height="12" rx="4" fill="url(#dm-metal)" />
      <rect x="234" y="150" width="9" height="72" rx="4" fill="url(#dm-metal)" />
      <rect x="236" y="144" width="70" height="10" rx="5" fill="url(#dm-metal)" />
      <rect x="292" y="140" width="20" height="17" rx="5" fill="#1e293b" />
      <path d="M300 157 L268 220 L332 220 Z" fill="#fde68a" opacity="0.3" />
      {/* worksheet */}
      <rect x="256" y="216" width="96" height="22" rx="3" fill="#ffffff" stroke="#e2e8f0" />
      {/* child (simplified) */}
      <circle cx="336" cy="150" r="26" fill="#c2410c" />
      <path d="M300 244 q36 -70 72 0 z" fill="#0f766e" />
      <circle cx="336" cy="150" r="26" fill="none" stroke="#9a3412" strokeWidth="2" />
    </g>
  )
}

/** Feature callout board (from the poster). */
function Features() {
  const rows = [
    { t: '2MP HD Imaging', s: '1600×1200 CMOS sensor' },
    { t: 'A4 Capture', s: 'Documents, maps & books' },
    { t: 'USB Powered', s: '5V — no external supply' },
    { t: '1 Year Warranty', s: 'Guaranteed protection' },
  ]
  return (
    <g fontFamily="system-ui">
      <text x="28" y="44" fontSize="16" fontWeight="800" fill="#1e293b">
        Why DeskMate?
      </text>
      {rows.map((r, i) => {
        const y = 68 + i * 54
        return (
          <g key={r.t}>
            <rect x="24" y={y} width="352" height="44" rx="10" fill="#ffffff" stroke="#e2e8f0" />
            <circle cx="48" cy={y + 22} r="12" fill="#ffedd5" />
            <circle cx="48" cy={y + 22} r="5" fill="#f97316" />
            <text x="72" y={y + 19} fontSize="13" fontWeight="700" fill="#1e293b">
              {r.t}
            </text>
            <text x="72" y={y + 34} fontSize="10.5" fill="#64748b">
              {r.s}
            </text>
          </g>
        )
      })}
    </g>
  )
}

/** Warranty / in-box detail badge. */
function Detail() {
  return (
    <g fontFamily="system-ui">
      <circle cx="200" cy="128" r="66" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx="200" cy="128" r="52" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="6 5" />
      <text x="200" y="118" textAnchor="middle" fontSize="34" fontWeight="900" fill="#f97316">
        1
      </text>
      <text x="200" y="146" textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
        YEAR
      </text>
      <text x="200" y="230" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e293b">
        Warranty included
      </text>
      <text x="200" y="252" textAnchor="middle" fontSize="11" fill="#64748b">
        Scanner · USB cable · scanning mat · guide
      </text>
    </g>
  )
}
