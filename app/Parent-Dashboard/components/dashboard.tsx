'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, SectionHeader } from './shared'
import { STATS, RECENT_ACTIVITY, CAL_EVENTS, ATTENDANCE } from '../lib/mock'
import { fmt, isCompleted, NOW } from '../lib/calendar'
import type { Child, CalEvent } from '../lib/types'

const MENTOR_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=160'
const MENTOR_NOTE = 'Great session tracking those vectors. Your homework tools are ready below! 🚀'

function StatCard({ icon: Icon, tint, value, label }: { icon: React.ElementType; tint: string; value: string; label: string }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tint}`}>
        <Icon className="size-6" />
      </span>
      <div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
      </div>
    </Card>
  )
}

const pad = (n: number) => n.toString().padStart(2, '0')

/** Live countdown to the class start hour (rolls to next day once passed). */
function useCountdown(startHour: number) {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    const target = () => {
      const now = new Date()
      const t = new Date(now)
      t.setHours(Math.floor(startHour), Math.round((startHour % 1) * 60), 0, 0)
      if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 1)
      return Math.max(0, Math.floor((t.getTime() - now.getTime()) / 1000))
    }
    setSecs(target())
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : target())), 1000)
    return () => clearInterval(id)
  }, [startHour])
  return { h: Math.floor(secs / 3600), m: Math.floor((secs % 3600) / 60), s: secs % 60 }
}

function NextClassCard({ e }: { e: CalEvent | undefined }) {
  const { h, m, s } = useCountdown(e?.start ?? 18)
  if (!e) {
    return (
      <Card className="p-6">
        <div className="text-xs font-bold uppercase tracking-wide text-orange-600">Next class</div>
        <p className="mt-4 text-sm text-slate-400">No upcoming classes scheduled.</p>
      </Card>
    )
  }
  const role = `${e.subject} Mentor`
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute bottom-6 left-0 top-6 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-500" />
      <div className="flex flex-col gap-6 pl-3 md:flex-row md:justify-between">
        {/* left: session details */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <span className="size-1.5 animate-pulse rounded-full bg-orange-500" />
            {e.date === NOW.iso ? 'Today, 16 Jun' : e.date} · {fmt(e.start)} IST
          </div>

          <div className="mt-3.5 flex items-center gap-3">
            <span className="whitespace-nowrap text-[23px] font-extrabold tracking-tight text-orange-500">{e.subject}</span>
            <span className="h-6 w-px shrink-0 bg-slate-200" />
            <span className="text-[23px] font-extrabold tracking-tight text-slate-800">{e.title}</span>
          </div>

          <div className="mt-3 inline-flex w-max items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">T-Minus</span>
            <span className="font-mono text-base font-black tracking-wider tabular-nums text-orange-600">
              {pad(h)}H : {pad(m)}M : {pad(s)}S
            </span>
          </div>

          <div className="mt-auto pt-5">
            {e.joinSoon ? (
              <a href="#" className="group inline-flex w-max items-center gap-3 rounded-full border border-orange-200 bg-orange-500 py-2.5 pl-7 pr-2.5 text-base font-bold text-white transition-all hover:bg-orange-600">
                <span>Join class</span>
                <span className="grid size-9 place-items-center rounded-full bg-white/90 text-orange-600 shadow-sm transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" />
                </span>
              </a>
            ) : (
              <button type="button" className="group inline-flex w-max cursor-default items-center gap-3 rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-7 pr-2.5 text-base font-bold text-slate-700">
                <span>Join class</span>
                <span className="grid size-9 place-items-center rounded-full bg-white/80 text-slate-600 shadow-sm">
                  <ArrowRight className="size-4" />
                </span>
              </button>
            )}
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              🔒 Unlocks 5 minutes before the class starts
            </p>
          </div>
        </div>

        {/* right: mentor message + identity */}
        <div className="flex shrink-0 flex-col items-stretch justify-start gap-2.5 md:w-[300px] md:items-end">
          <div className="rounded-2xl rounded-tr-md border border-orange-100 bg-orange-50/70 p-3.5 text-[13px] font-semibold leading-relaxed text-slate-600 md:text-right">
            {MENTOR_NOTE}
          </div>
          <div className="flex items-center gap-3.5 md:flex-row-reverse">
            <img src={MENTOR_AVATAR} alt={e.teacher} className="size-[68px] shrink-0 rounded-full border-[3px] border-orange-300 object-cover shadow-md" />
            <div className="md:text-right">
              <div className="flex items-center gap-1.5 md:flex-row-reverse">
                <span className="text-lg font-extrabold text-slate-800">{e.teacher}</span>
                <span className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[13px] font-semibold text-slate-400">{role}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AttendanceCard() {
  const a = ATTENDANCE
  return (
    <Card className="flex flex-col justify-center p-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600">
          <TrendingUp className="size-4" /> Attendance rate
        </span>
        <span className="text-2xl font-black text-emerald-700">{a.rate}%</span>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${a.rate}%` }} />
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500">{a.attended} of {a.total} classes attended this term</p>
    </Card>
  )
}

export function Dashboard({ child }: { child: Child }) {
  const nextClass = CAL_EVENTS.filter((e) => !isCompleted(e.date, e.end)).sort((x, y) => (x.date === y.date ? x.start - y.start : x.date < y.date ? -1 : 1))[0]

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Parent overview"
        title={`${child.name}'s Dashboard`}
        subtitle={`Overview of learning progress for ${child.grade} · ${child.board}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} tint="bg-orange-100 text-orange-600" value={String(STATS.classesThisMonth)} label="Total classes this month" />
        <StatCard icon={Award} tint="bg-amber-100 text-amber-600" value={String(STATS.badges)} label="Badges earned" />
        <StatCard icon={TrendingUp} tint="bg-emerald-100 text-emerald-600" value={`${ATTENDANCE.rate}%`} label="Attendance rate" />
      </div>

      <NextClassCard e={nextClass} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AttendanceCard />
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <div className="mt-4 space-y-1">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-slate-50">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-base ${a.tint}`}>{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800">{a.title}</div>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">{a.when}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
