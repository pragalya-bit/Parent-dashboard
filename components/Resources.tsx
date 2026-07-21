'use client'

import { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'

interface Session {
  id: string
  subject: string
  topic: string
  date: string
  day: string
  time: string
  /** journey chapter (1-based) this maps to, or null for standalone past classes */
  chapter: number | null
}

// Math sessions mirror the journey-map chapters; Science is a standalone past class.
const SESSIONS: Session[] = [
  { id: 'm1', subject: 'Math', topic: 'Algebra Basics', date: 'June 5', day: 'Friday', time: '6:00 – 7:00 PM', chapter: 1 },
  { id: 'm2', subject: 'Math', topic: 'Linear Equations', date: 'June 10', day: 'Wednesday', time: '5:00 – 6:00 PM', chapter: 2 },
  { id: 'm3', subject: 'Math', topic: 'Quadratics', date: 'June 17', day: 'Wednesday', time: '6:00 – 7:00 PM', chapter: 3 },
  { id: 's1', subject: 'Science', topic: 'Photosynthesis', date: 'June 8', day: 'Monday', time: '4:30 – 5:30 PM', chapter: null },
]

const RESOURCES = [
  { key: 'preboost', label: 'Pre-boost', icon: '🚀', color: 'indigo' },
  { key: 'recording', label: 'Class Recording', icon: '▶', color: 'blue' },
  { key: 'interactive', label: 'Interactive activity', icon: '🎮', color: 'amber' },
  { key: 'notes', label: 'Class Notes', icon: '📄', color: 'emerald' },
  { key: 'worksheet', label: 'Worksheet', icon: '📐', color: 'sky' },
  { key: 'quiz', label: 'Quiz', icon: '🧠', color: 'purple' },
] as const

const COLOR: Record<string, string> = {
  indigo: 'text-indigo-600 bg-indigo-50/60 border-indigo-100 hover:bg-indigo-50',
  blue: 'text-blue-600 bg-blue-50/60 border-blue-100 hover:bg-blue-50',
  amber: 'text-amber-600 bg-amber-50/60 border-amber-100 hover:bg-amber-50',
  emerald: 'text-emerald-600 bg-emerald-50/60 border-emerald-100 hover:bg-emerald-50',
  sky: 'text-sky-600 bg-sky-50/60 border-sky-100 hover:bg-sky-50',
  purple: 'text-purple-600 bg-purple-50/60 border-purple-100 hover:bg-purple-50',
}

const SUBJECT_CHIP: Record<string, string> = {
  Math: 'bg-orange-100 text-orange-600',
  Science: 'bg-emerald-100 text-emerald-600',
}

export function Resources() {
  const { secureInAppView, studentStep } = useApp()
  const [subject, setSubject] = useState('All')

  const subjects = useMemo(() => ['All', ...Array.from(new Set(SESSIONS.map((s) => s.subject)))], [])

  // A class only appears here once it's completed on the journey map.
  const classIndex = (chapter: number) => (chapter - 1) * 4
  const isCompleted = (s: Session) => s.chapter == null || studentStep > classIndex(s.chapter)
  const nodeDone = (chapter: number, offset: number) => studentStep > classIndex(chapter) + offset

  const visible = SESSIONS.filter(
    (s) => isCompleted(s) && (subject === 'All' || s.subject === subject),
  )

  return (
    <div className="space-y-5">
      <header className="reveal">
        <span className="eyebrow text-orange-500">Your archive</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Learning Resources</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your past classes, neatly organised — recording, notes, worksheet and quiz in one place.
        </p>
      </header>

      {/* Subject toggle */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-max">
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSubject(s)}
            className={`text-[11px] font-black px-4 py-1.5 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 ${
              subject === s ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl px-5 py-10 text-center">
          <div className="text-3xl mb-2">⛰️</div>
          <p className="text-xs font-bold text-slate-500">
            No completed classes here yet — finish a class on your{' '}
            <span className="text-orange-600">Journey Map</span> and its resources will appear.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((session) => {
            const doneMap: Record<string, boolean> =
              session.chapter == null
                ? {}
                : {
                    recording: nodeDone(session.chapter, 0),
                    interactive: nodeDone(session.chapter, 1),
                    worksheet: nodeDone(session.chapter, 2),
                    quiz: nodeDone(session.chapter, 3),
                  }

            return (
              <div
                key={session.id}
                className="reveal reveal-1 bg-white border border-slate-100 rounded-2xl shadow-ambient overflow-hidden transition-colors"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-800">{session.topic}</h3>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            SUBJECT_CHIP[session.subject] ?? 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {session.subject}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    ● Completed
                  </span>
                </div>

                {/* Resource grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {RESOURCES.map((r) => {
                    const done = doneMap[r.key]
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => secureInAppView(r.label)}
                        className={`relative flex items-center gap-2 border px-3 py-3 rounded-xl font-bold text-xs transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1 ${COLOR[r.color]}`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span className="text-left leading-tight">{r.label}</span>
                        {done && (
                          <span className="absolute top-1.5 right-1.5 text-emerald-500 text-[10px] font-black">
                            ✓
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
