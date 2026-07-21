'use client'

import { useState } from 'react'
import { Sidebar, MobileNav } from './components/sidebar'
import { Dashboard } from './components/dashboard'
import { StudentView } from './components/student-view'
import { Schedule } from './components/schedule'
import { Library } from './components/library'
import { Billing } from './components/billing'
import { Messages } from './components/messages'
import { Store } from './components/store'
import { Community } from './components/community'
import { Settings } from './components/settings'
import { CHILDREN } from './lib/mock'
import type { SectionId, Child } from './lib/types'

export function Shell() {
  const [active, setActive] = useState<SectionId>('dashboard')
  const [child, setChild] = useState<Child>(CHILDREN[0])

  return (
    <div className="flex min-h-screen bg-[#FBFBFE] text-foreground">
      <Sidebar active={active} onSelect={setActive} child={child} onChild={setChild} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">
          <MobileNav active={active} onSelect={setActive} child={child} onChild={setChild} />
          {active === 'dashboard' && <Dashboard child={child} />}
          {active === 'student' && <StudentView child={child} />}
          {active === 'schedule' && <Schedule child={child} />}
          {active === 'library' && <Library child={child} />}
          {active === 'billing' && <Billing />}
          {active === 'messages' && <Messages />}
          {active === 'store' && <Store />}
          {active === 'community' && <Community />}
          {active === 'settings' && <Settings child={child} />}
        </div>
      </main>
    </div>
  )
}
