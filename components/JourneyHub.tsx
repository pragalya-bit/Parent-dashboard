'use client'

import { useState } from 'react'
import { WorldMap } from '@/components/WorldMap'
import { JourneyMap } from '@/components/JourneyMap'
import { SpaceJourneyMap } from '@/components/SpaceJourneyMap'

// Shows the whole Worlderly world first, then dives into the student's
// detailed journey for the active subject — a mountain climb for Maths, a
// space mission for Science.
export function JourneyHub() {
  const [view, setView] = useState<'world' | 'journey'>('world')
  const [subject, setSubject] = useState('Mathematics')

  if (view === 'world') {
    return (
      <WorldMap
        onEnter={(s) => {
          setSubject(s)
          setView('journey')
        }}
      />
    )
  }

  return subject === 'Science' ? (
    <SpaceJourneyMap onBack={() => setView('world')} />
  ) : (
    <JourneyMap onBack={() => setView('world')} />
  )
}
