'use client'

// The student's personal trek — one mountain per WEEK. Each week climbs from a
// base camp (Class 1) up through a checkpoint, a second base camp (Class 2) and
// a summit checkpoint. Clear the summit checkpoint and the student parachutes
// down to the next week's mountain. Student and parent travel together the
// whole way. Art-directed to match the golden-hour Worlderly world.

import { useEffect, useRef, useState } from 'react'
import {
  useApp,
  JOURNEY_NODES,
  JOURNEY_CHAPTERS,
  type JourneyNode,
  type JourneyNodeType,
} from '@/context/AppContext'

const MAP_W = 2440
const MAP_H = 470
const VALLEY_Y = 392

// Per-week mountain gradients — cool violet at dawn warming to gold by the
// final summit. Each week is visibly its own peak.
const WEEK_GRAD: { front: [string, string]; face: string }[] = [
  { front: ['#9d8ec9', '#3b2f63'], face: '#241d44' },
  { front: ['#a48fc2', '#46356a'], face: '#281f47' },
  { front: ['#bf95b9', '#523a63'], face: '#2c2049' },
  { front: ['#d3a088', '#62443c'], face: '#3a2740' },
  { front: ['#d6a96b', '#6a4d2c'], face: '#41301f' },
]

const NODE_STYLE: Record<
  JourneyNodeType,
  { icon: string; from: string; to: string; edge: string; ring: string }
> = {
  class: { icon: '🏕️', from: '#4ade80', to: '#0f8a5f', edge: '#065f46', ring: 'rgba(110,231,183,0.9)' },
  checkpoint: { icon: '🚩', from: '#fcd34d', to: '#d97706', edge: '#92400e', ring: 'rgba(252,211,77,0.9)' },
}

const DONE_MESSAGE: Record<JourneyNodeType, string> = {
  class: '🎓 +50 🪙 · Class complete!',
  checkpoint: '🚩 +120 🪙 · Checkpoint cleared!',
}

const CAMP_TAG: Record<JourneyNodeType, string> = {
  class: 'BASE CAMP',
  checkpoint: 'CHECKPOINT',
}

const DETAIL_BADGE: Record<JourneyNodeType, string> = {
  class: 'Live Class',
  checkpoint: 'Checkpoint',
}

const DETAIL_ACCENT: Record<JourneyNodeType, 'emerald' | 'amber'> = {
  class: 'emerald',
  checkpoint: 'amber',
}

const DETAIL_HINT: Record<JourneyNodeType, string> = {
  class: 'Join the live class or watch the recording',
  checkpoint: 'Open to view & submit your interactive activity, worksheet & quiz',
}

const STUDENT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png'
const PARENT_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'

type NodeStatus = 'done' | 'active' | 'locked'

/** Straight 2-D polyline through a set of points — flat faceted slopes so the
 *  base camps and trail sit exactly on the surface. */
function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  return `M ${points[0].x},${points[0].y}` + points.slice(1).map((p) => ` L ${p.x},${p.y}`).join('')
}

const STARS: [number, number, number][] = [
  [120, 50, 1.6], [380, 34, 1.1], [560, 70, 1.4], [820, 40, 1], [1040, 56, 1.6],
  [1260, 30, 1.1], [1480, 60, 1.4], [700, 22, 1], [980, 26, 1.1], [1640, 24, 1.4],
  [1880, 44, 1.1], [2080, 28, 1.4], [2260, 50, 1], [2380, 30, 1.2], [240, 90, 1.2],
  [1360, 84, 1], [1760, 80, 1.2], [2160, 70, 1], [460, 110, 1.1], [1140, 100, 1],
]

function Campfire({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute z-[6] -translate-x-1/2 -translate-y-full pointer-events-none" style={{ left: x, top: y }}>
      <svg width="30" height="30" viewBox="0 0 34 34">
        <circle cx="17" cy="18" r="13" fill="#ffb45e" opacity="0.25" className="journey-glow" />
        <path d="M17,8 C 21,13 23,16 22,21 C 21,25 13,25 12,21 C 11,16 13,13 17,8 Z" fill="#fb923c" className="journey-twinkle" />
        <path d="M17,13 C 19,16 20,18 19.4,21 C 18.8,23 15.2,23 14.6,21 C 14,18 15,16 17,13 Z" fill="#fde047" className="journey-twinkle" style={{ animationDelay: '0.4s' }} />
        <rect x="9" y="25" width="16" height="3" rx="1.5" fill="#6b4226" transform="rotate(-8 17 26)" />
        <rect x="9" y="25" width="16" height="3" rx="1.5" fill="#5b3a22" transform="rotate(10 17 26)" />
      </svg>
    </div>
  )
}

// A camp tent whose flat base (the viewBox bottom) is pinned exactly to (x, y).
function Tent({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute z-[8] -translate-x-1/2 -translate-y-full pointer-events-none" style={{ left: x, top: y }}>
      <svg width="40" height="32" viewBox="0 0 44 34">
        <ellipse cx="22" cy="33" rx="21" ry="3" fill="#140f28" opacity="0.35" />
        <polygon points="22,2 2,33 42,33" fill="#e8965e" />
        <polygon points="22,2 12,33 32,33" fill="#c9764a" />
        <polygon points="22,11 16,33 28,33" fill="#3a2348" />
        <line x1="22" y1="2" x2="22" y2="-4" stroke="#f4ede0" strokeWidth="2" />
        <polygon points="22,-4 31,-1 22,2" fill="#f97316" />
      </svg>
    </div>
  )
}

export function JourneyMap({ onBack }: { onBack?: () => void }) {
  const {
    studentStep,
    advanceStudent,
    openCheckpoint,
    setHoverDetail,
    pendingFlight,
    clearFlight,
    summitResult,
  } = useApp()
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevStep = useRef(studentStep)

  function showToast(msg: string) {
    setToast((t) => ({ id: (t?.id ?? 0) + 1, msg }))
  }

  useEffect(() => {
    if (studentStep > prevStep.current) {
      const finished = JOURNEY_NODES[studentStep - 1]
      if (finished) setToast((t) => ({ id: (t?.id ?? 0) + 1, msg: DONE_MESSAGE[finished.type] }))
    }
    prevStep.current = studentStep
  }, [studentStep])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const target = JOURNEY_NODES[studentStep]?.x ?? 0
    el.scrollTo({ left: target - el.clientWidth / 2, behavior: 'smooth' })
  }, [studentStep])

  const statusOf = (i: number): NodeStatus =>
    i < studentStep ? 'done' : i === studentStep ? 'active' : 'locked'

  // The y of the mountain surface a short distance (dx) to the side of node i —
  // so decorations sit exactly on the slope rather than floating.
  const surfaceYAt = (i: number, dx: number) => {
    const node = JOURNEY_NODES[i]
    const tx = node.x + dx
    if (dx <= 0) {
      const prev = i % 4 === 0 ? { x: node.x - 78, y: VALLEY_Y } : JOURNEY_NODES[i - 1]
      const t = (tx - prev.x) / (node.x - prev.x)
      return prev.y + (node.y - prev.y) * t
    }
    const next = JOURNEY_NODES[i + 1]
    if (!next) return node.y
    const t = (tx - node.x) / (next.x - node.x)
    return node.y + (next.y - node.y) * t
  }

  function handleNodeClick(i: number, node: JourneyNode) {
    const status = statusOf(i)
    if (status === 'done') {
      showToast('✅ Already cleared — revisit anytime!')
      return
    }
    if (status === 'locked') {
      showToast('🔒 Climb the earlier steps to unlock this!')
      return
    }
    if (node.type === 'checkpoint') openCheckpoint(i)
    else advanceStudent() // attend the class — the trek moves on
  }

  const studentNode = JOURNEY_NODES[studentStep]

  // Parachute glide from the week-end checkpoint down to the next week's base.
  const flight = (() => {
    if (pendingFlight == null || summitResult) return null
    const from = JOURNEY_NODES[pendingFlight]
    const to = JOURNEY_NODES[pendingFlight + 1]
    if (!from || !to) return null
    return {
      id: pendingFlight,
      style: {
        left: from.x,
        top: from.y - 34,
        ['--pdx']: `${to.x - from.x}px`,
        ['--pdy']: `${to.y - from.y + 34}px`,
      } as React.CSSProperties,
    }
  })()

  return (
    <section className="bg-gradient-to-b from-[#161438] via-[#3d2a63] to-[#8e4a6e] rounded-3xl shadow-xl relative overflow-hidden">
      {/* ---- Header ---- */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              🌍 <span className="hidden sm:inline">World</span>
            </button>
          )}
          <h3 className="text-white font-extrabold text-sm tracking-wide flex items-center gap-2">
            <span className="text-base">🏔️</span> ALGEBRA BASICS
            <span className="text-[9px] font-black tracking-[3px] text-[#ffce8a] mt-0.5">MATHEMATICS</span>
          </h3>
        </div>
        <span className="text-[10px] font-bold text-[#ffd9a0]/80 tracking-wide">
          5 weeks · 5 summits 🏔️
        </span>
      </div>

      {/* ---- Scrollable trail ---- */}
      <div ref={scrollRef} className="relative overflow-x-auto px-4 pb-2 scroll-smooth">
        <div className="relative" style={{ width: MAP_W, height: MAP_H }}>
          <svg
            className="absolute inset-0"
            width={MAP_W}
            height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {WEEK_GRAD.map((g, i) => (
                <linearGradient key={i} id={`tMtn${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={g.front[0]} />
                  <stop offset="100%" stopColor={g.front[1]} />
                </linearGradient>
              ))}
              <linearGradient id="tMtnHaze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6e5f9b" />
                <stop offset="100%" stopColor="#352b58" />
              </linearGradient>
              <linearGradient id="tMtnMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a695d2" />
                <stop offset="55%" stopColor="#6a5896" />
                <stop offset="100%" stopColor="#3a2f5e" />
              </linearGradient>
              <radialGradient id="tSun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe3ae" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ffb066" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffb066" stopOpacity="0" />
              </radialGradient>
              <filter id="tBlur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>

            {/* stars */}
            {STARS.map(([sx, sy, r], i) => (
              <circle key={i} cx={sx} cy={sy} r={r} fill="#fff" className="journey-twinkle" style={{ animationDelay: `${(i % 6) * 0.5}s` }} />
            ))}

            {/* sun glow crowning the final summit */}
            <circle cx={2285} cy={60} r={260} fill="url(#tSun)" className="journey-glow" />

            {/* distant haze range */}
            <path
              d="M0,360 L300,300 L640,340 L980,250 L1340,290 L1700,210 L2080,250 L2440,200 L2440,420 L0,420 Z"
              fill="url(#tMtnHaze)"
              opacity="0.4"
            />

            {/* one continuous mountain range — peaks linked by saddles, no
                breaks between weeks, no snow caps */}
            {(() => {
              const first = JOURNEY_NODES[0].x - 90
              const last = JOURNEY_NODES[JOURNEY_NODES.length - 1].x + 132
              const ridge = [
                { x: first, y: VALLEY_Y },
                ...JOURNEY_NODES,
                { x: last, y: VALLEY_Y },
              ]
              const d = `${buildSmoothPath(ridge)} L ${last},${MAP_H} L ${first},${MAP_H} Z`
              return (
                <>
                  <path d={d} fill="url(#tMtnMain)" />
                  {/* soft highlight along the ridgeline */}
                  <path d={buildSmoothPath(ridge)} stroke="#c3b4e6" strokeWidth="2" opacity="0.3" fill="none" strokeLinejoin="round" />
                </>
              )
            })()}

            {/* valley floor */}
            <rect x="0" y={MAP_H - 34} width={MAP_W} height={34} fill="#1d4636" opacity="0.55" />

            {/* per-week luminous trail + travelled overlay */}
            {JOURNEY_CHAPTERS.map((c, ci) => {
              const nodes = JOURNEY_NODES.slice(ci * 4, ci * 4 + 4)
              const start = ci * 4
              const doneCount = Math.min(Math.max(studentStep - start + 1, 0), nodes.length)
              return (
                <g key={`trail-${c.id}`}>
                  <path d={buildSmoothPath(nodes)} stroke="#ffb45e" strokeWidth="11" strokeLinecap="round" opacity="0.14" filter="url(#tBlur)" />
                  <path d={buildSmoothPath(nodes)} stroke="#ffd9a0" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 14" opacity="0.85" />
                  {doneCount > 1 && (
                    <path
                      d={buildSmoothPath(nodes.slice(0, doneCount))}
                      stroke="#ffb45e"
                      strokeWidth="5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_6px_rgba(255,180,94,0.8)]"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* week banners — centred under each mountain, clear of node labels */}
          {JOURNEY_CHAPTERS.map((c) => (
            <div key={`banner-${c.id}`} className="absolute z-10 -translate-x-1/2" style={{ left: c.peakX - 80, top: MAP_H - 26 }}>
              <span className="whitespace-nowrap bg-[#14112b]/70 border border-white/15 text-[9px] font-black tracking-[2px] text-[#ffd9a0] px-3 py-1 rounded-full">
                WEEK {c.id} · {c.title.toUpperCase()}
              </span>
            </div>
          ))}

          {/* parachute descent between weeks (student only) */}
          {flight && (
            <div
              key={`para-${flight.id}`}
              className="journey-parachute absolute z-40 pointer-events-none"
              style={flight.style}
              onAnimationEnd={clearFlight}
            >
              <div className="flex flex-col items-center">
                <span style={{ fontSize: 44, lineHeight: 1 }}>🪂</span>
                <div className="flex -space-x-2 -mt-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-[3px] border-orange-400 shadow-lg bg-orange-100">
                    <img src={STUDENT_AVATAR} alt="You" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-[3px] border-[#cbbfd8] shadow-lg bg-[#3a2f5d]">
                    <img src={PARENT_AVATAR} alt="Parent" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* clouds */}
          <div className="journey-cloud absolute z-0 opacity-20" style={{ left: 620, top: 90 }}>
            <div className="w-24 h-7 bg-white rounded-full blur-[2px]" />
          </div>
          <div className="journey-cloud absolute z-0 opacity-15" style={{ left: 1500, top: 70, animationDelay: '2s' }}>
            <div className="w-28 h-8 bg-white rounded-full blur-[2px]" />
          </div>

          {/* base-camp tent + campfire, each pinned to the slope surface beside the node */}
          {JOURNEY_NODES.map((n, i) =>
            n.type === 'class' ? (
              <div key={`camp-${n.id}`}>
                <Tent x={n.x - 34} y={surfaceYAt(i, -34)} />
                <Campfire x={n.x + 26} y={surfaceYAt(i, 26)} />
              </div>
            ) : null,
          )}

          {/* node bubbles */}
          {JOURNEY_NODES.map((node, i) => {
            const status = statusOf(i)
            const style = NODE_STYLE[node.type]
            const active = status === 'active'
            const locked = status === 'locked'
            const size = active ? 34 : 30
            const bubbleStyle: React.CSSProperties = locked
              ? { background: '#2a2447', boxShadow: '0 5px 0 #14112b, inset 0 3px 6px rgba(255,255,255,0.08)' }
              : {
                  background: `linear-gradient(160deg, ${style.from}, ${style.to})`,
                  boxShadow: `0 ${active ? 6 : 5}px 0 ${style.edge}, inset 0 3px 6px rgba(255,255,255,0.35)${
                    active ? `, 0 0 26px ${style.ring}` : ''
                  }`,
                }

            return (
              <div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: node.x, top: node.y, zIndex: active ? 20 : 10 }}
              >
                {active && (
                  <span
                    className="journey-halo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: size, height: size, background: style.ring }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleNodeClick(i, node)}
                  onMouseEnter={() =>
                    setHoverDetail({
                      badge: DETAIL_BADGE[node.type],
                      title: `${node.label} — Week ${node.chapter}`,
                      meta: `Week ${node.chapter} · ${JOURNEY_CHAPTERS[node.chapter - 1]?.title ?? ''}`,
                      status:
                        status === 'done'
                          ? '✅ Completed'
                          : status === 'active'
                            ? '⭐ Up next — click to begin'
                            : '🔒 Locked',
                      accent: DETAIL_ACCENT[node.type],
                      hint: status === 'locked' ? 'Finish the earlier steps to unlock this' : DETAIL_HINT[node.type],
                    })
                  }
                  onMouseLeave={() => setHoverDetail(null)}
                  aria-label={`${node.label} — ${status}`}
                  className={`map-node relative grid place-items-center rounded-full border-[3px] transition-transform hover:scale-105 active:translate-y-1 active:shadow-none ${
                    locked ? 'border-white/25' : 'border-white/90'
                  }`}
                  style={{ width: size, height: size, ...bubbleStyle }}
                >
                  <span className={locked ? 'grayscale opacity-40' : ''} style={{ fontSize: active ? 15 : 14, lineHeight: 1 }}>
                    {style.icon}
                  </span>
                  {status === 'done' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffd166] border-2 border-[#3a2348] text-[#3a2348] text-[9px] font-black grid place-items-center">
                      ✓
                    </span>
                  )}
                  {locked && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#14112b] border border-white/25 text-[7px] grid place-items-center">
                      🔒
                    </span>
                  )}
                </button>
                {active ? (
                  <span className="journey-bob absolute left-1/2 -translate-x-1/2 top-full mt-2.5 whitespace-nowrap bg-gradient-to-r from-[#ffd166] to-[#f97316] text-[#3a2348] text-[9px] font-black uppercase tracking-[1.5px] px-2.5 py-1 rounded-full shadow-lg">
                    {node.type === 'checkpoint' ? '🚩 Open checkpoint' : '⛺ Attend class'}
                  </span>
                ) : (
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap text-center text-[10px] font-bold leading-tight ${
                      locked ? 'text-[#8a7aa8]' : 'text-white'
                    }`}
                  >
                    {node.label}
                    <span className={`block text-[7px] font-black tracking-[3px] mt-0.5 ${locked ? 'text-[#6b5d8a]' : 'text-[#ffce8a]'}`}>
                      {CAMP_TAG[node.type]}
                    </span>
                  </span>
                )}
              </div>
            )
          })}

          {/* parent — travels right beside the student, everywhere */}
          {studentNode && !flight && (
            <div
              className="journey-avatar absolute z-30 pointer-events-none"
              style={{ left: studentNode.x + 24, top: studentNode.y - 6, transform: 'translate(-50%,-100%)' }}
            >
              <div className="journey-bob flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
                <span className="px-2 py-0.5 mb-0.5 rounded-full text-[8px] font-black bg-white/15 border border-white/25 text-white backdrop-blur-sm">
                  Parent
                </span>
                <div className="w-9 h-9 rounded-full overflow-hidden border-[3px] border-[#cbbfd8] shadow-lg bg-[#3a2f5d]">
                  <img src={PARENT_AVATAR} alt="Parent" className="w-full h-full object-cover" />
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-[#cbbfd8]" />
              </div>
            </div>
          )}

          {/* student avatar (hidden while parachuting) */}
          {studentNode && !flight && (
            <div
              className="journey-avatar absolute z-30 pointer-events-none"
              style={{ left: studentNode.x - 22, top: studentNode.y - 6, transform: 'translate(-50%,-100%)' }}
            >
              <div className="journey-bob flex flex-col items-center">
                <span className="px-2 py-0.5 mb-0.5 rounded-full text-[8px] font-black bg-gradient-to-r from-[#ffd166] to-[#f97316] text-[#3a2348] shadow">
                  YOU
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden border-[3px] border-[#ffb45e] shadow-[0_0_14px_rgba(255,180,94,0.6)] bg-orange-100">
                  <img src={STUDENT_AVATAR} alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-[#ffb45e]" />
              </div>
            </div>
          )}

          {/* travelling-together banner */}
          {studentNode && !flight && (
            <div className="absolute z-20 -translate-x-1/2 journey-bob" style={{ left: studentNode.x + 14, top: studentNode.y - 92 }}>
              <span className="whitespace-nowrap bg-[#14112b]/80 text-[#ffd9a0] text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-sm">
                👨‍👧 Travelling together
              </span>
            </div>
          )}
        </div>

        {/* toast */}
        {toast && (
          <div
            key={toast.id}
            className="journey-toast absolute left-1/2 top-3 z-40 whitespace-nowrap bg-[#1d1838]/95 text-white font-black text-xs px-4 py-2 rounded-full shadow-2xl border border-[#ffd166]/40"
          >
            {toast.msg}
          </div>
        )}
      </div>
      <div className="pb-3" />
    </section>
  )
}
