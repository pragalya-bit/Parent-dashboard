// Week-grid calendar helpers for the parent Schedule page. Anchored to a fixed
// base Monday (16 Jun 2026, matching the reference design) so the mock is
// deterministic; week navigation can roam across months/years.

export const CAL_HOURS = { start: 9, end: 17 } // 9 AM – 5 PM
export const HOUR_PX = 96

const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
export const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export type DayKey = (typeof DAY_KEYS)[number]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const TODAY_ISO = '2026-06-16'
// "Monday" of the reference week (dates read 16–21 Jun 2026).
const BASE_MONDAY = new Date(2026, 5, 16)

// Reference "now" used to split classes into completed vs upcoming.
export const NOW = { iso: TODAY_ISO, hour: 12.5 }

/** A class is completed if its date is in the past, or it already ended today. */
export function isCompleted(date: string, end: number): boolean {
  if (date < NOW.iso) return true
  if (date > NOW.iso) return false
  return end <= NOW.hour
}

const pad = (n: number) => String(n).padStart(2, '0')
const isoOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export interface CalDay {
  day: string
  key: DayKey
  date: number
  month: string
  iso: string
  today: boolean
}

export function weekStartDate(offset: number): Date {
  return addDays(BASE_MONDAY, offset * 7)
}

export function buildWeek(offset: number): CalDay[] {
  const start = weekStartDate(offset)
  return DAY_NAMES.map((day, i) => {
    const d = addDays(start, i)
    return { day, key: DAY_KEYS[i], date: d.getDate(), month: MONTHS[d.getMonth()], iso: isoOf(d), today: isoOf(d) === TODAY_ISO }
  })
}

export function weekLabel(offset: number): string {
  const week = buildWeek(offset)
  const a = week[0]
  const b = week[week.length - 1]
  const year = weekStartDate(offset).getFullYear()
  if (a.month === b.month) return `${a.date}–${b.date} ${a.month} ${year}`
  return `${a.date} ${a.month} – ${b.date} ${b.month} ${year}`
}

/** Long month label for the period, e.g. "June 2026". */
export function monthLabel(offset: number): string {
  const d = addDays(weekStartDate(offset), 3)
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** Format a decimal hour: 10 → "10 AM", 14.5 → "2:30 PM". */
export function fmt(dec: number): string {
  const h24 = Math.floor(dec)
  const m = Math.round((dec - h24) * 60)
  const ampm = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}${m ? ':' + pad(m) : ''} ${ampm}`
}

export const HOURS = Array.from({ length: CAL_HOURS.end - CAL_HOURS.start + 1 }, (_, i) => CAL_HOURS.start + i)

/** Half-hour options across the calendar range, for time <select>s. */
export const TIME_OPTIONS = Array.from({ length: (CAL_HOURS.end - CAL_HOURS.start) * 2 + 1 }, (_, i) => {
  const v = CAL_HOURS.start + i * 0.5
  return { value: v, label: fmt(v) }
})
