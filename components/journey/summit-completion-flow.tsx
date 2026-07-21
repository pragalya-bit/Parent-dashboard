'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Reward } from '@/lib/rewards'
import { useSound } from '@/lib/useSound'

export type SummitPhase = 'result' | 'treasure' | 'descent' | 'landed'

export interface SummitCompletionFlowProps {
  score: number
  totalQuestions: number
  chapterCompleted: string
  nextChapter: string
  rewards: Reward[]
  chapterRecap: string[]
  studentName: string
  onComplete: () => void
  /** retry the quiz (shown only when score < 60%) */
  onRetry?: () => void
  /** persistence hook — fired ONCE at the START of the treasure phase */
  onPersist?: () => void
}

// ---- All microcopy in one place ----
const COPY = {
  clearedTitle: 'Summit cleared! 🏔️',
  clearedSub: (chapter: string) => `You conquered ${chapter}!`,
  openChest: 'Open summit treasure',
  backpack: (name: string) => `Added to ${name}'s backpack 🎒`,
  deploy: 'Deploy parachute 🪂',
  retryTitle: 'So close! The summit is right there — let’s catch up',
  retrySub: 'One more push and that flag is yours. You’ve got this!',
  retryCta: 'Climb again 💪',
  landedTitle: (next: string) => `Welcome to ${next} base camp`,
  landedBadge: 'Briefing video unlocked 🎬',
  landedCta: (next: string) => `Start ${next} →`,
}

const PASS_PCT = 60
const spring = { type: 'spring' as const, stiffness: 320, damping: 22 }

const CONFETTI = [
  { x: -90, y: -120, r: 200, c: '#f97316' },
  { x: 80, y: -140, r: -160, c: '#22c55e' },
  { x: -140, y: -60, r: 120, c: '#eab308' },
  { x: 140, y: -80, r: -220, c: '#3b82f6' },
  { x: -50, y: -160, r: 80, c: '#ec4899' },
  { x: 50, y: -170, r: -90, c: '#a855f7' },
  { x: -170, y: -100, r: 150, c: '#06b6d4' },
  { x: 170, y: -120, r: -130, c: '#f97316' },
]

function MountainSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 280" className={className} preserveAspectRatio="none">
      <path d="M0,280 L120,140 L210,210 L330,80 L450,210 L560,120 L680,220 L800,150 L800,280 Z" fill="#7ea4cf" opacity="0.5" />
      <path d="M0,280 L160,180 L280,240 L420,150 L560,250 L700,180 L800,240 L800,280 Z" fill="#5b8ec4" opacity="0.6" />
    </svg>
  )
}

export function SummitCompletionFlow(props: SummitCompletionFlowProps) {
  const {
    score, totalQuestions, chapterCompleted, nextChapter, rewards, chapterRecap,
    studentName, onComplete, onRetry, onPersist,
  } = props
  const reduceMotion = useReducedMotion()
  const { play } = useSound()

  const passed = totalQuestions > 0 && (score / totalQuestions) * 100 >= PASS_PCT
  const [phase, setPhase] = useState<SummitPhase>('result')
  const [showChest, setShowChest] = useState(false)
  const [chestOpen, setChestOpen] = useState(false)
  const [ctaMorphed, setCtaMorphed] = useState(false)
  const [persisted, setPersisted] = useState(false)

  // Phase 1 → chest slides up after 1.2s
  useEffect(() => {
    if (phase !== 'result' || !passed) return
    const t = setTimeout(() => setShowChest(true), 1200)
    return () => clearTimeout(t)
  }, [phase, passed])

  // Phase 2 entry → persist immediately (never lose progress mid-flight)
  useEffect(() => {
    if (phase === 'treasure' && !persisted) {
      setPersisted(true)
      onPersist?.()
    }
  }, [phase, persisted, onPersist])

  // Phase 2 → CTA morph after 1.5s, auto-advance after 6s (kids get distracted)
  useEffect(() => {
    if (phase !== 'treasure' || !chestOpen) return
    const morph = setTimeout(() => setCtaMorphed(true), 1500)
    const auto = setTimeout(() => setPhase(reduceMotion ? 'landed' : 'descent'), 6000)
    return () => { clearTimeout(morph); clearTimeout(auto) }
  }, [phase, chestOpen, reduceMotion])

  // Phase 3 → land after the ~4s drift
  useEffect(() => {
    if (phase !== 'descent') return
    const t = setTimeout(() => { setPhase('landed'); play('landing') }, 4400)
    return () => clearTimeout(t)
  }, [phase, play])

  const openChest = () => {
    setChestOpen(true)
    play('chest-open')
    if (!reduceMotion) play('confetti')
    setPhase('treasure')
  }

  // ---------- FAIL: encouraging retry card (no treasure flow) ----------
  if (!passed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: '#BFE0FF' }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={spring}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-4"
        >
          <motion.div initial={{ rotate: -8 }} animate={{ rotate: [0, -6, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }} className="text-6xl">
            🧗
          </motion.div>
          <h2 className="text-xl font-extrabold text-slate-800 leading-snug">{COPY.retryTitle}</h2>
          <p className="text-sm text-slate-500 font-semibold">{COPY.retrySub}</p>
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 text-sm font-black text-sky-700">
            {score}/{totalQuestions}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button type="button" onClick={onRetry ?? onComplete} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full shadow-lg shadow-orange-200 transition-all active:scale-95">
              {COPY.retryCta}
            </button>
            <button type="button" onClick={onComplete} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Back to camp
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ---------- PASS: result → treasure → descent → landed ----------
  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: '#BFE0FF' }}>
      <AnimatePresence mode="wait">
        {/* ============ PHASE 1 + 2 share the summit scene ============ */}
        {(phase === 'result' || phase === 'treasure') && (
          <motion.div
            key="summit"
            exit={{ opacity: 0, y: reduceMotion ? 0 : -60 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-start pt-[7vh] px-6"
          >
            <MountainSilhouette className="absolute bottom-0 left-0 w-full h-[36vh]" />

            {/* Flag planting */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { scale: 0, rotate: -20 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1, rotate: [8, -6, 3, 0] }}
              transition={
                reduceMotion
                  ? { delay: 0.15 }
                  : { delay: 0.15, scale: spring, rotate: { duration: 0.9, ease: 'easeInOut' } }
              }
              className="text-6xl sm:text-7xl"
            >
              🚩
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2 text-center"
            >
              {COPY.clearedTitle}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-sm font-bold text-slate-600 mt-1">
              {COPY.clearedSub(chapterCompleted)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.55 }}
              className="mt-3 bg-white rounded-full px-5 py-2 shadow-lg text-lg font-black text-emerald-600 border-2 border-emerald-200"
            >
              {score}/{totalQuestions}
            </motion.div>

            {/* Treasure chest */}
            <AnimatePresence>
              {showChest && (
                <motion.div
                  key="chest"
                  initial={reduceMotion ? { opacity: 0 } : { y: 260, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
                  transition={spring}
                  className="relative mt-6 flex flex-col items-center"
                >
                  <motion.button
                    type="button"
                    onClick={chestOpen ? undefined : openChest}
                    animate={chestOpen || reduceMotion ? {} : { y: [0, -7, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative cursor-pointer"
                    aria-label={COPY.openChest}
                  >
                    {/* confetti burst */}
                    {chestOpen && !reduceMotion &&
                      CONFETTI.map((c, i) => (
                        <motion.span
                          key={i}
                          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                          animate={{ x: c.x, y: c.y, opacity: 0, rotate: c.r }}
                          transition={{ duration: 1.1, ease: 'easeOut' }}
                          className="absolute left-1/2 top-1/3 w-2.5 h-2.5 rounded-sm"
                          style={{ background: c.c }}
                        />
                      ))}
                    {/* lid */}
                    <motion.div
                      animate={chestOpen ? { rotate: -110 } : { rotate: 0 }}
                      transition={spring}
                      style={{ transformOrigin: 'left bottom' }}
                      className="w-28 h-10 rounded-t-2xl bg-amber-600 border-4 border-amber-800 border-b-0 relative z-10"
                    >
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-4 h-3 bg-yellow-300 rounded-t" />
                    </motion.div>
                    {/* base */}
                    <div className="w-28 h-14 rounded-b-2xl bg-amber-700 border-4 border-amber-800 border-t-amber-900 grid place-items-center">
                      <span className="text-xl">{chestOpen ? '✨' : '🔒'}</span>
                    </div>
                  </motion.button>

                  {!chestOpen && (
                    <motion.button
                      type="button"
                      onClick={openChest}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-xl shadow-orange-200 transition-all active:scale-95"
                    >
                      {COPY.openChest}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gear cards (phase 2) */}
            {phase === 'treasure' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 w-full max-w-2xl">
                  {rewards.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 24, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ ...spring, delay: 0.25 + i * 0.18 }}
                      className="bg-white rounded-2xl shadow-lg p-4 flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center"
                    >
                      <span className="text-3xl">{r.icon}</span>
                      <div>
                        <div className="text-sm font-extrabold text-slate-800">{r.name}</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{r.benefit}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-xs font-bold text-slate-600 mt-4">
                  {COPY.backpack(studentName)}
                </motion.p>

                <motion.button
                  type="button"
                  onClick={() => setPhase(reduceMotion ? 'landed' : 'descent')}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className={`mt-3 font-bold text-sm px-8 py-3.5 rounded-full shadow-xl transition-all active:scale-95 text-white ${
                    ctaMorphed ? 'bg-sky-500 hover:bg-sky-600 shadow-sky-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                  }`}
                >
                  {ctaMorphed ? COPY.deploy : COPY.backpack(studentName).replace(' 🎒', '…')}
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {/* ============ PHASE 3 — parachute descent ============ */}
        {phase === 'descent' && (
          <motion.div key="descent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {/* mountains pan downward = camera lifting */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: '46vh' }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              className="absolute inset-x-0 bottom-0"
            >
              <MountainSilhouette className="w-full h-[40vh]" />
            </motion.div>

            {/* recap clouds */}
            {chapterRecap.slice(0, 3).map((line, i) => (
              <motion.div
                key={i}
                initial={{ x: i % 2 === 0 ? '-120%' : '120%', opacity: 0 }}
                animate={{ x: '0%', opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.8, ...spring }}
                className={`absolute ${i % 2 === 0 ? 'left-[6%]' : 'right-[6%]'} bg-white rounded-full px-4 py-2 shadow-lg text-[11px] sm:text-xs font-bold text-slate-600 max-w-[70vw]`}
                style={{ top: `${18 + i * 17}%` }}
              >
                ☁️ {line}
              </motion.div>
            ))}

            {/* parachute + student drifting down with sway */}
            <motion.div
              initial={{ y: '-18vh', x: 0 }}
              animate={{ y: '52vh', x: [0, 10, -10, 6, 0] }}
              transition={{ y: { duration: 4, ease: 'easeInOut' }, x: { duration: 4, ease: 'easeInOut', times: [0, 0.25, 0.55, 0.8, 1] } }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <span className="text-6xl">🪂</span>
              <span className="text-3xl -mt-2">🧒</span>
            </motion.div>
          </motion.div>
        )}

        {/* ============ LANDED ============ */}
        {phase === 'landed' && (
          <motion.div key="landed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-end pb-[8vh] px-6">
            {/* ground rises into view */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { y: 160 }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              transition={spring}
              className="absolute bottom-0 inset-x-0 h-[26vh] bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-[50%_30%]"
            />
            <div className="absolute bottom-[16vh] left-[14%] text-5xl">⛺</div>
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { y: -40 }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="absolute bottom-[15vh] left-[26%] flex flex-col items-center"
            >
              <span className="text-4xl">🪂</span>
              <span className="text-3xl -mt-1">🧒</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...spring, delay: 0.35 }}
              className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full text-center space-y-3"
            >
              <div className="text-3xl">🏕️</div>
              <h2 className="text-lg font-extrabold text-slate-800">{COPY.landedTitle(nextChapter)}</h2>
              <span className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-600 text-[11px] font-black px-3 py-1.5 rounded-full">
                {COPY.landedBadge}
              </span>
              <button
                type="button"
                onClick={onComplete}
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-full shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                {COPY.landedCta(nextChapter)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
