'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Gauge,
  CalendarRange,
  FolderUp,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  Users,
  Settings as SettingsIcon,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from './shared'
import { CHILDREN } from '../lib/mock'
import type { SectionId, Child } from '../lib/types'

export const NAV: { id: SectionId; icon: React.ElementType; label: string; badge?: number }[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'student', icon: Gauge, label: 'Student Dashboard' },
  { id: 'schedule', icon: CalendarRange, label: 'Schedule' },
  { id: 'library', icon: FolderUp, label: 'My Library' },
  { id: 'billing', icon: CreditCard, label: 'Billing & Plans' },
  { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 2 },
  { id: 'store', icon: ShoppingBag, label: 'Store' },
  { id: 'community', icon: Users, label: 'Community' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
]

function ChildPicker({ child, onChange }: { child: Child; onChange: (c: Child) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Viewing child</p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-left transition-colors hover:border-orange-200 hover:bg-orange-50"
      >
        <Avatar name={child.name} accent={child.accent} size={36} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-slate-800">{child.name}</div>
          <div className="text-[11px] font-medium text-slate-400">{child.grade}</div>
        </div>
        <ChevronDown className={cn('size-4 shrink-0 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 z-40 mb-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {CHILDREN.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onChange(c)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-orange-50',
                  c.id === child.id && 'bg-orange-50/60',
                )}
              >
                <Avatar name={c.name} accent={c.accent} size={30} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-800">{c.name}</div>
                  <div className="text-[11px] font-medium text-slate-400">{c.grade}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Badge({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        'ml-auto grid min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold',
        active ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-600',
      )}
    >
      {n}
    </span>
  )
}

export function Sidebar({
  active,
  onSelect,
  child,
  onChild,
}: {
  active: SectionId
  onSelect: (s: SectionId) => void
  child: Child
  onChild: (c: Child) => void
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 md:flex">
      <div>
        <div className="mb-8 px-1">
          <div className="text-lg font-black tracking-wide text-orange-600">Worlderly</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Parent Console</div>
        </div>

        <nav className="space-y-1.5">
          {NAV.map(({ id, icon: Icon, label, badge }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200',
                  isActive
                    ? 'bg-orange-500 font-semibold text-white shadow-lg shadow-orange-500/25'
                    : 'font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-lg transition-colors',
                    isActive ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-white',
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {label}
                {badge != null && <Badge n={badge} active={isActive} />}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <ChildPicker child={child} onChange={onChild} />
      </div>
    </aside>
  )
}

export function MobileNav({
  active,
  onSelect,
  child,
  onChild,
}: {
  active: SectionId
  onSelect: (s: SectionId) => void
  child: Child
  onChild: (c: Child) => void
}) {
  return (
    <div className="sticky top-0 z-20 -mx-5 mb-2 border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur md:hidden">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-black text-orange-600">Worlderly</div>
        <select
          value={child.id}
          onChange={(e) => {
            const c = CHILDREN.find((x) => x.id === e.target.value)
            if (c) onChild(c)
          }}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
        >
          {CHILDREN.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {NAV.map(({ id, icon: Icon, label, badge }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500',
              )}
            >
              <Icon className="size-3.5" />
              {label}
              {badge != null && (
                <span
                  className={cn(
                    'grid size-4 place-items-center rounded-full text-[9px] font-bold',
                    isActive ? 'bg-white/25 text-white' : 'bg-orange-200 text-orange-700',
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
