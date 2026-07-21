'use client'

import { useEffect, useState } from 'react'
import { useApp, type DetailAccent } from '@/context/AppContext'

const MENTOR_AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=160'
const SUBJECT = 'Math'
const TOPIC = 'Linear Equations'
const DATE = 'Today, 12 Jun'
const TIME = '6:00 PM IST'
const TEACHER = 'Ms. Lavanya'
const ROLE = 'Math Mentor'
const CHAT = 'Great session tracking those vectors. Your homework tools are ready below! 🚀'

// Both states share this baseline height so hovering rarely reflows the page;
// min-h (not a fixed h) lets the card grow instead of clipping the CTA when the
// topic wraps to two lines on mid-width screens.
const CARD =
  'lg:col-span-8 relative bg-white border border-orange-100 rounded-2xl shadow-sm min-h-[272px] overflow-hidden transition-colors duration-300'

const HOVER_ACCENT: Record<DetailAccent, { bar: string; badge: string }> = {
  orange: { bar: 'bg-orange-400', badge: 'bg-orange-50 text-orange-600' },
  amber: { bar: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600' },
  sky: { bar: 'bg-sky-400', badge: 'bg-sky-50 text-sky-600' },
  purple: { bar: 'bg-purple-400', badge: 'bg-purple-50 text-purple-600' },
  emerald: { bar: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-600' },
  blue: { bar: 'bg-blue-400', badge: 'bg-blue-50 text-blue-600' },
}

const pad = (n: number) => n.toString().padStart(2, '0')

function secsUntil6pm() {
  const now = new Date()
  const target = new Date(now)
  target.setHours(18, 0, 0, 0)
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1)
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
}

export function LiveSessionCard() {
  const { hoverDetail, handleJoinClass } = useApp()
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    setSecs(secsUntil6pm())
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : secsUntil6pm())), 1000)
    return () => clearInterval(id)
  }, [])

  // Hovering the calendar or a journey bubble takes over this card.
  if (hoverDetail) {
    const a = HOVER_ACCENT[hoverDetail.accent]
    return (
      <div className={`${CARD} p-5 flex flex-col`}>
        <div className={`absolute left-0 top-5 bottom-5 w-1.5 rounded-full ${a.bar}`} />
        <div className="flex items-center gap-2 pl-3">
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${a.badge}`}>
            {hoverDetail.badge}
          </span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mt-3 pl-3">
          {hoverDetail.title}
        </h3>
        {hoverDetail.meta && <p className="text-sm text-slate-500 font-semibold mt-1 pl-3">{hoverDetail.meta}</p>}
        {hoverDetail.time && (
          <p className="inline-flex items-center gap-1.5 mt-3 ml-3 w-max bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-[13px] font-bold text-slate-600">
            🕒 {hoverDetail.time}
          </p>
        )}
        {hoverDetail.status && (
          <div className="mt-2.5 pl-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-full px-3.5 py-1.5">
              {hoverDetail.status}
            </span>
          </div>
        )}
        <p className="mt-2.5 pl-3 text-[11px] font-semibold text-slate-400 italic">
          {hoverDetail.hint ?? 'Hover the map or calendar to preview · click to open'}
        </p>
      </div>
    )
  }

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  return (
    <div className={`${CARD} p-6`}>
      <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-orange-400 to-orange-500" />

      <div className="flex flex-col md:flex-row justify-between gap-6 h-full pl-3">
        {/* ---- LEFT: session details ---- */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* date + time together */}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {DATE} · {TIME}
          </div>

          {/* subject | topic */}
          <div className="flex items-center gap-3 mt-3.5">
            <span className="text-[23px] font-extrabold text-orange-500 tracking-tight whitespace-nowrap">{SUBJECT}</span>
            <span className="w-px h-6 bg-slate-200 shrink-0" />
            <span className="text-[23px] font-extrabold text-slate-800 tracking-tight">{TOPIC}</span>
          </div>

          {/* live class timer */}
          <div className="mt-3 inline-flex w-max items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-1.5">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">T-Minus</span>
            <span className="text-orange-600 font-mono font-black text-base tracking-wider tabular-nums">
              {pad(h)}H : {pad(m)}M : {pad(s)}S
            </span>
          </div>

          {/* CTA — grey until it unlocks 5 min before class. pt-5 keeps a guaranteed
              gap above the button even when mt-auto collapses on a filled card. */}
          <div className="mt-auto pt-5">
            <button
              type="button"
              onClick={handleJoinClass}
              className="group w-max inline-flex items-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-base font-bold pl-7 pr-2.5 py-2.5 rounded-full border border-slate-200 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              <span>Join class</span>
              <span className="grid place-items-center w-9 h-9 rounded-full bg-white/80 text-slate-600 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                <i className="fa-solid fa-arrow-right text-sm" />
              </span>
            </button>
            <p className="text-[11px] font-semibold text-slate-400 mt-2 flex items-center gap-1.5">
              🔒 Unlocks 5 minutes before the class starts
            </p>
          </div>
        </div>

        {/* ---- RIGHT: mentor message + identity, grouped together at top ---- */}
        <div className="flex flex-col items-stretch md:items-end justify-start md:w-[300px] shrink-0 gap-2.5">
          {/* teacher message bubble */}
          <div className="bg-orange-50/70 border border-orange-100 rounded-2xl rounded-tr-md p-3.5 md:text-right text-slate-600 text-[13px] leading-relaxed font-semibold">
            {CHAT}
          </div>

          {/* teacher identity */}
          <div className="flex items-center gap-3.5 md:flex-row-reverse">
            <div className="w-[68px] h-[68px] rounded-full overflow-hidden border-[3px] border-orange-300 shrink-0 shadow-md">
              <img src={MENTOR_AVATAR} alt={TEACHER} className="w-full h-full object-cover" />
            </div>
            <div className="md:text-right">
              <div className="flex items-center gap-1.5 md:flex-row-reverse">
                <span className="text-lg font-extrabold text-slate-800">{TEACHER}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[13px] font-semibold text-slate-400">{ROLE}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
