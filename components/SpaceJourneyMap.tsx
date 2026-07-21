'use client'

// The Science mission — a flight through deep space. Student and mentor fly
// TOGETHER. Each WEEK is a sector with 2 classes + 2 checkpoints; clearing a
// sector's final checkpoint earns a rocket from the supply crate to launch on
// to the next planet. Conquer sector 4 and they dock at the home base. 🚀🪐

import { Fragment, useRef, useState } from 'react'
import { AstronautAvatar } from '@/components/AstronautAvatar'

const MAP_W = 2520
const MAP_H = 470

const TEACHER_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'

interface SNode {
  id: string
  type: 'class' | 'checkpoint'
  label: string
  week: number
  x: number
  y: number
}

// Each WEEK is its own PLANET. The student orbits that planet through its 2
// classes + 2 checkpoints, then the rocket makes a transfer hop to the next
// planet — a logical planet-to-planet voyage. Sector 4 → home base.
const PLANETS = [
  { x: 380, y: 220, r: 58, a: '#6bd498', b: '#2f8a5e', title: 'Matter' },
  { x: 970, y: 245, r: 52, a: '#6cc7e0', b: '#2f7c99', title: 'Forces & Motion' },
  { x: 1560, y: 215, r: 64, a: '#bca0f0', b: '#6b46b0', title: 'Energy' },
  { x: 2130, y: 245, r: 52, a: '#f0a584', b: '#c2603e', title: 'The Cell' },
]
const HOME = { x: 2410, y: 220, r: 60 } // the home base planet — step === TOTAL ⇒ docked

const WEEKS = PLANETS.map((p, i) => ({ id: i + 1, title: p.title }))

// The 4 weekly stops ride an ORBIT around each planet — the student circles the
// planet (left → bottom → right → top) then the rocket hops to the next planet.
const ORBIT: { a: number; type: SNode['type']; label: string }[] = [
  { a: 178, type: 'class', label: 'Class 1' }, // arrive on the left
  { a: 100, type: 'checkpoint', label: 'Checkpoint' }, // swing under the planet
  { a: 18, type: 'class', label: 'Class 2' }, // round to the right
  { a: -64, type: 'checkpoint', label: 'Checkpoint' }, // up over the top, then launch
]
const orbitR = (r: number) => r + 48

function orbitPoint(p: { x: number; y: number; r: number }, a: number) {
  const rad = (a * Math.PI) / 180
  return { x: p.x + orbitR(p.r) * Math.cos(rad), y: p.y + orbitR(p.r) * 0.82 * Math.sin(rad) }
}

const NODES: SNode[] = PLANETS.flatMap((p, wi) =>
  ORBIT.map((o, ni) => {
    const pt = orbitPoint(p, o.a)
    return { id: `w${wi + 1}-n${ni}`, type: o.type, label: o.label, week: wi + 1, x: pt.x, y: pt.y }
  }),
)
const TOTAL = NODES.length

const QUESTIONS = [
  { q: 'Which of these is a state of matter?', options: ['Energy', 'Solid', 'Speed', 'Colour'], answer: 1 },
  { q: 'Water freezes into…', options: ['Steam', 'Ice', 'Salt', 'Sand'], answer: 1 },
  { q: 'A push or a pull is a…', options: ['Force', 'Gas', 'Cell', 'Wave'], answer: 0 },
  { q: 'Our main source of energy is the…', options: ['Moon', 'Sun', 'Wind', 'Sea'], answer: 1 },
]

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${
      p2.y - (p3.y - p1.y) / 6
    } ${p2.x},${p2.y}`
  }
  return d
}

const ENTRY_A = ORBIT[0].a
const EXIT_A = ORBIT[ORBIT.length - 1].a

// An elevated midpoint so a planet-to-planet hop bows like an orbital transfer.
const transferMid = (ax: number, ay: number, bx: number, by: number) => ({
  x: (ax + bx) / 2,
  y: Math.min(ay, by) - 66,
})

const STARS: [number, number, number][] = [
  [140, 60, 1.6], [360, 40, 1], [560, 90, 1.3], [820, 44, 1.5], [1040, 56, 1.1],
  [1280, 36, 1.4], [1500, 70, 1], [700, 24, 1.2], [980, 30, 1.5], [1700, 50, 1.2],
  [1900, 36, 1], [2120, 64, 1.4], [2300, 44, 1.1], [240, 130, 1], [1360, 96, 1.2],
  [60, 240, 1], [480, 300, 1.2], [900, 360, 1], [1600, 330, 1.2], [2050, 280, 1],
  [320, 200, 1.3], [1180, 200, 1], [2200, 160, 1.3], [780, 160, 1],
]

const NODE_STYLE = {
  class: { icon: '🛰️', from: '#8aa2f5', to: '#3a4fb8', edge: '#26307a', ring: 'rgba(138,162,245,0.9)' },
  checkpoint: { icon: '🚩', from: '#c79bf0', to: '#7c3ad0', edge: '#54208f', ring: 'rgba(199,155,240,0.9)' },
} as const

type Status = 'done' | 'active' | 'locked'

function UploadBox({ fileName, onPick }: { fileName: string | null; onPick: (n: string) => void }) {
  return (
    <label
      className={`flex flex-col items-center justify-center gap-1 w-full rounded-2xl border-2 border-dashed cursor-pointer px-4 py-5 transition-colors ${
        fileName ? 'bg-emerald-50 border-emerald-300' : 'bg-white hover:bg-slate-50 border-indigo-300 text-indigo-600'
      }`}
    >
      <input
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.heic,.doc,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f.name)
        }}
      />
      {fileName ? (
        <>
          <span className="text-2xl">✅</span>
          <span className="text-xs font-black text-emerald-700 max-w-full truncate">📎 {fileName}</span>
          <span className="text-[10px] font-bold text-emerald-600">Uploaded · tap to replace</span>
        </>
      ) : (
        <>
          <span className="text-2xl">⬆️</span>
          <span className="text-xs font-black">Upload your answer script</span>
          <span className="text-[10px] font-bold text-slate-400">PDF, image or doc — snap a photo or pick a file</span>
        </>
      )}
    </label>
  )
}

function CheckpointModal({
  week,
  isSectorEnd,
  onClose,
  onFinish,
}: {
  week: number
  isSectorEnd: boolean
  onClose: () => void
  onFinish: (score: number, total: number) => void
}) {
  const [tab, setTab] = useState<'interactive' | 'worksheet' | 'quiz'>('interactive')
  const [interactiveFile, setInteractiveFile] = useState<string | null>(null)
  const [worksheetFile, setWorksheetFile] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  const correct = answers.filter((a, i) => a === QUESTIONS[i].answer).length
  const pct = Math.round((correct / QUESTIONS.length) * 100)
  const passed = submitted && pct >= 60
  const tasksDone = (interactiveFile ? 1 : 0) + (worksheetFile ? 1 : 0) + (submitted ? 1 : 0)
  const title = WEEKS[week - 1]?.title ?? ''

  const TABS = [
    { key: 'interactive', icon: '🎮', label: 'Interactive activity', done: !!interactiveFile },
    { key: 'worksheet', icon: '📐', label: 'Worksheet', done: !!worksheetFile },
    { key: 'quiz', icon: '🧠', label: 'Quiz', done: submitted },
  ] as const

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-indigo-100 max-h-[88%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-500">
          <div>
            <span className="text-[10px] font-extrabold text-white/90 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1 w-max">
              Week {week} · {title}
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">🚩 Checkpoint</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/90 font-bold bg-white/20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1.5 px-4 pt-3 pb-2 border-b border-slate-100">
          {TABS.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-black py-2 rounded-xl border transition-all ${
                  active ? 'bg-indigo-500 border-indigo-500 text-white shadow' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.done && <span className={active ? 'text-white' : 'text-emerald-500'}>✓</span>}
              </button>
            )
          })}
        </div>

        <div className="overflow-y-auto px-6 py-4 flex-1">
          {tab === 'interactive' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <h4 className="text-sm font-black text-slate-800">🎮 Observation log · interactive activity</h4>
                <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                  Explore the interactive and record 5 everyday examples of this week&apos;s concept, explaining what you noticed.
                  Snap a photo or upload your work.
                </p>
              </div>
              <UploadBox fileName={interactiveFile} onPick={setInteractiveFile} />
            </div>
          )}
          {tab === 'worksheet' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <h4 className="text-sm font-black text-slate-800">📐 Practice worksheet</h4>
                <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                  10 guided problems on this sector&apos;s skill. Work through them and upload your script.
                </p>
              </div>
              <UploadBox fileName={worksheetFile} onPick={setWorksheetFile} />
            </div>
          )}
          {tab === 'quiz' && (
            <div className="space-y-4">
              {!submitted ? (
                <>
                  <p className="text-xs font-bold text-slate-400">{QUESTIONS.length} quick questions · 60% to earn the spacecraft.</p>
                  {QUESTIONS.map((question, qi) => (
                    <div key={qi}>
                      <p className="text-sm font-bold text-slate-800 mb-2">{qi + 1}. {question.q}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((opt, oi) => {
                          const sel = answers[qi] === oi
                          return (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => setAnswers((p) => p.map((a, i) => (i === qi ? oi : a)))}
                              className={`text-xs font-bold py-2.5 px-3 rounded-xl border text-left transition-all ${
                                sel ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm py-3 rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Submit &amp; See Score
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className={`rounded-2xl border p-4 text-center ${passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="text-4xl mb-1">{passed ? '🚀' : '💪'}</div>
                    <h4 className="text-base font-black text-slate-800">{correct}/{QUESTIONS.length} correct · {pct}%</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                      {passed ? 'Quiz cleared — your spacecraft is ready in the treasure box!' : 'Below 60% — you can retry anytime.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers(QUESTIONS.map(() => null))
                      setSubmitted(false)
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    ↺ Retry quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-3">
          <span className="text-[11px] font-black text-slate-400">{tasksDone}/3 tasks done</span>
          <div className="flex-1" />
          <button type="button" onClick={onClose} className="text-[12px] font-bold text-slate-500 hover:text-slate-700 px-3 py-2">
            Skip for now
          </button>
          <button
            type="button"
            onClick={() => onFinish(submitted ? correct : 0, QUESTIONS.length)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[13px] px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
          >
            {passed && isSectorEnd ? '🧰 Claim treasure & spacecraft' : 'Finish checkpoint'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function SpaceJourneyMap({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(0)
  const [modalNode, setModalNode] = useState<number | null>(null)
  const [celebrate, setCelebrate] = useState<{ from: number; final: boolean } | null>(null)
  const [flying, setFlying] = useState<number | null>(null)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const arrived = step >= TOTAL
  const currentChapter = PLANETS[Math.min(Math.floor(step / 4), PLANETS.length - 1)]?.title ?? PLANETS[0].title

  const showToast = (msg: string) => setToast((t) => ({ id: (t?.id ?? 0) + 1, msg }))
  const statusOf = (i: number): Status => (i < step ? 'done' : i === step ? 'active' : 'locked')

  function handleNodeClick(i: number, node: SNode) {
    const status = statusOf(i)
    if (status === 'done') return showToast('✅ Already cleared — revisit anytime!')
    if (status === 'locked') return showToast('🔒 Clear the earlier sectors first!')
    if (node.type === 'checkpoint') setModalNode(i)
    else {
      setStep(i + 1)
      showToast('🎓 +50 ⭐ · Class complete!')
    }
  }

  function onFinish(score: number, total: number) {
    const i = modalNode
    setModalNode(null)
    if (i == null) return
    const passed = total > 0 && (score / total) * 100 >= 60
    const sectorEnd = i % 4 === 3 // the week's 2nd checkpoint sits by the planet
    if (sectorEnd && passed) setCelebrate({ from: i, final: i === TOTAL - 1 })
    else {
      setStep(i + 1)
      showToast('🚩 Checkpoint logged — fly on!')
    }
  }

  // The pod flies along the same curved transfer route to the next planet
  // (or the home base) — using a CSS motion path.
  const fly = (() => {
    if (flying == null) return null
    const from = NODES[flying]
    const to = flying === TOTAL - 1 ? { x: HOME.x, y: HOME.y } : NODES[flying + 1]
    if (!from || !to) return null
    const mid = transferMid(from.x, from.y, to.x, to.y)
    return { d: buildSmoothPath([from, mid, to]) }
  })()

  const here = arrived ? HOME : NODES[step]

  return (
    <section className="bg-gradient-to-b from-[#080726] via-[#1a1340] to-[#311a52] rounded-3xl shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              🌍 <span className="hidden sm:inline">World</span>
            </button>
          )}
          <h3 className="text-white font-extrabold text-sm tracking-wide flex items-center gap-2">
            <span className="text-base">🚀</span> {currentChapter} Science
          </h3>
        </div>
        <span className="text-[10px] font-bold text-[#c5b8f5]/90 tracking-wide">4 sectors · reach home base 🪐</span>
      </div>

      {/* Scrollable space */}
      <div ref={scrollRef} className="relative overflow-x-auto px-4 pb-2 scroll-smooth">
        <div className="relative" style={{ width: MAP_W, height: MAP_H }}>
          <svg className="absolute inset-0" width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="neb1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3ad0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7c3ad0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="neb2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2f7c99" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2f7c99" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffe7b8" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#ffc070" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ffc070" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="homeSphere" cx="35%" cy="28%" r="84%">
                <stop offset="0%" stopColor="#fff6dd" />
                <stop offset="30%" stopColor="#f3cd7e" />
                <stop offset="100%" stopColor="#a9742f" />
              </radialGradient>
              <clipPath id="homeClip">
                <circle cx={HOME.x} cy={HOME.y} r={58} />
              </clipPath>
              <filter id="sBlur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              {PLANETS.map((p, i) => (
                <Fragment key={`pdef-${i}`}>
                  <radialGradient id={`pl${i}`} cx="34%" cy="27%" r="84%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="24%" stopColor={p.a} />
                    <stop offset="100%" stopColor={p.b} />
                  </radialGradient>
                  <radialGradient id={`glow${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={p.a} stopOpacity="0.5" />
                    <stop offset="55%" stopColor={p.a} stopOpacity="0.16" />
                    <stop offset="100%" stopColor={p.a} stopOpacity="0" />
                  </radialGradient>
                  <clipPath id={`clip${i}`}>
                    <circle cx={p.x} cy={p.y} r={p.r} />
                  </clipPath>
                </Fragment>
              ))}
            </defs>

            {/* nebula clouds */}
            <circle cx={520} cy={180} r={300} fill="url(#neb1)" className="journey-glow" />
            <circle cx={1500} cy={120} r={340} fill="url(#neb2)" className="journey-glow" style={{ animationDelay: '1.4s' }} />
            <circle cx={1980} cy={300} r={260} fill="url(#neb1)" className="journey-glow" style={{ animationDelay: '0.8s' }} />

            {/* stars */}
            {STARS.map(([sx, sy, r], i) => (
              <circle key={i} cx={sx} cy={sy} r={r} fill="#fff" className="journey-twinkle" style={{ animationDelay: `${(i % 6) * 0.5}s` }} />
            ))}

            {/* sector planets + the complete orbit their weekly stops ride */}
            {PLANETS.map((p, i) => {
              const oR = orbitR(p.r)
              return (
                <g key={`planet-${i}`}>
                  {/* one clean complete orbit ring */}
                  <ellipse cx={p.x} cy={p.y} rx={oR} ry={oR * 0.82} fill="none" stroke="#cabcf5" strokeWidth="1.4" opacity="0.4" />
                  {/* atmosphere glow */}
                  <circle cx={p.x} cy={p.y} r={p.r * 1.6} fill={`url(#glow${i})`} />
                  {/* 3-D sphere */}
                  <circle cx={p.x} cy={p.y} r={p.r} fill={`url(#pl${i})`} />
                  {/* surface detail, clipped to the sphere */}
                  <g clipPath={`url(#clip${i})`}>
                    <ellipse cx={p.x} cy={p.y - p.r * 0.14} rx={p.r * 1.2} ry={p.r * 0.17} fill={p.b} opacity="0.16" />
                    <ellipse cx={p.x + p.r * 0.1} cy={p.y + p.r * 0.32} rx={p.r * 1.2} ry={p.r * 0.14} fill={p.b} opacity="0.18" />
                    <circle cx={p.x - p.r * 0.34} cy={p.y - p.r * 0.26} r={p.r * 0.12} fill={p.b} opacity="0.22" />
                    <circle cx={p.x + p.r * 0.28} cy={p.y + p.r * 0.08} r={p.r * 0.09} fill={p.b} opacity="0.2" />
                    {/* specular highlight (upper-left) — no front shadow */}
                    <ellipse cx={p.x - p.r * 0.36} cy={p.y - p.r * 0.38} rx={p.r * 0.26} ry={p.r * 0.16} fill="#ffffff" opacity="0.3" />
                  </g>
                  {/* rim light */}
                  <circle cx={p.x} cy={p.y} r={p.r} fill="none" stroke={p.a} strokeWidth="1.2" opacity="0.4" />
                </g>
              )
            })}

            {/* a couple of drifting asteroids */}
            {([[300, 360, 10], [1120, 380, 14], [1760, 360, 9]] as const).map(([ax, ay, ar], i) => (
              <g key={`ast-${i}`} className="journey-bob" style={{ animationDelay: `${i * 0.6}s` }}>
                <circle cx={ax} cy={ay} r={ar} fill="#4a4470" />
                <circle cx={ax - ar * 0.3} cy={ay - ar * 0.3} r={ar * 0.3} fill="#5e577f" />
              </g>
            ))}

            {/* transfer routes between planets — dotted ahead, golden once flown */}
            {Array.from({ length: PLANETS.length }).map((_, j) => {
              const from = orbitPoint(PLANETS[j], EXIT_A)
              const to = j + 1 < PLANETS.length ? orbitPoint(PLANETS[j + 1], ENTRY_A) : { x: HOME.x, y: HOME.y }
              const mid = transferMid(from.x, from.y, to.x, to.y)
              const d = buildSmoothPath([from, mid, to])
              const done = j < (arrived ? PLANETS.length : Math.floor(step / 4))
              return (
                <path
                  key={`hop-${j}`}
                  d={d}
                  fill="none"
                  stroke={done ? '#ffd9a0' : '#b6a8ee'}
                  strokeWidth={done ? 3 : 2.5}
                  strokeLinecap="round"
                  strokeDasharray={done ? undefined : '1 13'}
                  opacity={done ? 0.95 : 0.5}
                  className={done ? 'drop-shadow-[0_0_5px_rgba(255,217,160,0.7)]' : undefined}
                />
              )
            })}

            {/* home base — the glowing golden destination planet with a ring */}
            <circle cx={HOME.x} cy={HOME.y} r={134} fill="url(#homeGlow)" className="journey-glow" />
            {/* ring behind */}
            <ellipse cx={HOME.x} cy={HOME.y} rx={104} ry={30} fill="none" stroke="#ffe7b8" strokeWidth="6" opacity="0.4" transform={`rotate(-18 ${HOME.x} ${HOME.y})`} />
            <circle cx={HOME.x} cy={HOME.y} r={58} fill="url(#homeSphere)" />
            <g clipPath="url(#homeClip)">
              <ellipse cx={HOME.x} cy={HOME.y - 8} rx={70} ry={11} fill="#b07e34" opacity="0.2" />
              <ellipse cx={HOME.x} cy={HOME.y + 18} rx={70} ry={9} fill="#b07e34" opacity="0.22" />
              <circle cx={HOME.x + 32} cy={HOME.y + 30} r={60} fill="#5a3a12" opacity="0.3" />
              <ellipse cx={HOME.x - 20} cy={HOME.y - 22} rx={16} ry={10} fill="#ffffff" opacity="0.35" />
            </g>
            {/* ring front */}
            <path
              d={`M ${HOME.x - 99},${HOME.y + 7} A 104 30 -18 0 0 ${HOME.x + 99},${HOME.y - 12}`}
              fill="none"
              stroke="#fff2cf"
              strokeWidth="6"
              opacity="0.85"
              strokeLinecap="round"
            />
          </svg>

          {/* week banners — centred under each planet */}
          {WEEKS.map((w, i) => (
            <div key={`b-${w.id}`} className="absolute z-10 -translate-x-1/2" style={{ left: PLANETS[i].x, top: MAP_H - 26 }}>
              <span className="whitespace-nowrap bg-[#140f33]/70 border border-white/15 text-[10px] font-black tracking-[2px] text-[#c5b8f5] px-3.5 py-1 rounded-full">
                WEEK {w.id}
              </span>
            </div>
          ))}
          <div className="absolute z-10 -translate-x-1/2" style={{ left: HOME.x, top: MAP_H - 26 }}>
            <span className="whitespace-nowrap bg-[#7a5a1e]/80 border border-white/15 text-[10px] font-black tracking-[2px] text-[#ffe7b8] px-3.5 py-1 rounded-full">
              🪐 HOME BASE
            </span>
          </div>

          {/* rocket flying between sectors */}
          {fly && (
            <div
              key={`fly-${flying}`}
              className="pod-fly absolute z-40 pointer-events-none"
              style={{ left: 0, top: 0, offsetPath: `path('${fly.d}')` } as React.CSSProperties}
              onAnimationEnd={() => {
                const from = flying as number
                setFlying(null)
                setStep(from + 1)
                if (from === TOTAL - 1) showToast('🪐 Docked! You reached home base!')
              }}
            >
              <SpacePod />
            </div>
          )}

          {/* node bubbles — small, so labels stay readable */}
          {NODES.map((node, i) => {
            const status = statusOf(i)
            const style = NODE_STYLE[node.type]
            const active = status === 'active'
            const locked = status === 'locked'
            const size = active ? 34 : 30
            const bubbleStyle: React.CSSProperties = locked
              ? { background: '#241d44', boxShadow: '0 4px 0 #0f0b28, inset 0 3px 6px rgba(255,255,255,0.08)' }
              : {
                  background: `linear-gradient(160deg, ${style.from}, ${style.to})`,
                  boxShadow: `0 ${active ? 5 : 4}px 0 ${style.edge}, inset 0 3px 6px rgba(255,255,255,0.4)${active ? `, 0 0 22px ${style.ring}` : ''}`,
                }
            return (
              <div key={node.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y, zIndex: active ? 20 : 10 }}>
                {active && (
                  <span
                    className="ocean-bob absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: size, height: size, background: style.ring }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleNodeClick(i, node)}
                  aria-label={`${node.label} — ${status}`}
                  className={`map-node relative grid place-items-center rounded-full border-[3px] transition-transform hover:scale-105 active:translate-y-1 ${locked ? 'border-white/25' : 'border-white/90'}`}
                  style={{ width: size, height: size, ...bubbleStyle }}
                >
                  <span className={locked ? 'grayscale opacity-40' : ''} style={{ fontSize: active ? 15 : 14, lineHeight: 1 }}>
                    {style.icon}
                  </span>
                  {status === 'done' && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffd166] border-2 border-[#0f0b28] text-[#0f0b28] text-[9px] font-black grid place-items-center">
                      ✓
                    </span>
                  )}
                  {locked && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0f0b28] border border-white/25 text-[7px] grid place-items-center">
                      🔒
                    </span>
                  )}
                </button>
                {active ? (
                  <span className="ocean-bob absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap bg-gradient-to-r from-[#8aa2f5] to-[#7c3ad0] text-white text-[9px] font-black uppercase tracking-[1.5px] px-2.5 py-1 rounded-full shadow-lg">
                    {node.type === 'checkpoint' ? '🚩 Open checkpoint' : '🛰️ Attend class'}
                  </span>
                ) : (
                  <span className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap text-center text-[10px] font-bold leading-tight ${locked ? 'text-[#8076b0]' : 'text-white'}`}>
                    {node.label}
                    <span className={`block text-[7px] font-black tracking-[2px] mt-0.5 ${locked ? 'text-[#655c92]' : 'text-[#c5b8f5]'}`}>
                      {node.type === 'checkpoint' ? 'CHECKPOINT' : 'CLASS'}
                    </span>
                  </span>
                )}
              </div>
            )
          })}

          {/* student + mentor — riding their pod together (hidden while in transit) */}
          {here && flying == null && (
            <div className="absolute z-30 pointer-events-none" style={{ left: here.x, top: here.y - 6, transform: 'translate(-50%,-100%)' }}>
              <div className="ocean-bob flex flex-col items-center">
                <span className="px-2 py-0.5 mb-1 rounded-full text-[8px] font-black bg-[#140f33]/80 text-[#c5b8f5] border border-white/20 whitespace-nowrap">
                  🧑‍🚀 Travelling together
                </span>
                {/* within a week they drift around the planet on foot — no craft */}
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-[3px] border-[#ffb45e] shadow-[0_0_12px_rgba(255,180,94,0.6)] bg-orange-100">
                    <AstronautAvatar className="w-full h-full" />
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-[3px] border-[#c5b8f5] shadow-lg bg-[#2a2150]">
                    <img src={TEACHER_AVATAR} alt="Mentor" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* docked celebration at home base */}
          {arrived && (
            <div className="absolute z-30 -translate-x-1/2 ocean-bob" style={{ left: HOME.x, top: HOME.y - 150 }}>
              <span className="whitespace-nowrap bg-gradient-to-r from-[#ffd166] to-[#f97316] text-[#0f0b28] text-xs font-black px-4 py-2 rounded-full shadow-xl">
                🪐 Mission complete — home base reached!
              </span>
            </div>
          )}
        </div>

        {toast && (
          <div key={toast.id} className="journey-toast absolute left-1/2 top-3 z-40 whitespace-nowrap bg-[#140f33]/95 text-white font-black text-xs px-4 py-2 rounded-full shadow-2xl border border-[#c79bf0]/40">
            {toast.msg}
          </div>
        )}
      </div>
      <div className="pb-3" />

      {/* checkpoint modal */}
      {modalNode != null && (
        <CheckpointModal
          week={NODES[modalNode].week}
          isSectorEnd={modalNode % 4 === 3}
          onClose={() => setModalNode(null)}
          onFinish={onFinish}
        />
      )}

      {/* supply-crate → rocket celebration */}
      {celebrate && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#06051c]/85 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-[#1a1340] to-[#311a52] border border-[#c79bf0]/40 rounded-3xl shadow-2xl px-8 py-7 text-center max-w-sm w-full">
            <div className="text-[11px] font-black tracking-[3px] text-[#c5b8f5] uppercase">
              Sector {NODES[celebrate.from].week} cleared!
            </div>
            <div className="relative mx-auto mt-4 mb-1 w-max">
              <span className="absolute -inset-5 rounded-full bg-[#ffd166]/25 blur-md" />
              {/* the spacecraft lifting out of the open treasure box */}
              <div className="relative ocean-bob">
                <SpacePod />
              </div>
              <div className="relative text-4xl mt-0.5">🧰</div>
            </div>
            <h3 className="text-white font-black text-xl mt-2">You earned a spacecraft!</h3>
            <p className="text-[#c5b8f5] text-sm font-semibold mt-1">
              {celebrate.final
                ? 'Board it with your mentor and deploy to home base — the mission ends at the station!'
                : 'Board it with your mentor and deploy to the next planet.'}
            </p>
            <button
              type="button"
              onClick={() => {
                const from = celebrate.from
                setCelebrate(null)
                setFlying(from)
              }}
              className="mt-5 w-full bg-gradient-to-r from-[#8aa2f5] to-[#7c3ad0] hover:brightness-110 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              {celebrate.final ? '🪐 Deploy to home base' : '🚀 Deploy spacecraft'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// A little two-seat space pod — student + mentor ride it together, around each
// planet and on every hop to the next.
function SpacePod() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center gap-0.5 px-2 py-1.5 rounded-[15px] bg-gradient-to-b from-[#dce3fb] via-[#aeb8e4] to-[#7c87bd] border border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        {/* dome shine */}
        <span className="absolute left-2.5 right-2.5 top-1 h-1.5 rounded-full bg-white/55 blur-[1px]" />
        {/* side fins */}
        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-r-[9px] border-r-[#7c87bd]" />
        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-l-[9px] border-l-[#7c87bd]" />
        {/* avatar windows */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-orange-100 shadow-inner">
          <AstronautAvatar className="w-full h-full" />
        </div>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-[#2a2150] shadow-inner">
          <img src={TEACHER_AVATAR} alt="Mentor" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* thruster flames */}
      <div className="flex gap-1 -mt-0.5">
        <span className="w-1.5 h-2.5 rounded-b-full bg-gradient-to-b from-orange-400 to-transparent blur-[1px] animate-pulse" />
        <span className="w-1.5 h-4 rounded-b-full bg-gradient-to-b from-amber-300 to-transparent blur-[1px] animate-pulse" style={{ animationDelay: '0.2s' }} />
        <span className="w-1.5 h-2.5 rounded-b-full bg-gradient-to-b from-orange-400 to-transparent blur-[1px] animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}
