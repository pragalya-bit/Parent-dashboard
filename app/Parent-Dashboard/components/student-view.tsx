'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppProvider } from '@/context/AppContext'
import { Dashboard } from '@/components/Dashboard'
import { Portfolio } from '@/components/Portfolio'
import { Resources } from '@/components/Resources'
import { Courses } from '@/components/Courses'
import { SectionHeader } from './shared'
import type { Child } from '../lib/types'

type StudentTab = 'dashboard' | 'portfolio' | 'resources' | 'courses'
const TABS: { id: StudentTab; label: string }[] = [
  { id: 'dashboard', label: 'My Dashboard' },
  { id: 'portfolio', label: 'My Portfolio' },
  { id: 'resources', label: 'Resources' },
  { id: 'courses', label: 'Courses' },
]

/**
 * Read-only view of the child's student dashboard. We embed the real student
 * components inside their AppProvider and wrap them in `pointer-events-none` so
 * the parent can VIEW but not edit. Only the four learning pages are exposed —
 * Messages and Settings are intentionally left out of the parent's view.
 */
export function StudentView({ child }: { child: Child }) {
  const [tab, setTab] = useState<StudentTab>('dashboard')

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Student view"
        title={`${child.name}'s Dashboard`}
        subtitle="A read-only view of your child's learning pages."
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            <Eye className="size-3.5" /> Read-only
          </span>
        }
      />

      {/* parent's own tab controls — interactive */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-bold transition-colors',
              tab === t.id ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* embedded, read-only student page */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#FDF8F4] shadow-ambient">
        <div className="max-h-[76vh] overflow-y-auto p-4 sm:p-6">
          <AppProvider key={child.id}>
            <div className="pointer-events-none mx-auto max-w-[1100px] select-none">
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'portfolio' && <Portfolio />}
              {tab === 'resources' && <Resources />}
              {tab === 'courses' && <Courses />}
            </div>
          </AppProvider>
        </div>
      </div>
    </div>
  )
}
