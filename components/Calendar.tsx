'use client'

import { useApp } from '@/context/AppContext'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Base month is June 2026; the < / > arrows shift within May–July 2026.
const BASE_YEAR = 2026
const BASE_MONTH = 5 // June (0-indexed)

// "Today" for the mock — controls completed (emerald) vs upcoming (orange).
const TODAY = { year: 2026, month: 5, day: 11 }

interface Schedule {
  month: number // 0-indexed
  day: number
  topic: string
  time: string
}

const SCHEDULES: Schedule[] = [
  { month: 4, day: 12, topic: 'Algebra Basics', time: '6:00 PM' },
  { month: 4, day: 26, topic: 'Linear Equations', time: '4:30 PM' },
  { month: 5, day: 10, topic: 'Linear Equations', time: '5:00 PM' },
  { month: 5, day: 12, topic: 'Geometry', time: '5:00 PM' },
  { month: 5, day: 17, topic: 'Quadratics', time: '6:00 PM' },
  { month: 5, day: 24, topic: 'Graphing Functions', time: '6:00 PM' },
  { month: 6, day: 3, topic: 'Probability', time: '6:00 PM' },
]

function isPast(year: number, month: number, day: number) {
  if (year !== TODAY.year) return year < TODAY.year
  if (month !== TODAY.month) return month < TODAY.month
  return day < TODAY.day
}

export function Calendar() {
  const { currentMonthOffset, navigateMonth, setHoverDetail } = useApp()

  const year = BASE_YEAR
  const month = BASE_MONTH + currentMonthOffset
  const monthLabel = `${MONTH_NAMES[month]} ${year}`

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // JS getDay(): 0=Sun … 6=Sat. Convert to Monday-first index (0=Mon).
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  // Completed (past, scheduled) classes in a given week row — drives the streak.
  const rowStreak = (week: (number | null)[]) =>
    week.filter(
      (d) => d != null && SCHEDULES.some((s) => s.month === month && s.day === d) && isPast(year, month, d),
    ).length

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-bold text-slate-400 tracking-wide uppercase leading-tight">
          Class
          <br />
          Schedule
        </h3>
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="text-slate-400 hover:text-orange-500 font-black transition-colors rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            &lt;
          </button>
          <span className="text-xs font-extrabold text-slate-800 tracking-wide w-[88px] text-center">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="text-slate-400 hover:text-orange-500 font-black transition-colors rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* weekday labels + streak header */}
      <div className="flex items-center gap-1">
        <div className="flex-1 grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, index) => (
            <div key={`${label}-${index}`} className="text-center text-[10px] font-extrabold text-slate-300">
              {label}
            </div>
          ))}
        </div>
        <div className="w-12 shrink-0 text-center text-[8px] font-black tracking-widest text-slate-400 uppercase">
          Streak
        </div>
      </div>

      {/* week rows — days on the left, a streak marker aligned on the right */}
      <div className="relative flex-1 flex flex-col justify-center gap-1 mt-1">
        <div className="absolute top-0 bottom-0 right-12 w-px bg-slate-100" />
        {weeks.map((week, r) => {
          const streak = rowStreak(week)
          return (
            <div key={r} className="flex items-center gap-1">
              <div className="flex-1 grid grid-cols-7 gap-1">
                {week.map((day, ci) => {
                  if (day === null) return <div key={ci} />

                  const schedule = SCHEDULES.find((s) => s.month === month && s.day === day)
                  const isToday = year === TODAY.year && month === TODAY.month && day === TODAY.day

                  if (schedule) {
                    const past = isPast(year, month, day)
                    const bgColorClass = past
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-orange-500 hover:bg-orange-600'
                    return (
                      <div key={ci} className="relative flex justify-center calendar-node">
                        <button
                          type="button"
                          onMouseEnter={() =>
                            setHoverDetail({
                              badge: past ? 'Past Class' : 'Scheduled Class',
                              title: schedule.topic,
                              time: `${MONTH_NAMES[month]} ${day} · ${schedule.time}`,
                              meta: 'Mathematics · with Lavanya',
                              status: past ? '✅ Completed' : '📅 Upcoming live class',
                              accent: past ? 'emerald' : 'orange',
                              hint: past
                                ? 'Find the recording in Resources'
                                : 'Be on time to keep your streak!',
                            })
                          }
                          onMouseLeave={() => setHoverDetail(null)}
                          className={`w-7 h-7 rounded-full font-bold text-[11px] flex items-center justify-center text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-700 ${bgColorClass} ${
                            isToday ? 'ring-2 ring-offset-1 ring-slate-800' : ''
                          }`}
                        >
                          {day}
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div key={ci} className="flex justify-center">
                      <button
                        type="button"
                        className={`w-7 h-7 rounded-full font-bold text-[11px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-300 ${
                          isToday
                            ? 'bg-slate-800 text-white ring-2 ring-offset-1 ring-slate-300'
                            : 'text-slate-400 bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* streak marker for this week */}
              <div className="w-12 shrink-0 flex justify-center">
                {streak > 0 ? (
                  <span className="flex items-center gap-0.5 bg-orange-50 border border-orange-100 rounded-full pl-1.5 pr-2 h-6">
                    <span className="text-[13px] leading-none">🔥</span>
                    <span className="text-[11px] font-black text-orange-600">{streak}</span>
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-slate-200" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
