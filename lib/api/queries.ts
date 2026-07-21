// TanStack Query hooks + query keys for the Mentor dashboard.
// Today these call the mock fetchers; later they'll call the typed client
// generated from drf-spectacular (via the BFF route handlers).

import { useQuery } from '@tanstack/react-query'
import { mockApi } from './mock'

export const queryKeys = {
  me: ['me'] as const,
  mentorStats: ['mentor', 'stats'] as const,
  earnings: ['mentor', 'earnings'] as const,
}

export function useMe() {
  return useQuery({ queryKey: queryKeys.me, queryFn: mockApi.me })
}

export function useMentorStats() {
  return useQuery({ queryKey: queryKeys.mentorStats, queryFn: mockApi.stats })
}

export function useEarnings() {
  return useQuery({ queryKey: queryKeys.earnings, queryFn: mockApi.earnings })
}
