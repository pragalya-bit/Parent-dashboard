// Domain types for the Mentor dashboard.
// These will eventually be GENERATED from the Django drf-spectacular OpenAPI
// schema. Keep them here for now so the data layer is typed and swappable.

export type SectionId =
  | 'today'
  | 'schedule'
  | 'availability'
  | 'students'
  | 'checkpoints'
  | 'library'
  | 'messages'
  | 'earnings'
  | 'settings'

/** Response of `/api/me/` — drives which sections the shell renders. */
export interface MeResponse {
  id: string
  name: string
  role: 'mentor'
  sections: SectionId[]
}

export interface MentorStats {
  activeStudents: number
  classesToday: number
  hoursThisWeek: number
  rating: number
}

export interface EarningsPoint {
  month: string
  amount: number
}
