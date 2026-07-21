'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-3xl border border-slate-100 bg-white shadow-ambient', className)}>{children}</div>
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function Avatar({ name, accent, size = 40 }: { name: string; accent: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-inner"
      style={{ width: size, height: size, backgroundColor: accent, fontSize: size * 0.36 }}
    >
      {initials.toUpperCase()}
    </span>
  )
}

/** Tabbed pill switcher used across pages (Schedule, Messages). */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[]
  active: T
  onChange: (t: T) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
            active === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

const SUBJECT_TINT: Record<string, string> = {
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  sky: 'bg-sky-50 text-sky-600 border-sky-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
}

export function SubjectChip({ subject, color }: { subject: string; color: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold', SUBJECT_TINT[color] ?? SUBJECT_TINT.orange)}>
      {subject}
    </span>
  )
}
