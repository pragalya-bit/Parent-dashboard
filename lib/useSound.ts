'use client'

import { useCallback } from 'react'

export type SoundName = 'chest-open' | 'landing' | 'confetti'

/**
 * Sound stub — no audio files yet. Drop mp3s into /public/sounds and replace
 * the body with `new Audio(\`/sounds/${name}.mp3\`).play()` when ready.
 */
export function useSound() {
  const play = useCallback((name: SoundName) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[sound] ${name}`)
    }
  }, [])

  return { play }
}
