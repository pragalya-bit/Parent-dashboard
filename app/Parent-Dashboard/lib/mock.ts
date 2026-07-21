import type {
  Child,
  ActivityItem,
  MasterySubject,
  ClassItem,
  CalendarEntry,
  Material,
  Plan,
  Invoice,
  Conversation,
  Notification,
  Product,
  CalEvent,
  AvailBand,
  UpcomingClass,
  UpcomingPayment,
  ProfileInfo,
  Attendance,
  Referral,
} from './types'
import type { DayKey } from './calendar'

export const CHILDREN: Child[] = [
  { id: 'aryan', name: 'Aryan', grade: 'Grade 5', board: 'Singapore MOE', accent: '#f97316' },
  { id: 'meera', name: 'Meera', grade: 'Grade 3', board: 'Singapore MOE', accent: '#8b5cf6' },
]

export const STATS = {
  classesThisMonth: 15,
  badges: 5,
  attendance: 93,
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'a1', icon: '🏆', tint: 'bg-amber-100 text-amber-600', title: 'Earned "Streak Champion" badge', when: 'Today' },
  { id: 'a2', icon: '✅', tint: 'bg-emerald-100 text-emerald-600', title: 'Completed Animal Habitats quiz (82%)', when: 'Yesterday' },
  { id: 'a3', icon: '🎧', tint: 'bg-sky-100 text-sky-600', title: 'Attended Math class with Ms. Sarah', when: '2 days ago' },
  { id: 'a4', icon: '✅', tint: 'bg-emerald-100 text-emerald-600', title: 'Completed Plant Cells quiz (90%)', when: '3 days ago' },
]

export const MASTERY: MasterySubject[] = [
  {
    subject: 'Science',
    topics: [
      { name: 'Plant Cells', level: 'mastered', score: 92 },
      { name: 'Animal Cells', level: 'mastered', score: 88 },
      { name: 'Matter and Materials', level: 'progressing', score: 64 },
      { name: 'Forces and Energy', level: 'threshold', score: 41 },
      { name: 'Light and Sound', level: 'none' },
      { name: 'The Human Body', level: 'progressing', score: 70 },
    ],
  },
  {
    subject: 'Mathematics',
    topics: [
      { name: 'Whole Numbers', level: 'mastered', score: 95 },
      { name: 'Fractions', level: 'mastered', score: 86 },
      { name: 'Decimals', level: 'progressing', score: 61 },
      { name: 'Area & Perimeter', level: 'progressing', score: 58 },
      { name: 'Angles', level: 'threshold', score: 38 },
      { name: 'Ratio', level: 'none' },
    ],
  },
]

export const UPCOMING_CLASSES: ClassItem[] = [
  { id: 'c1', subject: 'Science', color: 'orange', title: 'Chapter 7 — Human cell', date: 'Today', time: '4:00 PM', duration: '45 min', status: 'upcoming' },
  { id: 'c2', subject: 'Mathematics', color: 'sky', title: 'Chapter 4 — Fractions review', date: 'Tomorrow', time: '5:00 PM', duration: '45 min', status: 'upcoming' },
]

export const PAST_CLASSES: ClassItem[] = [
  { id: 'p1', subject: 'Science', color: 'emerald', title: 'Chapter 7 — Animal cell', date: 'Yesterday', time: '4:00 PM', duration: '45 min', status: 'attended', recordingUrl: '#' },
  { id: 'p2', subject: 'Science', color: 'emerald', title: 'Chapter 6 — Plant cell', date: '3 days ago', time: '4:00 PM', duration: '45 min', status: 'attended', recordingUrl: '#' },
  { id: 'p3', subject: 'Mathematics', color: 'sky', title: 'Chapter 3 — Decimals', date: 'Last week', time: '5:00 PM', duration: '45 min', status: 'attended', recordingUrl: '#' },
]

export const CALENDAR_ENTRIES: CalendarEntry[] = [
  { id: 'ce0', title: "School Founder's Day", start: '2026-06-19', end: '2026-06-19', type: 'holiday' },
  { id: 'ce1', title: 'Mid-Year Exam', start: '2026-10-12', end: '2026-10-22', type: 'exam' },
  { id: 'ce2', title: 'National Day', start: '2026-08-09', end: '2026-08-09', type: 'holiday' },
  { id: 'ce3', title: 'September Vacation', start: '2026-09-01', end: '2026-09-08', type: 'vacation' },
]

// weekly availability grid — bands the parent has toggled as available
export const AVAILABILITY: Record<string, string[]> = {
  Mon: ['3pm – 5pm'],
  Tue: ['4pm – 6pm'],
  Wed: ['3pm – 5pm', '6pm – 7pm'],
  Thu: ['4pm – 6pm'],
  Fri: ['5pm – 7pm'],
  Sat: ['10am – 12pm', '2pm – 4pm'],
}

export const MATERIALS: Material[] = [
  { id: 'm1', title: 'Algebra Chapter 4 Notes', subject: 'Mathematics', meta: '12 pages · PDF', pages: 12, color: 'sky' },
  { id: 'm2', title: 'Cell Structure — Notes', subject: 'Science', meta: '8 pages · PDF', pages: 8, color: 'emerald' },
  { id: 'm3', title: 'Science Lab Introduction', subject: 'Science', meta: '6 pages · PDF', pages: 6, color: 'emerald' },
  { id: 'm4', title: 'Quadratic Equations Practice', subject: 'Mathematics', meta: '10 pages · PDF', pages: 10, color: 'sky' },
  { id: 'm5', title: 'Quadratic Equations — Set B', subject: 'Mathematics', meta: '9 pages · PDF', pages: 9, color: 'sky' },
  { id: 'm6', title: 'Physics — Forces Worksheet', subject: 'Science', meta: '5 pages · PDF', pages: 5, color: 'emerald' },
]

export const PLANS: Plan[] = [
  {
    id: 'silver',
    name: 'Silver',
    price: '₹4,999',
    cadence: 'per month',
    perks: ['8 live classes / month', '1 subject', 'Recorded sessions', 'Monthly report card'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '₹8,499',
    cadence: 'per month',
    perks: ['16 live classes / month', '2 subjects', 'Recorded sessions', 'Weekly report card', 'Board mastery heatmap'],
    current: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '₹12,999',
    cadence: 'per month',
    perks: ['Unlimited live classes', 'All subjects', '1:1 mentor sessions', 'Priority support', 'Full library access'],
  },
]

export const INVOICES: Invoice[] = [
  { id: 'i1', no: 'WD-2026-0612', date: '12 Jun 2026', plan: 'Gold · Monthly', amount: '₹8,499', status: 'paid' },
  { id: 'i2', no: 'WD-2026-0512', date: '12 May 2026', plan: 'Gold · Monthly', amount: '₹8,499', status: 'paid' },
  { id: 'i3', no: 'WD-2026-0412', date: '12 Apr 2026', plan: 'Silver · Monthly', amount: '₹4,999', status: 'paid' },
  { id: 'i4', no: 'WD-2026-0712', date: '12 Jul 2026', plan: 'Gold · Monthly', amount: '₹8,499', status: 'due' },
]

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'cv1',
    name: 'Worlderly',
    initials: 'W',
    accent: '#f97316',
    preview: 'Welcome to Worlderly! We are excited to have Aryan on board.',
    time: '9:14 AM',
    messages: [
      { from: 'them', text: 'Welcome to Worlderly! We are excited to have Aryan on board. 🎉', time: '9:14 AM' },
      { from: 'them', text: 'Your co-ordinator will reach out shortly to set up the first class.', time: '9:15 AM' },
      { from: 'me', text: 'Thank you! Looking forward to it.', time: '9:20 AM' },
    ],
  },
  {
    id: 'cv2',
    name: 'Class Announcement',
    initials: 'CA',
    accent: '#0ea5e9',
    preview: 'Reminder: Science class moved to 4:30 PM tomorrow.',
    time: 'Yesterday',
    unread: 1,
    messages: [
      { from: 'them', text: 'Reminder: Science class moved to 4:30 PM tomorrow.', time: '2:00 PM' },
      { from: 'them', text: 'Please ensure Aryan has the DeskMate ready for the worksheet.', time: '2:01 PM' },
    ],
  },
  {
    id: 'cv3',
    name: 'Class Chat',
    initials: 'CC',
    accent: '#10b981',
    preview: 'Ms. Sarah: Great work in today’s session!',
    time: 'Mon',
    messages: [
      { from: 'them', text: 'Ms. Sarah: Great work in today’s session, Aryan! 🌟', time: '5:02 PM' },
      { from: 'me', text: 'Thank you Ms. Sarah!', time: '5:10 PM' },
    ],
  },
]

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', icon: '🏆', tint: 'bg-amber-100 text-amber-600', title: 'New badge earned', body: 'Aryan earned the "Streak Champion" badge.', time: '2h ago' },
  { id: 'n2', icon: '📅', tint: 'bg-sky-100 text-sky-600', title: 'Class rescheduled', body: 'Science class moved to 4:30 PM tomorrow.', time: 'Yesterday' },
  { id: 'n3', icon: '💳', tint: 'bg-red-100 text-red-600', title: 'Invoice due', body: 'July invoice WD-2026-0712 is due on 12 Jul.', time: '2 days ago' },
  { id: 'n4', icon: '📊', tint: 'bg-emerald-100 text-emerald-600', title: 'Weekly report ready', body: "Aryan's weekly progress report is available.", time: '3 days ago' },
]

// ---- Store ----
export const PRODUCTS: Product[] = [
  {
    id: 'deskmate',
    name: 'Worlderly DeskMate',
    model: 'SG-VP-S200L',
    tagline: 'HD document scanner for live online classes',
    price: 10500,
    mrp: 15000,
    currency: '₹',
    rating: 4.8,
    reviews: 214,
    badge: 'Best seller',
    highlights: [
      'High-Definition Imaging — 2MP (1600×1200) CMOS sensor for crisp details',
      'Up to A4 large-format capture for documents, maps and books',
      'Integrated USB power (5V) — powered by the laptop, no external supply',
      '1-year warranty with guaranteed protection',
    ],
    description:
      'The Worlderly DeskMate turns any desk into a live classroom. Its overhead scanning arm captures your child’s handwritten working in real time, so tutors can see every step during a video class — just like sitting side by side. Fold-flat design, plug-and-play USB, and a wide A4 capture area make it effortless for daily maths and science practice.',
    specs: [
      { label: 'Model', value: 'SG-VP-S200L' },
      { label: 'Sensor', value: '2MP CMOS (1600×1200)' },
      { label: 'Capture area', value: 'Up to A4' },
      { label: 'Power', value: 'USB 5V (laptop powered)' },
      { label: 'Connectivity', value: 'USB-A plug & play' },
      { label: 'Warranty', value: '1 year' },
    ],
    inBox: ['Worlderly DeskMate scanner', 'USB cable', 'Anti-glare scanning mat', 'Quick-start guide'],
  },
]

// ---- Schedule: week-calendar events (iso 16–21 Jun 2026) ----
const RAW_EVENTS: CalEvent[] = [
  // Mon 16
  { id: 'ev1', date: '2026-06-16', start: 10, end: 10.75, title: 'States of Matter', subject: 'Science', board: 'CBSE', teacher: 'Orion Group', type: 'Group' },
  { id: 'ev2', date: '2026-06-16', start: 11, end: 11.75, title: 'Algebra Basics', subject: 'Math', board: 'IGCSE', teacher: 'Riya (new)', type: 'Trial' },
  { id: 'ev3', date: '2026-06-16', start: 14, end: 14.75, title: 'Linear Equations', subject: 'Math', board: 'CBSE', teacher: 'Jhanvi M.', type: '1:1', joinSoon: true },
  // Tue 17
  { id: 'ev4', date: '2026-06-17', start: 13, end: 13.75, title: 'Word Problems', subject: 'Math', board: 'CBSE', teacher: 'Kabir N.', type: '1:1' },
  { id: 'ev5', date: '2026-06-17', start: 15, end: 15.75, title: 'Forces & Motion', subject: 'Science', board: 'CBSE', teacher: 'Dev (new)', type: 'Trial' },
  // Wed 18
  { id: 'ev6', date: '2026-06-18', start: 10, end: 10.75, title: 'Geometry', subject: 'Math', board: 'CBSE', teacher: 'Comet Group', type: 'Group' },
  { id: 'ev7', date: '2026-06-18', start: 13.5, end: 14.25, title: 'Equations', subject: 'Math', board: 'ICSE', teacher: 'Aarav S.', type: '1:1' },
  // Thu 19
  { id: 'ev8', date: '2026-06-19', start: 14, end: 14.75, title: 'Algebra', subject: 'Math', board: 'CBSE', teacher: 'Jhanvi M.', type: '1:1' },
  { id: 'ev9', date: '2026-06-19', start: 16, end: 16.75, title: 'Plant Life', subject: 'Science', board: 'CBSE', teacher: 'Nova (new)', type: 'Trial' },
  // Fri 20
  { id: 'ev10', date: '2026-06-20', start: 13, end: 13.75, title: 'Review & Mastery', subject: 'Math', board: 'CBSE', teacher: 'Meera K.', type: '1:1' },
  { id: 'ev11', date: '2026-06-20', start: 15, end: 15.75, title: 'The Solar System', subject: 'Science', board: 'CBSE', teacher: 'Galaxy Group', type: 'Group' },
  // Sat 21
  { id: 'ev12', date: '2026-06-21', start: 11, end: 11.75, title: 'Plant Life', subject: 'Science', board: 'CBSE', teacher: 'Ananya R.', type: '1:1' },
  { id: 'ev13', date: '2026-06-21', start: 13, end: 13.75, title: 'Word Problems', subject: 'Math', board: 'IGCSE', teacher: 'Aanya (new)', type: 'Trial' },
  { id: 'ev14', date: '2026-06-21', start: 15, end: 15.75, title: 'Mastery Quiz', subject: 'Math', board: 'CBSE', teacher: 'Comet Group', type: 'Group' },
]

// default recordings + student feedback attached to every class (shown when completed)
const DEFAULT_RECORDINGS = [
  { title: 'Full class recording', duration: '45:12' },
  { title: 'Key concepts recap', duration: '06:38' },
]
const FEEDBACKS: { rating: number; comment: string }[] = [
  { rating: 5, comment: 'Loved it! I finally understood how to balance the equation on both sides.' },
  { rating: 4, comment: 'Good class. The last problem was a bit tricky but the recap helped.' },
  { rating: 5, comment: 'Really fun — the group activity made it easy to follow along.' },
]
const TEACHER_FEEDBACKS: { rating: number; comment: string }[] = [
  { rating: 5, comment: 'Aryan was very attentive and solved all practice problems independently. Great progress!' },
  { rating: 4, comment: 'Good effort today. Needs a little more practice on word problems — assigned a worksheet.' },
  { rating: 5, comment: 'Excellent participation and asked thoughtful questions throughout the session.' },
]
export const CAL_EVENTS: CalEvent[] = RAW_EVENTS.map((e, i) => ({
  ...e,
  recordings: DEFAULT_RECORDINGS,
  feedback: FEEDBACKS[i % FEEDBACKS.length],
  teacherFeedback: TEACHER_FEEDBACKS[i % TEACHER_FEEDBACKS.length],
}))

// student attendance summary (shown on the Dashboard)
export const ATTENDANCE: Attendance = { rate: 93, attended: 28, total: 30 }

// student's weekly availability (green base on the calendar) — editable in the UI
export const AVAIL_BANDS: Record<DayKey, AvailBand[]> = {
  Mon: [{ start: 9, end: 16 }],
  Tue: [{ start: 12.5, end: 16 }],
  Wed: [{ start: 9, end: 15 }],
  Thu: [{ start: 10.5, end: 16 }],
  Fri: [{ start: 9, end: 16 }],
  Sat: [{ start: 11, end: 16 }],
}

export const UPCOMING_LIST: UpcomingClass[] = [
  { id: 'u1', subject: 'Science', color: 'emerald', type: 'Group', title: 'States of Matter', teacher: 'Orion Group', dateLabel: 'Today', time: '10:00 AM', joinSoon: true },
  { id: 'u2', subject: 'Math', color: 'sky', type: '1:1', title: 'Linear Equations', teacher: 'Jhanvi M.', dateLabel: 'Today', time: '2:00 PM', joinSoon: false },
  { id: 'u3', subject: 'Math', color: 'sky', type: '1:1', title: 'Word Problems', teacher: 'Kabir N.', dateLabel: 'Tomorrow', time: '1:00 PM', joinSoon: false },
]

export const UPCOMING_PAYMENT: UpcomingPayment = {
  plan: 'Monthly plan',
  amount: '₹8,499',
  amountValue: 8499,
  dueDate: '12 Jul 2026',
  renewalDate: '12 Jul 2026',
  method: 'Visa ending 4242',
  autoRenew: true,
  status: 'due',
}

// Refer-and-earn (Viral-Loops style): share a link → it opens Worlderly's
// WhatsApp where the referred parent leaves their email + phone. When their
// child registers, BOTH parents get ₹500 off their next bill.
export const REFERRAL: Referral = {
  code: 'ARYAN-MOM',
  link: 'https://pages.viral-loops.com/share-worlderly-k9tefvia',
  referrerLabel: "Aryan's mother",
  companyWhatsapp: '919876543210',
  entries: [
    { id: 're1', friendName: 'Sunita Verma', childName: 'Riya', status: 'joined', reward: 500, when: '2 weeks ago' },
    { id: 're2', friendName: 'Ramesh Iyer', childName: 'Aditi', status: 'joined', reward: 500, when: '3 weeks ago' },
    { id: 're3', friendName: 'Kavya Nair', childName: 'Ishaan', status: 'joined', reward: 750, when: 'last month' },
    { id: 're4', friendName: 'Deepa Rao', status: 'pending', reward: 0, when: '2 days ago' },
    { id: 're5', friendName: 'Anil Kumar', status: 'pending', reward: 0, when: '5 days ago' },
  ],
}

export const PROFILE: ProfileInfo = {
  name: 'Anita Sharma',
  email: 'anita.sharma@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka',
  childName: 'Aryan',
  board: 'Singapore MOE',
}
