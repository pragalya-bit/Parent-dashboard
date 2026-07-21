'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  Lock,
  Video,
  X,
  CheckCircle2,
  Clock,
  Play,
  Eye,
  Star,
  Save,
  User,
  GraduationCap,
  Repeat,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, SectionHeader, Tabs } from './shared'
import { CAL_EVENTS, AVAIL_BANDS, CALENDAR_ENTRIES } from '../lib/mock'
import {
  buildWeek,
  weekLabel,
  monthLabel,
  fmt,
  isCompleted,
  CAL_HOURS,
  HOUR_PX,
  HOURS,
  TIME_OPTIONS,
  DAY_KEYS,
  type DayKey,
  type CalDay,
} from '../lib/calendar'
import type { Child, CalEvent, AvailBand, CalendarEntry } from '../lib/types'

type Tab = 'classes' | 'calendar' | 'availability'
type Availability = Record<DayKey, AvailBand[]>

const GRID_H = (CAL_HOURS.end - CAL_HOURS.start) * HOUR_PX

const CAL_TINT: Record<CalendarEntry['type'], string> = {
  exam: 'bg-red-50 text-red-600',
  holiday: 'bg-sky-50 text-sky-600',
  vacation: 'bg-violet-50 text-violet-600',
}

// months a parent can apply recurring availability to
const MONTH_TAGS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const clone = (a: Availability): Availability =>
  Object.fromEntries(DAY_KEYS.map((k) => [k, [...a[k]]])) as Availability

/** The school-calendar entry (leave/holiday/exam) covering a given iso day, if any. */
function leaveOn(iso: string, entries: CalendarEntry[]): CalendarEntry | undefined {
  return entries.find((e) => e.start && iso >= e.start && iso <= (e.end || e.start))
}

// ---------------- Week calendar (All Classes) ----------------
function EventBlock({ e, completed, onClick }: { e: CalEvent; completed: boolean; onClick: () => void }) {
  const top = (e.start - CAL_HOURS.start) * HOUR_PX + 2
  const height = (e.end - e.start) * HOUR_PX - 4
  return (
    <button
      onClick={onClick}
      className={cn(
        'group absolute inset-x-1.5 flex flex-col overflow-hidden rounded-lg border-2 border-dotted border-white/80 px-2 py-1.5 text-left text-white shadow-sm transition-transform hover:z-20 hover:scale-[1.02]',
        completed ? 'bg-slate-400' : 'bg-orange-500',
      )}
      style={{ top, height }}
    >
      <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-white/25">
        {completed ? <CheckCircle2 className="size-2.5" /> : <Clock className="size-2.5" />}
      </span>
      <div className="truncate pr-5 text-[0.72rem] font-bold leading-tight">{e.title}</div>
      <div className="truncate text-[0.6rem] opacity-90">{fmt(e.start)} – {fmt(e.end)}</div>
      <div className="mt-0.5 truncate text-[0.62rem] font-semibold leading-tight opacity-95">{e.teacher}</div>
      <div className="truncate text-[0.58rem] opacity-90">{e.subject} · {e.board}</div>
    </button>
  )
}

function DayColumn({ day, events, bands, leave, onEvent }: { day: CalDay; events: CalEvent[]; bands: AvailBand[]; leave?: CalendarEntry; onEvent: (e: CalEvent) => void }) {
  return (
    <div className={cn('relative border-l border-slate-50', day.today && 'bg-orange-50/20')} style={{ height: GRID_H }}>
      {/* availability green base */}
      {bands.map((b, i) => (
        <div key={i} className="absolute inset-x-0 bg-emerald-100/70" style={{ top: (b.start - CAL_HOURS.start) * HOUR_PX, height: (b.end - b.start) * HOUR_PX }} />
      ))}
      {/* hour lines */}
      {HOURS.map((h) => (
        <div key={h} className="absolute inset-x-0 border-t border-slate-100/70" style={{ top: (h - CAL_HOURS.start) * HOUR_PX }} />
      ))}
      {events.map((e) => (
        <EventBlock key={e.id} e={e} completed={isCompleted(e.date, e.end)} onClick={() => onEvent(e)} />
      ))}
      {/* school-calendar leave → grey shade over the whole day */}
      {leave && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center bg-slate-400/45 backdrop-grayscale">
          <span className="mt-2 rounded-full bg-slate-700/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {leave.type} · {leave.title}
          </span>
        </div>
      )}
    </div>
  )
}

function WeekCalendar({ availability, entries }: { availability: Availability; entries: CalendarEntry[] }) {
  const [offset, setOffset] = useState(0)
  const [active, setActive] = useState<CalEvent | null>(null)
  const week = useMemo(() => buildWeek(offset), [offset])
  const weekIsos = useMemo(() => new Set(week.map((d) => d.iso)), [week])
  const events = useMemo(() => CAL_EVENTS.filter((e) => weekIsos.has(e.date)), [weekIsos])
  const eventsFor = (iso: string) => events.filter((e) => e.date === iso)

  // month options for the picker (roams a range of weeks, deduped by month label)
  const monthOptions = useMemo(() => {
    const seen = new Set<string>()
    const opts: { label: string; offset: number }[] = []
    for (let o = -8; o <= 10; o++) {
      const l = monthLabel(o)
      if (!seen.has(l)) { seen.add(l); opts.push({ label: l, offset: o }) }
    }
    return opts
  }, [])
  const currentMonth = monthLabel(offset)

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <select
              value={monthOptions.some((o) => o.label === currentMonth) ? currentMonth : ''}
              onChange={(e) => {
                const opt = monthOptions.find((o) => o.label === e.target.value)
                if (opt) setOffset(opt.offset)
              }}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-extrabold text-slate-800 outline-none focus:border-orange-300"
            >
              {!monthOptions.some((o) => o.label === currentMonth) && <option value="">{currentMonth}</option>}
              {monthOptions.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
            </select>
            <span className="hidden text-xs font-medium text-slate-400 sm:inline">{events.length} classes · tap a class for details</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOffset((o) => o - 1)} className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-orange-600"><ChevronLeft className="size-4" /></button>
            <button onClick={() => setOffset(0)} title="Jump to current week" className="rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-extrabold text-slate-800 transition-colors hover:text-orange-600">{weekLabel(offset)}</button>
            <button onClick={() => setOffset((o) => o + 1)} className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-orange-600"><ChevronRight className="size-4" /></button>
          </div>
        </div>

        {/* legend */}
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-emerald-100" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-orange-500" /> Upcoming class</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-slate-400" /> Completed class</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-slate-400/60" /> Leave / holiday</span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid border-b border-slate-100 bg-white" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              <div />
              {week.map((d) => (
                <div key={d.iso} className="border-l border-slate-50 py-3 text-center">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-400">{d.day}</div>
                  <div className={cn('mx-auto mt-1 flex size-9 items-center justify-center rounded-full text-lg font-extrabold', d.today ? 'bg-orange-500 text-white' : leaveOn(d.iso, entries) ? 'bg-slate-200 text-slate-500' : 'text-slate-700')}>{d.date}</div>
                </div>
              ))}
            </div>

            <div className="grid" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
              <div className="relative" style={{ height: GRID_H }}>
                {HOURS.map((h) => (
                  <div key={h} className="absolute right-2 -translate-y-1/2 text-[0.65rem] font-semibold text-slate-400" style={{ top: (h - CAL_HOURS.start) * HOUR_PX }}>{fmt(h)}</div>
                ))}
              </div>
              {week.map((d) => (
                <DayColumn key={d.iso} day={d} events={eventsFor(d.iso)} bands={availability[d.key]} leave={leaveOn(d.iso, entries)} onEvent={setActive} />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {active && <EventModal e={active} completed={isCompleted(active.date, active.end)} onClose={() => setActive(null)} />}
    </>
  )
}

// ---------------- Event modal (completed vs upcoming) ----------------
function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn('size-4', i <= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
      ))}
    </span>
  )
}

function EventModal({ e, completed, onClose }: { e: CalEvent; completed: boolean; onClose: () => void }) {
  const [rescheduling, setRescheduling] = useState(false)
  const [requested, setRequested] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [time, setTime] = useState(TIME_OPTIONS[8].value)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:py-10" onClick={onClose}>
      <div className="my-auto w-full max-w-lg rounded-3xl bg-white shadow-xl" onClick={(ev) => ev.stopPropagation()}>
        {/* header */}
        <div className={cn('flex items-start justify-between rounded-t-3xl p-5 text-white', completed ? 'bg-slate-500' : 'bg-orange-500')}>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">
              {completed ? <><CheckCircle2 className="size-3" /> Completed</> : <><Clock className="size-3" /> Upcoming</>}
            </span>
            <h3 className="mt-2 text-xl font-black">{e.title}</h3>
            <p className="text-sm text-white/85">{e.subject} · {e.board}</p>
            <p className="text-sm font-semibold text-white/90">{fmt(e.start)} – {fmt(e.end)}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold"><User className="size-3" /> Teacher · {e.teacher}</p>
          </div>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg text-white/80 hover:bg-white/15"><X className="size-4" /></button>
        </div>

        <div className="space-y-5 p-5">
          {completed ? (
            <>
              {/* recordings */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><Video className="size-4 text-orange-500" /> Class recordings</h4>
                <div className="space-y-2">
                  {(e.recordings ?? []).map((r, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-orange-50 text-orange-600"><Play className="size-4" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-slate-800">{r.title}</div>
                        <div className="text-xs font-medium text-slate-400">{r.duration}</div>
                      </div>
                      <a href="#" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"><Eye className="size-3.5" /> View</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* student feedback */}
              {e.feedback && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><Star className="size-4 text-amber-500" /> Student's feedback</h4>
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                    <Stars n={e.feedback.rating} />
                    <p className="mt-2 text-sm text-slate-600">“{e.feedback.comment}”</p>
                  </div>
                </div>
              )}

              {/* teacher feedback */}
              {e.teacherFeedback && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800"><GraduationCap className="size-4 text-sky-500" /> Teacher's feedback</h4>
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">{e.teacher}</span>
                      <Stars n={e.teacherFeedback.rating} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">“{e.teacherFeedback.comment}”</p>
                  </div>
                </div>
              )}
            </>
          ) : requested ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="size-6" /></span>
              <p className="text-sm font-bold text-slate-800">Reschedule request sent</p>
              <p className="text-xs text-slate-400">Your co-ordinator will confirm the new time shortly.</p>
            </div>
          ) : rescheduling ? (
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-800">Request a new time</h4>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                <User className="size-3.5 text-slate-400" /> Teacher · {e.teacher}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Preferred date</label>
                  <input type="date" value={newDate} onChange={(ev) => setNewDate(ev.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Preferred time</label>
                  <select value={time} onChange={(ev) => setTime(Number(ev.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
                    {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Reason (optional)</label>
                <textarea value={note} onChange={(ev) => setNote(ev.target.value)} rows={2} placeholder="Let the co-ordinator know why…" className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setRescheduling(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Back</button>
                <button onClick={() => setRequested(true)} className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600">Send request</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">This class hasn't started yet. You can join when it's live, or request a different time.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {e.joinSoon ? (
                  <a href="#" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600">
                    <Video className="size-4" /> Join class
                  </a>
                ) : (
                  <span className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-bold text-slate-400" title="Activates 5 minutes before the class">
                    <Lock className="size-4" /> Join opens 5 min before
                  </span>
                )}
                <button onClick={() => setRescheduling(true)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                  <Clock className="size-4" /> Reschedule request
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------- School calendar tab ----------------
function CalendarTab({ child, entries, setEntries }: { child: Child; entries: CalendarEntry[]; setEntries: (u: (p: CalendarEntry[]) => CalendarEntry[]) => void }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', start: '', end: '', type: 'exam' as CalendarEntry['type'] })

  const save = () => {
    if (!form.title.trim()) return
    setEntries((prev) => [...prev, { id: `ce${Date.now()}`, title: form.title, start: form.start, end: form.end || form.start, type: form.type }])
    setForm({ title: '', start: '', end: '', type: 'exam' })
    setAdding(false)
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{child.name}'s School Calendar</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Submit exam, holiday and vacation dates — these grey out those days in All Classes.</p>
        </div>
        <button onClick={() => setAdding((a) => !a)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
          <Plus className="size-4" /> Add entry
        </button>
      </div>

      {adding && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Mid-year exam" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">From date</label>
            <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">To date</label>
            <input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CalendarEntry['type'] })} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
              <option value="exam">Exam</option>
              <option value="holiday">Holiday</option>
              <option value="vacation">Vacation</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={save} className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600">Save</button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2.5">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-400"><CalendarIcon className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-800">{e.title}</div>
              <div className="text-xs font-medium text-slate-400">{e.start === e.end ? e.start : `${e.start} → ${e.end}`}</div>
            </div>
            <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize', CAL_TINT[e.type])}>{e.type}</span>
            <button onClick={() => setEntries((prev) => prev.filter((x) => x.id !== e.id))} className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ---------------- Availability tab (editable, with date + recurring months) ----------------
function AvailabilityTab({ availability, setAvailability }: { availability: Availability; setAvailability: (a: Availability) => void }) {
  const [day, setDay] = useState<DayKey>('Mon')
  const [date, setDate] = useState('')
  const [start, setStart] = useState(TIME_OPTIONS[2].value)
  const [end, setEnd] = useState(TIME_OPTIONS[6].value)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(false)
  const [recurring, setRecurring] = useState(true)
  const [months, setMonths] = useState<string[]>(['Jun', 'Jul'])

  const addSlot = () => {
    if (end <= start) {
      setErr('End time must be after start time.')
      return
    }
    setErr('')
    setSaved(false)
    const next = clone(availability)
    next[day] = [...next[day], { start, end, date: date || undefined }].sort((a, b) => a.start - b.start)
    setAvailability(next)
    setDate('')
  }

  const removeSlot = (d: DayKey, i: number) => {
    const next = clone(availability)
    next[d] = next[d].filter((_, idx) => idx !== i)
    setAvailability(next)
    setSaved(false)
  }

  const toggleMonth = (mo: string) => {
    setSaved(false)
    setMonths((prev) => (prev.includes(mo) ? prev.filter((x) => x !== mo) : [...prev, mo]))
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-slate-900">Weekly Availability</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">Add the times your child is free so the co-ordinator can schedule classes. These show as the green base on the calendar.</p>

      {/* add slot */}
      <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Day</label>
          <select value={day} onChange={(e) => setDay(e.target.value as DayKey)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
            {DAY_KEYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Date (optional)</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">From</label>
          <select value={start} onChange={(e) => setStart(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
            {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">To</label>
          <select value={end} onChange={(e) => setEnd(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
            {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={addSlot} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-900"><Plus className="size-4" /> Add slot</button>
        </div>
      </div>
      {err && <p className="mt-2 text-xs font-semibold text-red-500">{err}</p>}

      {/* grid of days */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {DAY_KEYS.map((d) => (
          <div key={d} className="rounded-2xl border border-slate-100 p-3">
            <div className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">{d}</div>
            <div className="space-y-2">
              {availability[d].length === 0 ? (
                <div className="rounded-lg bg-slate-50 py-3 text-center text-[11px] font-semibold text-slate-300">—</div>
              ) : (
                availability[d].map((b, i) => (
                  <div key={i} className="rounded-lg bg-emerald-50 px-2 py-1.5 text-[11px] font-bold text-emerald-700">
                    <div className="flex items-center justify-between">
                      <span>{fmt(b.start)} – {fmt(b.end)}</span>
                      <button onClick={() => removeSlot(d, i)} className="grid size-4 place-items-center rounded text-emerald-500 hover:bg-emerald-100 hover:text-red-500"><X className="size-3" /></button>
                    </div>
                    {b.date && <div className="mt-0.5 text-[10px] font-semibold text-emerald-500">{b.date}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* recurring / continue slots across months */}
      <div className="mt-5 rounded-2xl border border-slate-100 p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', recurring ? 'bg-orange-500' : 'bg-slate-300')}>
            <input type="checkbox" checked={recurring} onChange={(e) => { setRecurring(e.target.checked); setSaved(false) }} className="sr-only" />
            <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', recurring ? 'left-[22px]' : 'left-0.5')} />
          </span>
          <span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800"><Repeat className="size-4 text-orange-500" /> Continue these time slots</span>
            <span className="block text-xs text-muted-foreground">Repeat this weekly availability across the months you choose.</span>
          </span>
        </label>

        {recurring && (
          <div className="mt-3">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">Apply to months</div>
            <div className="flex flex-wrap gap-2">
              {MONTH_TAGS.map((mo) => (
                <button
                  key={mo}
                  onClick={() => toggleMonth(mo)}
                  className={cn('rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors', months.includes(mo) ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}
                >
                  {mo} 2026
                </button>
              ))}
            </div>
            {months.length > 0 && <p className="mt-2 text-xs font-semibold text-emerald-600">Slots will continue for {months.join(', ')} 2026.</p>}
          </div>
        )}
      </div>

      {/* save changes */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600">
          <Save className="size-4" /> Save changes
        </button>
        {saved && <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600"><CheckCircle2 className="size-4" /> Availability saved</span>}
      </div>
    </Card>
  )
}

// ---------------- Root ----------------
export function Schedule({ child }: { child: Child }) {
  const [tab, setTab] = useState<Tab>('classes')
  const [availability, setAvailability] = useState<Availability>(() => clone(AVAIL_BANDS))
  const [entries, setEntries] = useState<CalendarEntry[]>(CALENDAR_ENTRIES)

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Classes" title="Schedule & Calendar" subtitle={`Manage ${child.name}'s classes, school calendar and availability.`} />
      <Tabs
        tabs={[
          { id: 'classes', label: 'All Classes' },
          { id: 'calendar', label: 'School Calendar' },
          { id: 'availability', label: 'Availability' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'classes' && <WeekCalendar availability={availability} entries={entries} />}
      {tab === 'calendar' && <CalendarTab child={child} entries={entries} setEntries={setEntries} />}
      {tab === 'availability' && <AvailabilityTab availability={availability} setAvailability={setAvailability} />}
    </div>
  )
}
