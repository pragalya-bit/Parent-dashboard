'use client'

import { useEffect, useMemo, useState } from 'react'
import { AstronautAvatar } from '@/components/AstronautAvatar'

// ---- Learning-path nodes (gamified adventure map) ----
type Node = {
  icon: string // Font Awesome class for the small icon above the node
  label: string
  sub: string
  state: 'done' | 'active' | 'locked' | 'boss'
}
const PATH_NODES: Node[] = [
  { icon: 'fa-solid fa-video', label: 'Class', sub: 'Jun 10, 2026', state: 'done' },
  { icon: 'fa-solid fa-gamepad', label: 'Interactive activity', sub: 'Jun 11, 2026', state: 'done' },
  { icon: 'fa-solid fa-video', label: 'Join Class', sub: 'Today, 5 PM', state: 'active' },
  { icon: 'fa-solid fa-gamepad', label: 'Interactive activity', sub: 'Locked', state: 'locked' },
  { icon: 'fa-solid fa-crown', label: 'Worksheet', sub: '+200 Coins', state: 'boss' },
  { icon: 'fa-solid fa-flag-checkered', label: 'Chapter 2', sub: 'Locked', state: 'locked' },
]

const RECORDS = [
  { title: 'Term 1 Test', score: 'Score: 92%', grad: 'from-purple-500 to-fuchsia-500' },
  { title: 'Algebra WS', score: 'Score: 88%', grad: 'from-blue-500 to-cyan-500' },
  { title: 'Science Lab', score: 'Score: 95%', grad: 'from-emerald-500 to-teal-500' },
]

const TROPHIES = [
  { icon: 'fa-solid fa-bolt', label: 'Physics Ace', grad: 'from-amber-400 to-orange-500' },
  { icon: 'fa-solid fa-brain', label: 'Math Master', grad: 'from-blue-500 to-indigo-500' },
  { icon: 'fa-solid fa-trophy', label: 'Quiz Champ', grad: 'from-fuchsia-500 to-pink-500' },
]

const CONFETTI_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f43f5e']

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: (Math.random() * 2 - 1) * 260,
        y: -(Math.random() * 240 + 60),
        r: Math.random() * 540 - 270,
        c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        d: Math.random() * 0.18,
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center">
      <div className="relative w-full h-full">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="portfolio-confetti left-1/2"
            style={
              {
                background: p.c,
                animationDelay: `${p.d}s`,
                ['--cx']: `${p.x}px`,
                ['--cy']: `${p.y}px`,
                ['--cr']: `${p.r}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

export function Portfolio() {
  const [greeting, setGreeting] = useState<{ text: string; icon: string }>({
    text: 'Hello,',
    icon: 'fa-solid fa-hand',
  })
  const [claimed, setClaimed] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)

  // ---- editable portfolio fields ----
  const [editing, setEditing] = useState(false)
  const [dream, setDream] = useState('to become an aerospace engineer and build satellites.')
  const [love, setLove] = useState('playing chess, coding Python scripts, and reading sci-fi.')
  const [awards, setAwards] = useState<{ id: string; title: string; detail: string }[]>([
    { id: 'a1', title: 'School Science Fair — 1st Place', detail: '2025 · Robotics model' },
    { id: 'a2', title: 'Maths Olympiad — Gold Medal', detail: '2024 · State level' },
  ])
  const [addingAward, setAddingAward] = useState(false)

  // Goal set by the teacher in the very first class — read-only for the student.
  const FIRST_CLASS_GOAL = 'Build strong Physics & Math fundamentals and target 90%+ in the term exams.'

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting({ text: 'Good Morning,', icon: 'fa-solid fa-sun text-amber-500' })
    else if (h < 18) setGreeting({ text: 'Good Afternoon,', icon: 'fa-solid fa-cloud-sun text-amber-500' })
    else setGreeting({ text: 'Good Evening,', icon: 'fa-solid fa-moon text-indigo-400' })
  }, [])

  const claimReward = () => {
    if (claimed) return
    setClaimed(true)
    setConfettiKey((k) => k + 1)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {confettiKey > 0 && <Confetti key={confettiKey} />}

      {/* ===== 1. PROFILE ===== */}
      <section className="reveal relative overflow-hidden rounded-[2rem] bg-white p-7 md:p-9 shadow-ambient flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="absolute -top-20 -left-16 w-64 h-64 bg-fuchsia-400 rounded-full blur-[80px] opacity-25" />
        <div className="absolute -bottom-24 right-1/3 w-64 h-64 bg-amber-400 rounded-full blur-[80px] opacity-25" />
        <div className="absolute -bottom-20 -right-16 w-64 h-64 bg-blue-400 rounded-full blur-[80px] opacity-25" />

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold px-4 py-2 shadow-lg hover:bg-slate-800 transition-colors"
        >
          <i className="fa-solid fa-pen" /> Edit portfolio
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-7 w-full relative z-10">
          <div className="flex flex-col items-center gap-5 shrink-0">
            <div className="relative w-36 h-36 shrink-0 rounded-full p-1.5 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 shadow-xl group cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white">
                <AstronautAvatar className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="absolute top-2 right-3 w-5 h-5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-shirt text-amber-400" /> Customize
              </div>
            </div>

            {/* Goal discussed in the first class — set by the teacher, read-only */}
            <div className="w-44 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-center shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center justify-center gap-1">
                <i className="fa-solid fa-bullseye" /> Goal · first class
              </div>
              <p className="mt-1 text-[11px] font-semibold text-slate-600 leading-snug">{FIRST_CLASS_GOAL}</p>
              <div className="mt-1.5 text-[9px] font-bold text-indigo-400">
                <i className="fa-solid fa-chalkboard-user mr-1" />Set by your teacher
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full text-center md:text-left">
            <span className="eyebrow text-fuchsia-500 justify-center md:justify-start">Student profile</span>
            <h2 className="text-lg font-bold text-fuchsia-600 mb-1 mt-1.5 flex items-center justify-center md:justify-start gap-2">
              {greeting.text} <i className={greeting.icon} />
            </h2>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Jaikanth Chinathambi</h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-3 text-sm font-semibold">
              <span className="bg-violet-100 text-violet-700 border border-violet-200 px-4 py-1.5 rounded-full shadow-sm">Grade 10</span>
              <span className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full shadow-sm">CBSE</span>
              <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full shadow-sm">
                <i className="fa-solid fa-building-columns" /> Maharishi Vidya Mandir
              </span>
            </div>

            <div className="mt-5 space-y-2 bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-100 shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
              <p>
                <span className="font-extrabold text-indigo-600 mr-1">🎯 My dream is:</span>
                <span className="font-medium text-slate-500">{dream}</span>
              </p>
              <p>
                <span className="font-extrabold text-rose-500 mr-1">❤️ What I love doing:</span>
                <span className="font-medium text-slate-500">{love}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0 relative z-10">
          <div className="flex items-center gap-4 bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-5 rounded-[2rem] shadow-lg shadow-orange-200 justify-center text-white">
            <i className="fa-solid fa-coins text-4xl drop-shadow" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-0.5 text-amber-50">My Vault Balance</div>
              <div className="text-4xl font-black tracking-tight">5,860</div>
            </div>
          </div>

          <button
            type="button"
            onClick={claimReward}
            className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-sm transition-all group relative w-full text-left ${
              claimed
                ? 'bg-green-50 border-2 border-green-200 pointer-events-none'
                : 'bg-white border-2 border-dashed border-violet-300 hover:bg-violet-50 hover:border-violet-400'
            }`}
          >
            {!claimed && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white animate-bounce">
                1
              </div>
            )}
            {claimed ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-2xl shrink-0">
                  <i className="fa-solid fa-check" />
                </div>
                <div>
                  <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-0.5">Daily Streak</div>
                  <div className="text-sm font-black text-green-700">+50 Coins Added!</div>
                </div>
              </>
            ) : (
              <>
                <i className="fa-solid fa-box-archive text-3xl text-violet-400 group-hover:rotate-12 transition-transform" />
                <div>
                  <div className="text-[10px] text-violet-500 font-bold uppercase tracking-widest mb-0.5">Daily Streak</div>
                  <div className="text-sm font-black text-violet-700">Claim Mystery Box</div>
                </div>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ===== 2. LEARNING PATH ===== */}
      <section className="reveal reveal-1 rounded-[2rem] bg-white p-7 md:p-9 shadow-ambient overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <i className="fa-solid fa-map-location-dot text-blue-500" /> My Learning Path
          </h2>
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-200">
            <i className="fa-solid fa-fire" /> 12 streaks earned
          </div>
        </div>

        <div className="overflow-x-auto pb-8 pt-6 relative w-full" style={{ scrollbarWidth: 'none' }}>
          <div className="relative min-w-[900px] px-8 flex items-start justify-between">
            {/* connecting line runs through the (uniform) circle row at y = 28 + 28 */}
            <div
              className="absolute left-16 right-16 h-1.5 z-0"
              style={{ top: '56px', transform: 'translateY(-50%)', backgroundImage: 'linear-gradient(to right, #CBD5E1 50%, transparent 50%)', backgroundSize: '20px 100%' }}
            />
            <div
              className="absolute left-16 w-[35%] h-1.5 bg-gradient-to-r from-blue-500 to-violet-500 z-0 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
              style={{ top: '56px', transform: 'translateY(-50%)' }}
            />

            {PATH_NODES.map((n, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 z-10 w-24 ${n.state === 'locked' ? 'opacity-50' : ''} relative`}>
                {/* icon row (fixed height so circles align) */}
                <div className="h-7 flex items-end justify-center relative">
                  {n.state === 'active' && <i className="fa-solid fa-caret-down text-blue-500 text-2xl absolute -top-7 animate-bounce" />}
                  <i className={`${n.icon} text-xl ${n.state === 'active' ? 'text-blue-500' : n.state === 'boss' ? 'text-amber-400 drop-shadow' : 'text-slate-400'}`} />
                </div>

                {/* circle row (fixed height so labels align uniformly) */}
                <div className="h-14 flex items-center justify-center">
                  {n.state === 'done' && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center text-lg shadow-lg border-4 border-white transition-transform hover:scale-110">
                      <i className="fa-solid fa-check" />
                    </div>
                  )}
                  {n.state === 'active' && (
                    <div className="w-14 h-14 rounded-full bg-white text-blue-500 border-4 border-blue-500 flex items-center justify-center text-xl shadow-[0_0_22px_rgba(59,130,246,0.4)] relative cursor-pointer group">
                      <div className="absolute w-full h-full bg-blue-500 rounded-full opacity-20 animate-ping" />
                      <i className="fa-solid fa-play ml-1 group-hover:scale-125 transition-transform" />
                    </div>
                  )}
                  {n.state === 'boss' && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 border-4 border-white flex items-center justify-center text-white shadow-md">
                      <i className="fa-solid fa-lock text-sm" />
                    </div>
                  )}
                  {n.state === 'locked' && (
                    <div className="w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-lock text-sm" />
                    </div>
                  )}
                </div>

                <span className={`text-sm font-bold ${n.state === 'active' ? 'text-blue-600 font-black' : 'text-slate-600'}`}>
                  {n.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    n.state === 'active'
                      ? 'text-blue-600 bg-blue-50 border border-blue-100'
                      : n.state === 'boss'
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-400 bg-slate-100'
                  }`}
                >
                  {n.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. RECORDS & TROPHIES ===== */}
      <div className="reveal reveal-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-[2rem] bg-white p-7 md:p-9 shadow-[0_10px_40px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <i className="fa-regular fa-folder-open text-purple-500" /> My Achievements
            </h2>
            <button type="button" className="text-xs font-bold text-blue-500 hover:text-blue-700">
              View All
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
            {RECORDS.map((r) => (
              <div
                key={r.title}
                className="min-w-[130px] h-44 rounded-2xl bg-white border border-slate-100 hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 shadow-[0_6px_24px_rgb(0,0,0,0.06)] group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.grad} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  <i className="fa-solid fa-file-pdf" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700 block">{r.title}</span>
                  <span className="text-[10px] text-slate-400">{r.score}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 md:p-9 shadow-[0_10px_40px_rgb(0,0,0,0.05)]">
          <h2 className="text-xl font-black text-slate-800 mb-7 flex items-center gap-3">
            <i className="fa-solid fa-medal text-amber-500" /> My Badges
          </h2>
          <div className="flex flex-wrap gap-5">
            {TROPHIES.map((t) => (
              <div key={t.label} className="relative group cursor-pointer">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-3xl text-white drop-shadow group-hover:scale-110 transition-transform shadow-lg border-4 border-white`}>
                  <i className={t.icon} />
                </div>
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {t.label}
                </div>
              </div>
            ))}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 bg-slate-100 flex items-center justify-center text-slate-300 opacity-70 text-xl">
              <i className="fa-solid fa-lock" />
            </div>
          </div>
        </section>
      </div>

      {/* ===== SCHOOL AWARDS ===== */}
      <section className="reveal reveal-2 rounded-[2rem] bg-white p-7 md:p-9 shadow-[0_10px_40px_rgb(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <i className="fa-solid fa-award text-amber-500" /> School Awards
          </h2>
          <button
            type="button"
            onClick={() => setAddingAward(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white text-xs font-bold px-4 py-2 hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200"
          >
            <i className="fa-solid fa-plus" /> Add award
          </button>
        </div>
        {awards.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No school awards yet — add your first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {awards.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                  <i className="fa-solid fa-trophy" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-slate-800">{a.title}</div>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">{a.detail}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAwards((prev) => prev.filter((x) => x.id !== a.id))}
                  className="w-8 h-8 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                  title="Remove award"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== 4. MENTORS & KUDOS ===== */}
      <div className="reveal reveal-3 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-[2rem] bg-white p-7 md:p-9 shadow-[0_10px_40px_rgb(0,0,0,0.05)]">
          <h2 className="text-xl font-black text-slate-800 mb-7 flex items-center gap-3">
            <i className="fa-solid fa-chalkboard-user text-emerald-500" /> My Mentors
          </h2>
          <div className="flex flex-wrap gap-8">
            {[
              { initials: 'L', name: 'Lavanya', subject: 'Mathematics', grad: 'from-emerald-400 to-teal-500' },
              { initials: 'K', name: 'Karthik', subject: 'Physics', grad: 'from-indigo-400 to-blue-500' },
            ].map((m) => (
              <div key={m.initials} className="flex flex-col items-center gap-2.5 w-28 group cursor-pointer">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${m.grad} text-white shadow-md flex items-center justify-center font-black text-lg border-2 border-white group-hover:-translate-y-1 transition-transform`}>
                  {m.initials}
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-800 leading-tight">{m.name}</div>
                  <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{m.subject}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 p-7 md:p-9 shadow-[0_10px_40px_rgb(16,185,129,0.25)] text-white">
          <i className="fa-solid fa-quote-right absolute -right-6 -top-6 text-9xl text-white/10 -rotate-12" />
          <h2 className="text-xl font-black mb-5 flex items-center gap-3 relative z-10">
            <i className="fa-solid fa-star text-amber-300" /> Kudos Wall
          </h2>
          <div className="pr-12 relative z-10">
            <p className="text-lg md:text-xl font-medium leading-relaxed italic mb-5">
              &ldquo;Jaikanth showed incredible focus solving the advanced trigonometry equations today. His analytical skills are growing fast!&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/25 font-bold text-xs flex items-center justify-center">ML</div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-50">Mentor Lavanya</div>
            </div>
          </div>
          <button
            type="button"
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white hover:scale-110 transition-all z-10 text-lg"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </section>
      </div>

      {/* ===== 5. MY SQUAD (REFERRAL) ===== */}
      <section className="reveal reveal-4 relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-100 via-indigo-50 to-blue-100 border-2 border-dashed border-indigo-300 p-7 md:p-9 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-indigo-400 transition-colors">
        <i className="fa-solid fa-gift absolute -left-8 -bottom-10 text-[10rem] text-indigo-500/10 group-hover:scale-110 transition-transform duration-500" />

        <div className="flex flex-col items-center md:items-start gap-5 relative z-10">
          <h2 className="text-xl font-black text-indigo-900 flex items-center gap-3">
            <i className="fa-solid fa-user-group text-indigo-500" /> My Friends
          </h2>
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white border-2 border-white shadow-sm flex items-center justify-center font-bold -mr-3 relative z-20">AS</div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500 text-white border-2 border-white shadow-sm flex items-center justify-center font-bold relative z-10">VK</div>
            <button
              type="button"
              className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-400 bg-white flex items-center justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white cursor-pointer transition-all ml-4 relative text-xl"
            >
              <i className="fa-solid fa-plus" />
              <span className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20" />
            </button>
          </div>
        </div>

        <div className="text-center md:text-right relative z-10">
          <h3 className="text-2xl md:text-3xl font-black text-indigo-900 mb-2">Invite a Friend</h3>
          <p className="text-indigo-700 font-medium text-lg">
            Earn{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-lg font-black shadow-sm mx-1 inline-block animate-pulse">
              500 Coins
            </span>{' '}
            instantly!
          </p>
        </div>
      </section>

      {editing && (
        <PortfolioEditModal
          dream={dream}
          love={love}
          onClose={() => setEditing(false)}
          onSave={(d, l) => { setDream(d); setLove(l); setEditing(false) }}
        />
      )}
      {addingAward && (
        <AddAwardModal
          onClose={() => setAddingAward(false)}
          onAdd={(title, detail) => { setAwards((prev) => [...prev, { id: `a-${Date.now()}`, title, detail }]); setAddingAward(false) }}
        />
      )}
    </div>
  )
}

function PortfolioEditModal({ dream, love, onClose, onSave }: { dream: string; love: string; onClose: () => void; onSave: (dream: string, love: string) => void }) {
  const [d, setD] = useState(dream)
  const [l, setL] = useState(love)
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:py-10" onClick={onClose}>
      <div className="my-auto w-full max-w-md rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-slate-900"><i className="fa-solid fa-pen text-fuchsia-500 mr-2" />Edit portfolio</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-xl text-slate-400 hover:bg-slate-100"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-500">🎯 My dream is</span>
            <textarea value={d} onChange={(e) => setD(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-fuchsia-200" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-500">❤️ What I love doing</span>
            <textarea value={l} onChange={(e) => setL(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-fuchsia-200" />
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={() => onSave(d.trim() || dream, l.trim() || love)} className="flex-1 rounded-full bg-fuchsia-500 text-white text-sm font-bold py-2.5 hover:bg-fuchsia-600 transition-colors">Save changes</button>
            <button onClick={onClose} className="rounded-full border border-slate-200 text-slate-500 text-sm font-bold px-4 py-2.5 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddAwardModal({ onClose, onAdd }: { onClose: () => void; onAdd: (title: string, detail: string) => void }) {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [err, setErr] = useState('')
  const input = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-200'
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 sm:py-10" onClick={onClose}>
      <div className="my-auto w-full max-w-md rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="text-xl font-black text-slate-900"><i className="fa-solid fa-award text-amber-500 mr-2" />Add school award</h2>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-xl text-slate-400 hover:bg-slate-100"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-500">Award title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. School Science Fair — 1st Place" className={input} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-500">Details</span>
            <input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="e.g. 2025 · Robotics model" className={input} />
          </label>
          {err && <p className="text-xs font-bold text-rose-500">{err}</p>}
          <div className="flex gap-2 pt-1">
            <button onClick={() => { if (!title.trim()) return setErr('Add an award title'); onAdd(title.trim(), detail.trim() || '—') }} className="flex-1 rounded-full bg-amber-500 text-white text-sm font-bold py-2.5 hover:bg-amber-600 transition-colors">Add award</button>
            <button onClick={onClose} className="rounded-full border border-slate-200 text-slate-500 text-sm font-bold px-4 py-2.5 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
