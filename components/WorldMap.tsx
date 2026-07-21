'use client'

// Worlderly — "A World of Wonder."
// A golden-hour sky of floating islands. The UNIVERSE toggle picks the subject;
// each island is a CHAPTER of that subject, shown as a coloured mountain. The
// glowing current chapter is tappable; locked chapters stay nameless.

import { useState, type ReactNode } from 'react'

const W = 1700
const H = 900

interface WorldDef {
  id: string
  chapterNo: number
  x: number
  y: number
  w: number
  dur: string
  delay: string
  locked: boolean
}

const WORLDS: WorldDef[] = [
  { id: 'c1', chapterNo: 1, x: 410, y: 575, w: 130, dur: '7s', delay: '0s', locked: false },
  { id: 'c2', chapterNo: 2, x: 790, y: 360, w: 105, dur: '8s', delay: '1.2s', locked: true },
  { id: 'c3', chapterNo: 3, x: 1115, y: 580, w: 105, dur: '7.5s', delay: '0.6s', locked: true },
  { id: 'c4', chapterNo: 4, x: 1395, y: 330, w: 100, dur: '8.5s', delay: '1.8s', locked: true },
  { id: 'c5', chapterNo: 5, x: 1605, y: 565, w: 95, dur: '7.8s', delay: '0.3s', locked: true },
]

// Each subject gets its own mountain palette so Maths and Science worlds read
// differently at a glance — one pair (light face, shaded face) per chapter slot.
const PALETTES: Record<string, [string, string][]> = {
  Mathematics: [
    ['#8fa7d6', '#6f86b8'], // 1 indigo (current)
    ['#5fcbb0', '#3a9b86'], // 2 teal
    ['#f0a0be', '#cf6f92'], // 3 rose
    ['#e9c07a', '#c79553'], // 4 gold
    ['#b79bff', '#8a6cf0'], // 5 violet
  ],
  // Muted, realistic space-theme planet colours — dark blues, greys, off-whites
  Science: [
    ['#6d8fc0', '#33507e'], // 1 steel blue (current)
    ['#aab2c0', '#697181'], // 2 slate grey
    ['#ece7da', '#bbb4a6'], // 3 off-white
    ['#5878a8', '#2b4670'], // 4 deep navy blue
    ['#9aa9bd', '#5e6b80'], // 5 cool grey
  ],
}

// Universe = subject. Each universe is a set of chapter names.
const UNIVERSES: Record<string, { icon: string; chapters: string[] }> = {
  Mathematics: { icon: '➗', chapters: ['Algebra Basics', 'Linear Equations', 'Quadratics', 'Polynomials', 'Geometry'] },
  Science: { icon: '🔬', chapters: ['Matter', 'Forces & Motion', 'Energy', 'The Cell', 'Ecosystems'] },
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${
      p2.y - (p3.y - p1.y) / 6
    } ${p2.x},${p2.y}`
  }
  return d
}

const STARS: [number, number, number][] = [
  [120, 60, 1.6], [320, 110, 1.1], [520, 50, 1.4], [700, 130, 1], [905, 70, 1.6],
  [1090, 40, 1.1], [1230, 120, 1.4], [1430, 60, 1.1], [1560, 140, 1.6], [1660, 50, 1.1],
  [240, 180, 1], [820, 200, 1.2], [1300, 210, 1],
]

const FIREFLIES: [number, number][] = [
  [300, 470], [540, 640], [700, 480], [930, 300], [1010, 640], [1240, 470], [1480, 430], [1570, 680],
]

const Pine = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x="-2.5" y="2" width="5" height="9" fill="#4a2f1c" />
    <polygon points="0,-24 -12,4 12,4" fill="#2a6b4a" />
    <polygon points="0,-15 -10,8 10,8" fill="#347a55" />
  </g>
)

/** A simple coloured mountain for a locked chapter. */
function MtnPeaks({ a, b }: { a: string; b: string }) {
  return (
    <>
      <polygon points="-56,2 -14,-84 24,2" fill={b} />
      <path d="M -30,-56 L -14,-84 L 2,-56 L -6,-64 L -14,-55 L -22,-64 Z" fill="#f6f2ff" opacity="0.9" />
      <polygon points="-14,4 38,-114 86,4" fill={a} />
      <polygon points="38,-114 86,4 38,4" fill={b} opacity="0.5" />
      <path d="M 20,-78 L 38,-114 L 54,-78 L 46,-86 L 38,-76 L 30,-86 Z" fill="#ffffff" />
      <Pine x={-74} y={6} s={0.7} />
      <Pine x={74} y={8} s={0.6} />
    </>
  )
}

type BodyType = 'moon' | 'jupiter' | 'mars'

// each central planet is circled by 3 DIFFERENT bodies: a moon, a Jupiter, a Mars
const SATELLITES: { ang: number; size: number; type: BodyType }[] = [
  { ang: 0, size: 0.13, type: 'moon' },
  { ang: 128, size: 0.2, type: 'jupiter' },
  { ang: 236, size: 0.16, type: 'mars' },
]

/** A small, recognisable celestial body drawn at the origin with radius mr. */
function MiniBody({ type, mr }: { type: BodyType; mr: number }) {
  if (type === 'jupiter') {
    return (
      <>
        <circle r={mr} fill="#e2b078" />
        <ellipse cy={-mr * 0.42} rx={mr * 0.78} ry={mr * 0.15} fill="#c98f56" opacity="0.7" />
        <ellipse cy={mr * 0.02} rx={mr * 0.96} ry={mr * 0.16} fill="#b27a45" opacity="0.6" />
        <ellipse cy={mr * 0.44} rx={mr * 0.74} ry={mr * 0.13} fill="#cf9960" opacity="0.65" />
        <ellipse cx={mr * 0.36} cy={mr * 0.12} rx={mr * 0.18} ry={mr * 0.12} fill="#a8421f" opacity="0.85" />
        <ellipse cx={-mr * 0.3} cy={-mr * 0.32} rx={mr * 0.3} ry={mr * 0.18} fill="#ffffff" opacity="0.22" />
      </>
    )
  }
  if (type === 'mars') {
    return (
      <>
        <circle r={mr} fill="#c1542f" />
        <ellipse cy={-mr * 0.46} rx={mr * 0.5} ry={mr * 0.27} fill="#ffffff" opacity="0.75" />
        <circle cx={mr * 0.26} cy={mr * 0.22} r={mr * 0.22} fill="#9e3c1d" opacity="0.6" />
        <circle cx={-mr * 0.18} cy={mr * 0.05} r={mr * 0.12} fill="#9e3c1d" opacity="0.5" />
        <ellipse cx={-mr * 0.3} cy={-mr * 0.3} rx={mr * 0.26} ry={mr * 0.16} fill="#ffffff" opacity="0.2" />
      </>
    )
  }
  // moon
  return (
    <>
      <circle r={mr} fill="#cbc5dc" />
      <circle cx={-mr * 0.26} cy={-mr * 0.2} r={mr * 0.22} fill="#a9a2c1" opacity="0.6" />
      <circle cx={mr * 0.3} cy={mr * 0.26} r={mr * 0.16} fill="#a9a2c1" opacity="0.5" />
      <circle cx={mr * 0.08} cy={-mr * 0.4} r={mr * 0.1} fill="#a9a2c1" opacity="0.5" />
      <circle cx={-mr * 0.3} cy={-mr * 0.3} r={mr * 0.24} fill="#ffffff" opacity="0.22" />
    </>
  )
}

/** A chapter planet with 3 moons revolving around it — for Science (galaxy). */
function SpacePlanet({ d, name, colors }: { d: WorldDef; name: string; colors: [string, string] }) {
  const { x, y, w, locked, dur, delay, chapterNo } = d
  const [a, b] = colors
  const r = w * 0.66
  const orbitR = w * 1.05
  return (
    <g transform={`translate(${x},${y})`}>
      <g className="world-float" style={{ animationDuration: dur, animationDelay: delay }}>
        {/* atmosphere glow */}
        <circle r={r * 1.5} fill={a} opacity="0.16" filter="url(#blur10)" />
        {/* moon orbit */}
        <circle r={orbitR} fill="none" stroke={a} strokeWidth="1.4" opacity="0.3" strokeDasharray="2 9" />
        {/* central planet */}
        <circle r={r} fill={b} />
        <circle cx={-r * 0.16} cy={-r * 0.2} r={r * 0.84} fill={a} />
        <circle cx={-r * 0.34} cy={-r * 0.28} r={r * 0.13} fill={b} opacity="0.38" />
        <circle cx={r * 0.26} cy={r * 0.12} r={r * 0.1} fill={b} opacity="0.32" />
        <ellipse cx={-r * 0.36} cy={-r * 0.4} rx={r * 0.24} ry={r * 0.15} fill="#ffffff" opacity="0.3" />
        {/* 3 different bodies revolving the planet */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="28s" repeatCount="indefinite" />
          {SATELLITES.map(({ ang, size, type }, i) => {
            const rad = (ang * Math.PI) / 180
            const mx = orbitR * Math.cos(rad)
            const my = orbitR * Math.sin(rad)
            const mr = w * size
            return (
              <g key={i} transform={`translate(${mx},${my})`}>
                {/* keep each body upright as the system spins */}
                <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="-360 0 0" dur="28s" repeatCount="indefinite" additive="sum" />
                <MiniBody type={type} mr={mr} />
              </g>
            )
          })}
        </g>
        {locked && (
          <g transform={`translate(${r * 0.66},${-r * 0.72})`}>
            <circle r="15" fill="#0c0a20" opacity="0.85" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
            <rect x="-6" y="-2" width="12" height="9" rx="2" fill="#f4ede0" />
            <path d="M -4 -2 V -6 a 4 4 0 0 1 8 0 V -2" fill="none" stroke="#f4ede0" strokeWidth="2.2" />
          </g>
        )}
      </g>
      {!locked && (
        <>
          <text y={orbitR + 40} textAnchor="middle" fontSize="18" fontWeight={800} letterSpacing="2.5" fill="#ffffff">
            {name.toUpperCase()}
          </text>
          <text y={orbitR + 64} textAnchor="middle" fontSize="11" fontWeight={800} letterSpacing="4" fill="#c7b8ff">
            CHAPTER {chapterNo} · CURRENT
          </text>
        </>
      )}
    </g>
  )
}

/** A floating island; name shown only for the current (unlocked) chapter. */
function Island({ d, name, children }: { d: WorldDef; name: string; children: ReactNode }) {
  const { x, y, w, locked, dur, delay } = d
  const grass = locked ? 'url(#grassM)' : 'url(#grass)'
  const rock = locked ? 'url(#rockM)' : 'url(#rock)'
  return (
    <g transform={`translate(${x},${y})`}>
      <g className="world-float" style={{ animationDuration: dur, animationDelay: delay }}>
        <ellipse cy={w * 1.3} rx={w * 0.55} ry={13} fill="#0c0a20" opacity="0.4" filter="url(#blur10)" />
        <polygon points={`${-w * 0.42},${w * 0.78} ${-w * 0.32},${w * 0.7} ${-w * 0.3},${w * 0.95}`} fill="#3a2f55" />
        <polygon points={`${w * 0.34},${w * 0.66} ${w * 0.46},${w * 0.72} ${w * 0.4},${w * 0.92}`} fill="#322a4c" />
        <path
          d={`M ${-w},2 C ${-w * 0.82},${w * 0.5} ${-w * 0.4},${w * 0.85} 0,${w * 1.05} C ${w * 0.4},${w * 0.85} ${w * 0.82},${w * 0.5} ${w},2 Z`}
          fill={rock}
        />
        <path d={`M ${-w * 0.72},${w * 0.26} Q 0,${w * 0.5} ${w * 0.72},${w * 0.26}`} stroke="#241d3e" strokeWidth="2.5" fill="none" opacity="0.5" />
        <ellipse cy={5} rx={w} ry={w * 0.27} fill="#2f6b3f" />
        <ellipse rx={w} ry={w * 0.26} fill={grass} />
        <ellipse cy={-5} rx={w * 0.66} ry={w * 0.13} fill="#ffffff" opacity="0.14" />
        {children}
        {locked && (
          <g transform={`translate(${w * 0.62},${-w * 0.34})`}>
            <circle r="17" fill="#14112b" opacity="0.85" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
            <rect x="-6" y="-2" width="12" height="9" rx="2" fill="#f4ede0" />
            <path d="M -4 -2 V -6 a 4 4 0 0 1 8 0 V -2" fill="none" stroke="#f4ede0" strokeWidth="2.2" />
          </g>
        )}
      </g>
      {/* Only the current chapter is named */}
      {!locked && (
        <>
          <text y={w * 1.52} textAnchor="middle" fontSize="18" fontWeight={800} letterSpacing="2.5" fill="#ffffff">
            {name.toUpperCase()}
          </text>
          <text y={w * 1.52 + 24} textAnchor="middle" fontSize="11" fontWeight={800} letterSpacing="4" fill="#ffce8a">
            CHAPTER {d.chapterNo} · CURRENT
          </text>
        </>
      )}
    </g>
  )
}

export function WorldMap({ onEnter }: { onEnter: (subject: string) => void }) {
  const [universe, setUniverse] = useState('Mathematics')
  const chapters = UNIVERSES[universe].chapters
  const MTN = PALETTES[universe]
  const isSpace = universe === 'Science'
  const active = WORLDS[0]

  return (
    <section className="rounded-3xl shadow-xl relative overflow-hidden">
      {/* Universe (subject) toggle */}
      <div className="absolute z-20 top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[94%]">
        <span className="hidden md:inline text-[10px] font-black tracking-widest text-white/50 uppercase">Universe</span>
        <div className="flex items-center gap-1 bg-black/25 backdrop-blur-md border border-white/15 rounded-full p-1 overflow-x-auto">
          {Object.entries(UNIVERSES).map(([name, u]) => (
            <button
              key={name}
              type="button"
              onClick={() => setUniverse(name)}
              className={`shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                universe === name ? 'bg-orange-500 text-white shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>{u.icon}</span>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[820px]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161438" />
              <stop offset="38%" stopColor="#3d2a63" />
              <stop offset="68%" stopColor="#8e4a6e" />
              <stop offset="88%" stopColor="#e8855e" />
              <stop offset="100%" stopColor="#f7b267" />
            </linearGradient>
            <linearGradient id="skySpace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#070617" />
              <stop offset="45%" stopColor="#13123a" />
              <stop offset="100%" stopColor="#241a52" />
            </linearGradient>
            <radialGradient id="galaxyCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe9c7" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#c79bf0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#c79bf0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebulaA" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7c3ad0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3ad0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebulaB" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2f7c99" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2f7c99" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe3ae" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#ffb066" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8fd07f" />
              <stop offset="100%" stopColor="#47925a" />
            </linearGradient>
            <linearGradient id="grassM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7da487" />
              <stop offset="100%" stopColor="#46705c" />
            </linearGradient>
            <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#705f96" />
              <stop offset="100%" stopColor="#2c2348" />
            </linearGradient>
            <linearGradient id="rockM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5f567e" />
              <stop offset="100%" stopColor="#272040" />
            </linearGradient>
            <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfe9f2" />
              <stop offset="100%" stopColor="#5fb0d8" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="mtn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9b8cc4" />
              <stop offset="100%" stopColor="#4a3d70" />
            </linearGradient>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe9bd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffe9bd" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="vin" cx="50%" cy="46%" r="72%">
              <stop offset="62%" stopColor="#0a0820" stopOpacity="0" />
              <stop offset="100%" stopColor="#0a0820" stopOpacity="0.4" />
            </radialGradient>
            <filter id="blur6" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="blur10" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>

          {/* Sky / Space backdrop */}
          <rect width={W} height={H} fill={isSpace ? 'url(#skySpace)' : 'url(#sky)'} />
          {isSpace ? (
            <>
              {/* galaxy band + nebulae */}
              <ellipse cx={900} cy={250} rx={560} ry={170} fill="url(#galaxyCore)" className="journey-glow" transform="rotate(-12 900 250)" />
              <circle cx={380} cy={320} r={300} fill="url(#nebulaA)" className="journey-glow" />
              <circle cx={1280} cy={540} r={340} fill="url(#nebulaB)" className="journey-glow" style={{ animationDelay: '1.4s' }} />
              <circle cx={1620} cy={230} r={250} fill="url(#nebulaA)" className="journey-glow" style={{ animationDelay: '0.8s' }} />
            </>
          ) : (
            <>
              <circle cx={880} cy={920} r={430} fill="url(#sunGlow)" className="journey-glow" />
              <circle cx={880} cy={935} r={80} fill="#ffe9bd" opacity="0.9" filter="url(#blur6)" />
            </>
          )}
          {STARS.map(([sx, sy, r], i) => (
            <circle key={`s${i}`} cx={sx} cy={sy} r={r} fill="#fff" className="journey-twinkle" style={{ animationDelay: `${(i % 6) * 0.55}s` }} />
          ))}
          {/* extra dense starfield for space */}
          {isSpace &&
            ([[160, 420, 1.4], [520, 480, 1], [760, 560, 1.3], [1050, 200, 1], [1380, 380, 1.4], [1560, 600, 1], [300, 640, 1.2], [1180, 660, 1], [1480, 130, 1.3], [640, 320, 1], [900, 600, 1.2], [1680, 460, 1]] as const).map(
              ([sx, sy, r], i) => (
                <circle key={`sp${i}`} cx={sx} cy={sy} r={r} fill="#fff" className="journey-twinkle" style={{ animationDelay: `${(i % 5) * 0.6}s` }} />
              ),
            )}
          {/* a comet streaking across space */}
          {isSpace && (
            <g className="journey-bob" style={{ animationDuration: '8s' }}>
              <path d="M 1240,150 L 1130,210" stroke="#ffd9a0" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <circle cx={1244} cy={147} r={6} fill="#fff6dd" />
            </g>
          )}

          {!isSpace && (
            <>
              {/* distant silhouette islands */}
              <g opacity="0.35" fill="#241d44">
                <ellipse cx={210} cy={300} rx={70} ry={16} />
                <path d="M 140,302 C 160,340 190,355 210,362 C 230,355 260,340 280,302 Z" />
                <ellipse cx={1010} cy={770} rx={56} ry={13} />
                <path d="M 954,772 C 970,802 992,814 1010,820 C 1028,814 1050,802 1066,772 Z" />
              </g>
              {/* clouds */}
              {([[260, 220, 1.3, 0.16], [640, 120, 1, 0.13], [1180, 250, 1.5, 0.14], [1500, 170, 0.9, 0.12]] as const).map(([cx, cy, s, o], i) => (
                <g key={`c${i}`} transform={`translate(${cx},${cy}) scale(${s})`} opacity={o} className="journey-cloud" style={{ animationDelay: `${i * 1.4}s` }}>
                  <ellipse rx="60" ry="16" fill="#fff" />
                  <ellipse cx="42" cy="6" rx="38" ry="12" fill="#fff" />
                  <ellipse cx="-40" cy="7" rx="34" ry="11" fill="#fff" />
                </g>
              ))}
              {/* birds */}
              {([[1220, 180], [1262, 196], [1190, 206]] as const).map(([bx, by], i) => (
                <path key={`b${i}`} d={`M${bx},${by} q 9,-9 18,0 q 9,-9 18,0`} stroke="#1d1838" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
              ))}
              {/* light beam over the current chapter */}
              <polygon
                points={`${active.x - 95},0 ${active.x + 95},0 ${active.x + 38},${active.y - 130} ${active.x - 38},${active.y - 130}`}
                fill="url(#beam)"
                opacity="0.55"
                filter="url(#blur10)"
              />
            </>
          )}

          {/* luminous trail between chapters */}
          <path d={smoothPath(WORLDS)} stroke={isSpace ? '#9d8fe0' : '#ffb45e'} strokeWidth="14" strokeLinecap="round" opacity={isSpace ? 0.1 : 0.18} filter="url(#blur6)" fill="none" />
          <path d={smoothPath(WORLDS)} stroke={isSpace ? '#c7b8ff' : '#ffd9a0'} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1 17" opacity="0.9" fill="none" />

          {/* ===== Chapter islands ===== */}

          {/* 1 — current chapter (tap to enter the trek) */}
          <g
            className="map-node cursor-pointer"
            onClick={() => onEnter(universe)}
            role="button"
            tabIndex={0}
            aria-label={`Enter ${chapters[0]}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onEnter(universe)
            }}
          >
            <circle cx={active.x} cy={active.y} r={active.w} fill="none" stroke={isSpace ? '#c7b8ff' : '#ffd9a0'} strokeWidth="2.5" opacity="0.6">
              <animate attributeName="r" values={`${active.w};${active.w * 1.85};${active.w * 1.85}`} dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0" dur="2.6s" repeatCount="indefinite" />
            </circle>
            {isSpace ? (
              <>
                <SpacePlanet d={active} name={chapters[0]} colors={MTN[0]} />
                {/* tap pin floating above the planet system */}
                <g className="journey-bob" transform={`translate(${active.x},${active.y - active.w * 1.05 - 16})`}>
                  <path d="M 0,0 c 0,0 -24,-19 -24,-37 c 0,-14 10,-24 24,-24 c 14,0 24,10 24,24 c 0,18 -24,37 -24,37 Z" fill="#f97316" stroke="#fff" strokeWidth="3.5" />
                  <circle cx="0" cy="-37" r="9" fill="#fff" />
                </g>
              </>
            ) : (
              <Island d={active} name={chapters[0]}>
                <polygon points="-72,2 -16,-112 32,2" fill={MTN[0][0]} opacity="0.92" />
                <path d="M -32,-78 L -16,-112 L -1,-78 L -8,-85 L -16,-77 L -25,-85 Z" fill="#f6f2ff" />
                <polygon points="-16,4 46,-148 106,4" fill={MTN[0][0]} />
                <polygon points="46,-148 106,4 46,4" fill={MTN[0][1]} opacity="0.55" />
                <path d="M 27,-102 L 46,-148 L 64,-102 L 56,-111 L 46,-101 L 36,-111 Z" fill="#ffffff" />
                <line x1="46" y1="-148" x2="46" y2="-170" stroke="#f4ede0" strokeWidth="2.5" />
                <polygon points="46,-170 66,-163 46,-156" fill="#f97316" />
                <Pine x={-98} y={0} s={0.9} />
                <Pine x={-58} y={8} s={0.7} />
                <Pine x={88} y={10} s={0.7} />
                <path d="M 70,8 C 74,40 70,80 64,118 L 80,118 C 88,80 88,40 86,8 Z" fill="url(#water)" />
                <ellipse cx="72" cy="122" rx="16" ry="6" fill="#cfeef6" opacity="0.5" filter="url(#blur6)" />
                <g className="journey-bob">
                  <path d="M 46,-238 c -15,0 -25,11 -25,25 c 0,18 25,38 25,38 c 0,0 25,-20 25,-38 c 0,-14 -10,-25 -25,-25 Z" fill="#f97316" stroke="#fff" strokeWidth="3.5" />
                  <circle cx="46" cy="-213" r="9" fill="#fff" />
                </g>
              </Island>
            )}
          </g>

          {/* 2–5 — locked chapters */}
          {WORLDS.slice(1).map((d, i) =>
            isSpace ? (
              <SpacePlanet key={d.id} d={d} name={chapters[i + 1]} colors={MTN[i + 1]} />
            ) : (
              <Island key={d.id} d={d} name={chapters[i + 1]}>
                <MtnPeaks a={MTN[i + 1][0]} b={MTN[i + 1][1]} />
              </Island>
            ),
          )}

          {/* hot-air balloon (skies only) / rocket drifting (space) */}
          {isSpace ? (
            <g transform="translate(1010,560)" className="world-float" style={{ animationDuration: '9s' }}>
              <ellipse cx="0" cy="26" rx="9" ry="3" fill="#f97316" opacity="0.35" />
              <path d="M 0,-26 C 11,-12 11,8 0,24 C -11,8 -11,-12 0,-26 Z" fill="#e9edf7" stroke="#b9c2da" strokeWidth="1.5" />
              <circle cx="0" cy="-6" r="5" fill="#7fb2d9" />
              <path d="M -8,16 L -16,30 L -3,22 Z" fill="#cdd6ea" />
              <path d="M 8,16 L 16,30 L 3,22 Z" fill="#cdd6ea" />
              <path d="M 0,24 L -5,40 L 5,40 Z" fill="#f97316" />
            </g>
          ) : (
            <g transform="translate(1000,195)">
              <g className="world-float" style={{ animationDuration: '9s' }}>
                <path d="M 0,-46 C -30,-46 -42,-20 -38,0 C -34,18 -16,30 -10,38 L 10,38 C 16,30 34,18 38,0 C 42,-20 30,-46 0,-46 Z" fill="#f97316" />
                <path d="M 0,-46 C -10,-46 -14,-16 -12,2 C -10,20 -4,32 -3,38 L 3,38 C 4,32 10,20 12,2 C 14,-16 10,-46 0,-46 Z" fill="#ffd9a0" />
                <line x1="-9" y1="38" x2="-7" y2="52" stroke="#5b3a22" strokeWidth="1.8" />
                <line x1="9" y1="38" x2="7" y2="52" stroke="#5b3a22" strokeWidth="1.8" />
                <rect x="-9" y="52" width="18" height="13" rx="3" fill="#8a5a30" />
              </g>
            </g>
          )}

          {/* fireflies (skies only) */}
          {!isSpace &&
            FIREFLIES.map(([fx, fy], i) => (
              <circle key={`f${i}`} cx={fx} cy={fy} r="2.2" fill="#ffd166" className="journey-twinkle" style={{ animationDelay: `${(i % 5) * 0.8}s` }} />
            ))}

          {/* vignette */}
          <rect width={W} height={H} fill="url(#vin)" pointerEvents="none" />

          {/* Wordmark */}
          <text x={64} y={108} fontSize={74} fontWeight={800} fill="#ffffff" fontFamily="'Quicksand', sans-serif" style={{ textShadow: '0 0 24px rgba(255,210,140,0.55)' }}>
            Worlderly
          </text>
          <text x={68} y={146} fontSize={15} fontWeight={700} letterSpacing={8} fill="#ffce8a">
            A WORLD OF WONDER
          </text>

          {/* compass */}
          <g transform="translate(1612,86)" opacity="0.9">
            <circle r="30" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" />
            <polygon points="0,-22 6,2 -6,2" fill="#f97316" />
            <polygon points="0,22 6,-2 -6,-2" fill="#ffffff" opacity="0.7" />
            <text y={-38} textAnchor="middle" fontSize="13" fontWeight={800} fill="#ffffff" opacity="0.8">N</text>
          </g>

          {/* hint */}
          <text x={W / 2} y={H - 26} textAnchor="middle" fontSize="16" fontWeight={700} letterSpacing={2} fill={isSpace ? '#c7b8ff' : '#ffd9a0'} opacity="0.9">
            {isSpace ? '✦ Tap your glowing planet to launch the mission ✦' : '✦ Tap your glowing chapter to begin the climb ✦'}
          </text>
        </svg>
      </div>
    </section>
  )
}
