// Mock fetchers — stand in for the Django API during the port.
// Each returns a Promise (simulated latency) so swapping to real `fetch`
// against the BFF route handlers later is a drop-in change.

import type { MeResponse, MentorStats, EarningsPoint } from './types'

const delay = <T>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

export const mockApi = {
  me: (): Promise<MeResponse> =>
    delay({
      id: 'mentor-1',
      name: 'Lavanya Raj',
      role: 'mentor',
      sections: ['today', 'schedule', 'availability', 'students', 'checkpoints', 'library', 'messages', 'earnings', 'settings'],
    }),

  stats: (): Promise<MentorStats> =>
    delay({ activeStudents: 24, classesToday: 5, hoursThisWeek: 18.5, rating: 4.9 }),

  earnings: (): Promise<EarningsPoint[]> =>
    delay([
      { month: 'Jan', amount: 38400 },
      { month: 'Feb', amount: 41200 },
      { month: 'Mar', amount: 44800 },
      { month: 'Apr', amount: 46100 },
      { month: 'May', amount: 51300 },
      { month: 'Jun', amount: 48200 },
    ]),
}
