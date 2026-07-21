// Types for the parent-facing dashboard (parent views their child's progress).

export type SectionId =
  | 'dashboard'
  | 'student'
  | 'schedule'
  | 'library'
  | 'billing'
  | 'messages'
  | 'store'
  | 'community'
  | 'settings'

export type ClassType = '1:1' | 'Group' | 'Trial'

/** A scheduled class rendered on the week calendar. */
export interface CalEvent {
  id: string
  date: string // iso yyyy-mm-dd
  start: number // decimal hour
  end: number
  title: string
  subject: string
  board: string
  teacher: string
  type: ClassType
  joinSoon?: boolean
  recordings?: { title: string; duration: string }[]
  feedback?: { rating: number; comment: string }
  teacherFeedback?: { rating: number; comment: string }
}

export interface AvailBand {
  start: number
  end: number
  date?: string // optional specific date (iso)
}

export interface Attendance {
  rate: number
  attended: number
  total: number
}

/** An upcoming class shown in the list with Reschedule / Join. */
export interface UpcomingClass {
  id: string
  subject: string
  color: string
  type: ClassType
  title: string
  teacher: string
  dateLabel: string
  time: string
  joinSoon: boolean
}

export interface UpcomingPayment {
  plan: string
  amount: string
  amountValue: number
  dueDate: string
  renewalDate: string
  method: string
  autoRenew: boolean
  status: 'due' | 'scheduled'
}

export interface ReferralEntry {
  id: string
  friendName: string
  childName?: string // referred family's child (once they enrol)
  status: 'pending' | 'joined'
  reward: number // ₹ discount earned from this referral (set by the LEC on activation)
  when: string
}

export interface Referral {
  code: string
  link: string
  referrerLabel: string // e.g. "Aryan's mother"
  companyWhatsapp: string // company WhatsApp number the link redirects to
  entries: ReferralEntry[]
}

export interface ProfileInfo {
  name: string
  email: string
  phone: string
  location: string
  childName: string
  board: string
}

export interface Child {
  id: string
  name: string
  grade: string
  board: string
  accent: string
}

export interface ActivityItem {
  id: string
  icon: string // emoji
  tint: string // tailwind classes for the icon chip
  title: string
  when: string
}

export type MasteryLevel = 'mastered' | 'progressing' | 'threshold' | 'none'

export interface MasteryTopic {
  name: string
  level: MasteryLevel
  score?: number
}

export interface MasterySubject {
  subject: string
  topics: MasteryTopic[]
}

export interface ClassItem {
  id: string
  subject: string
  color: string // tailwind text/bg tint accent
  title: string
  date: string
  time: string
  duration: string
  status: 'upcoming' | 'attended' | 'missed'
  recordingUrl?: string
}

export interface CalendarEntry {
  id: string
  title: string
  start: string
  end: string
  type: 'exam' | 'holiday' | 'vacation'
}

export interface Material {
  id: string
  title: string
  subject: 'Mathematics' | 'Science'
  meta: string
  pages: number
  color: string
}

export interface Plan {
  id: 'silver' | 'gold' | 'platinum'
  name: string
  price: string
  cadence: string
  perks: string[]
  current?: boolean
}

export interface Invoice {
  id: string
  no: string
  date: string
  plan: string
  amount: string
  status: 'paid' | 'due'
}

export interface Conversation {
  id: string
  name: string
  initials: string
  accent: string
  preview: string
  time: string
  unread?: number
  messages: { from: 'me' | 'them'; text: string; time: string }[]
}

export interface Notification {
  id: string
  icon: string
  tint: string
  title: string
  body: string
  time: string
}

// ---- Store ----
export interface Product {
  id: string
  name: string
  model: string
  tagline: string
  price: number
  mrp: number
  currency: string
  rating: number
  reviews: number
  badge?: string
  highlights: string[]
  description: string
  specs: { label: string; value: string }[]
  inBox: string[]
}
