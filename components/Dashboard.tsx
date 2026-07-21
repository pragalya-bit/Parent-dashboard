'use client'

import { Calendar } from '@/components/Calendar'
import { JourneyHub } from '@/components/JourneyHub'
import { LiveSessionCard } from '@/components/LiveSessionCard'
import { useApp } from '@/context/AppContext'

export function Dashboard() {
  const { studentGoal } = useApp()

  return (
    <div className="space-y-6 block">
      <header className="reveal flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="eyebrow text-orange-500">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Today’s quest
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">Hi, Jhanvi!</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ready for your next learning quest? Here is your schedule for today.
          </p>
        </div>

        <div className="md:w-[320px] shrink-0 flex flex-col gap-3">
          {/* My goal — student-set, editable from Settings */}
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 shadow-ambient">
            <span className="eyebrow text-amber-600">🎯 My goal</span>
            <p className="mt-1.5 text-lg font-bold text-slate-700 leading-snug">{studentGoal}</p>
          </div>

          {/* Attendance rate */}
          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4 shadow-ambient">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-emerald-600">📅 Attendance rate</span>
              <span className="text-lg font-black text-emerald-700">96%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '96%' }} />
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-emerald-700/70">23 of 24 classes attended this term</p>
          </div>
        </div>
      </header>

      <div className="reveal reveal-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <LiveSessionCard />

        <div className="lg:col-span-4 h-[250px] bg-white border border-slate-100 rounded-3xl p-4 shadow-ambient flex items-stretch relative overflow-hidden transition-colors duration-300">
          <Calendar />
        </div>
      </div>

      <div className="reveal reveal-2">
        <JourneyHub />
      </div>
    </div>
  )
}
