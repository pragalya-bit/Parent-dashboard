'use client'

import { useState } from 'react'
import { CheckCircle2, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, SectionHeader, Avatar } from './shared'
import { PROFILE } from '../lib/mock'
import type { Child } from '../lib/types'

const TOGGLES = [
  { id: 'classes', label: 'Class reminders', desc: 'Before each scheduled class' },
  { id: 'progress', label: 'Progress reports', desc: 'Weekly summary of your child’s learning' },
  { id: 'payments', label: 'Payment reminders', desc: 'Upcoming dues and renewals' },
  { id: 'announcements', label: 'Announcements', desc: 'News and updates from Worlderly' },
]

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-orange-300"
      />
    </label>
  )
}

export function Settings({ child }: { child: Child }) {
  const [form, setForm] = useState({ ...PROFILE, childName: child.name, board: child.board, studentGrade: child.grade, studentSchool: 'Greenwood High' })
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ classes: true, progress: true, payments: true, announcements: false })

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setSaved(false)
  }

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Account" title="Settings" subtitle="Manage your profile and notification preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* profile */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-4">
            <Avatar name={form.name} accent="#ec4899" size={64} />
            <div>
              <p className="text-lg font-extrabold text-slate-900">{form.name}</p>
              <p className="text-sm font-semibold text-muted-foreground">Parent · {child.name}'s guardian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={set('name')} />
            <Field label="Email" type="email" value={form.email} onChange={set('email')} />
            <Field label="Phone" value={form.phone} onChange={set('phone')} />
            <Field label="Location" value={form.location} onChange={set('location')} />
            <Field label="Child's name" value={form.childName} onChange={set('childName')} />
            <Field label="Board" value={form.board} onChange={set('board')} />
            <Field label="Student's grade" value={form.studentGrade} onChange={set('studentGrade')} />
            <Field label="Student's school" value={form.studentSchool} onChange={set('studentSchool')} />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={save} className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600">
              Save changes
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <CheckCircle2 className="size-4" /> Saved
              </span>
            )}
          </div>
        </Card>

        {/* notifications */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="size-4 text-orange-500" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Notifications</h2>
          </div>
          <div className="space-y-2">
            {TOGGLES.map((t) => (
              <button
                key={t.id}
                onClick={() => setPrefs((p) => ({ ...p, [t.id]: !p[t.id] }))}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 text-left transition-colors hover:bg-slate-50"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-800">{t.label}</span>
                  <span className="block text-xs text-muted-foreground">{t.desc}</span>
                </span>
                <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', prefs[t.id] ? 'bg-orange-500' : 'bg-slate-300')}>
                  <span className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', prefs[t.id] ? 'left-[22px]' : 'left-0.5')} />
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
