// Summit treasure rewards — data-driven so gear can be tuned without touching JSX.
// The treasure always yields exactly REWARDS_PER_SUMMIT items.

export interface Reward {
  id: string
  icon: string
  name: string
  benefit: string
}

export const REWARDS_PER_SUMMIT = 3

export const REWARDS: Reward[] = [
  { id: 'oxygen', icon: '🤿', name: 'Oxygen Cylinder', benefit: '+1 quiz retry, streak stays safe' },
  { id: 'tent', icon: '⛺', name: 'Tent Kit', benefit: 'Save your camp, resume anytime' },
  { id: 'compass', icon: '🧭', name: 'Compass', benefit: '1 free hint on any worksheet' },
]

/** Always exactly REWARDS_PER_SUMMIT items, never empty. */
export function rollSummitRewards(): Reward[] {
  return REWARDS.slice(0, REWARDS_PER_SUMMIT)
}
