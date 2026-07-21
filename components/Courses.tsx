'use client'

import { useState } from 'react'

interface Video {
  id: string
  title: string
  subject: string
  duration: string
  badge?: string
  gradient: string
  emoji: string
}

const VIDEOS: Video[] = [
  { id: 'v1', title: 'Algebra in 5 minutes', subject: 'Math', duration: '5:12', badge: 'New', gradient: 'from-orange-400 to-amber-500', emoji: '➗' },
  { id: 'v2', title: 'Why the sky is blue', subject: 'Science', duration: '7:40', badge: 'New', gradient: 'from-emerald-400 to-teal-500', emoji: '🌈' },
  { id: 'v3', title: 'Master your quiz prep', subject: 'Study tips', duration: '4:05', gradient: 'from-indigo-400 to-blue-500', emoji: '🧠' },
  { id: 'v4', title: 'Linear equations, the fun way', subject: 'Math', duration: '8:22', gradient: 'from-sky-400 to-blue-500', emoji: '📈' },
  { id: 'v5', title: 'Photosynthesis explained', subject: 'Science', duration: '6:18', gradient: 'from-lime-400 to-emerald-500', emoji: '🌱' },
  { id: 'v6', title: 'Meet your Worlderly mentors', subject: 'Worlderly', duration: '3:30', gradient: 'from-fuchsia-400 to-purple-500', emoji: '✨' },
]

const UPDATES = [
  { id: 'u1', tag: 'New', color: 'bg-orange-100 text-orange-600', title: 'Summer Quiz Carnival is live!', body: 'Earn double coins on every quiz you complete this week.', time: '2h ago' },
  { id: 'u2', tag: 'Update', color: 'bg-sky-100 text-sky-600', title: 'New badges unlocked', body: 'Collect the “Streak Star” badge for a 7-day learning streak.', time: 'Yesterday' },
  { id: 'u3', tag: 'Event', color: 'bg-emerald-100 text-emerald-600', title: 'Live doubt-clearing session', body: 'Join Ms. Lavanya this Saturday, 5 PM for open Q&A.', time: '2 days ago' },
]

const SUBJECT_CHIP: Record<string, string> = {
  Math: 'bg-orange-100 text-orange-600',
  Science: 'bg-emerald-100 text-emerald-600',
  Worlderly: 'bg-fuchsia-100 text-fuchsia-600',
  'Study tips': 'bg-indigo-100 text-indigo-600',
}

export function Courses() {
  const [filter, setFilter] = useState('All')
  const subjects = ['All', 'Math', 'Science', 'Study tips', 'Worlderly']
  const visible = filter === 'All' ? VIDEOS : VIDEOS.filter((v) => v.subject === filter)
  const featured = VIDEOS[0]

  return (
    <div className="space-y-5">
      <header className="reveal">
        <span className="eyebrow text-orange-500">Watch & learn</span>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-800">Courses</h2>
        <p className="mt-0.5 text-xs text-slate-500">Fresh Worlderly videos, updates and learning shorts — all in one place.</p>
      </header>

      {/* featured */}
      <div className="reveal reveal-1 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-ambient">
        <div className={`relative flex min-h-[180px] items-end bg-gradient-to-br ${featured.gradient} p-6`}>
          <div className="absolute right-5 top-5 text-5xl opacity-40">{featured.emoji}</div>
          <button className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/30 text-2xl text-white backdrop-blur transition-transform hover:scale-110">
            <i className="fa-solid fa-play" />
          </button>
          <div className="relative text-white">
            <span className="rounded-full bg-white/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide">Featured · {featured.duration}</span>
            <h3 className="mt-2 text-2xl font-black">{featured.title}</h3>
            <p className="text-sm font-semibold text-white/85">{featured.subject}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* video grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex w-max items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            {subjects.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3.5 py-1.5 text-[11px] font-black transition-all ${filter === s ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>{s}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visible.map((v) => (
              <button key={v.id} className="reveal reveal-1 group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-ambient transition-transform hover:-translate-y-0.5">
                <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${v.gradient}`}>
                  <span className="text-4xl opacity-50">{v.emoji}</span>
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-11 place-items-center rounded-full bg-white/30 text-white backdrop-blur transition-transform group-hover:scale-110"><i className="fa-solid fa-play" /></span>
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-bold text-white">{v.duration}</span>
                  {v.badge && <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-orange-600">{v.badge}</span>}
                </div>
                <div className="p-3.5">
                  <h4 className="text-sm font-black text-slate-800">{v.title}</h4>
                  <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-black ${SUBJECT_CHIP[v.subject] ?? 'bg-slate-100 text-slate-500'}`}>{v.subject}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* updates */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-ambient">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-orange-50 text-orange-500"><i className="fa-solid fa-bullhorn" /></span>
            <h3 className="text-sm font-black text-slate-800">Worlderly updates</h3>
          </div>
          <div className="mt-4 space-y-3">
            {UPDATES.map((u) => (
              <div key={u.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${u.color}`}>{u.tag}</span>
                  <span className="text-[10px] font-semibold text-slate-400">{u.time}</span>
                </div>
                <h4 className="mt-2 text-sm font-black text-slate-800">{u.title}</h4>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
