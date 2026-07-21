'use client'

import { Users, MessageCircle, ArrowUpRight, Sparkles, HeartHandshake, CalendarClock } from 'lucide-react'
import { Card, SectionHeader } from './shared'

const WHATSAPP_URL = 'https://chat.whatsapp.com/LIsEfk7oukO4Uxld0Jf2ud?s=cl&p=a&ilr=2&amv=0'

const PERKS = [
  { icon: Sparkles, tint: 'bg-amber-50 text-amber-600', title: 'Tips & wins', body: 'Study tips, wins and parenting hacks from the Worlderly team.' },
  { icon: HeartHandshake, tint: 'bg-pink-50 text-pink-600', title: 'Parent support', body: 'Connect with other parents on the same learning journey.' },
  { icon: CalendarClock, tint: 'bg-sky-50 text-sky-600', title: 'Early updates', body: 'Be first to hear about events, workshops and new features.' },
]

export function Community() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Connect" title="Community" subtitle="Join fellow Worlderly parents." />

      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white sm:p-10">
          <div className="absolute -right-6 -top-6 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/15">
              <Users className="size-7" />
            </span>
            <div>
              <h2 className="text-2xl font-black">Worlderly Parents Circle</h2>
              <p className="mt-1 max-w-xl text-sm text-white/85">
                Our official WhatsApp community for Worlderly parents. Ask questions, share wins and stay in the loop.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-600 shadow-lg transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="size-5" />
              Join on WhatsApp
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PERKS.map((p) => {
          const Icon = p.icon
          return (
            <Card key={p.title} className="p-5">
              <span className={`grid size-11 place-items-center rounded-xl ${p.tint}`}>
                <Icon className="size-5" />
              </span>
              <div className="mt-3 text-sm font-bold text-slate-800">{p.title}</div>
              <p className="mt-1 text-xs text-slate-500">{p.body}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
