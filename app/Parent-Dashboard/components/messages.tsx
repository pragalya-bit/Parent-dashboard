'use client'

import { useState, useRef } from 'react'
import { Search, Send, Pencil, Smile, Paperclip, Mic, Users, Megaphone, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './shared'

type Msg = { id: string; from: 'me' | string; text: string; time: string }
interface Group {
  id: string
  name: string
  icon: 'group' | 'announce'
  accent: string
  participants: string
  preview: string
  time: string
  unread?: number
  messages: Msg[]
}

const GROUPS_SEED: Group[] = [
  {
    id: 'g1',
    name: 'Jhanvi-Math-Worlderly',
    icon: 'group',
    accent: '#f97316',
    participants: 'Lavanya, You, Aarav, Riya +4',
    preview: 'You: Yep, tomorrow 5pm 🎯',
    time: '4:15 PM',
    messages: [
      { id: 'm1', from: 'Aarav', text: 'Is the quiz today or tomorrow?', time: '4:10 PM' },
      { id: 'm2', from: 'Riya', text: 'Tomorrow at 5pm I think!', time: '4:12 PM' },
      { id: 'm3', from: 'me', text: 'Yep, tomorrow 5pm 🎯', time: '4:15 PM' },
    ],
  },
  {
    id: 'g2',
    name: 'Worlderly Announcements',
    icon: 'announce',
    accent: '#facc15',
    participants: 'Worlderly Team',
    preview: '🎉 New badges just dropped! Keep…',
    time: 'Mon',
    unread: 1,
    messages: [
      { id: 'a1', from: 'Worlderly', text: '🎉 New badges just dropped! Keep up the streaks to unlock them.', time: 'Mon 9:00 AM' },
    ],
  },
]

const EMOJIS = ['😊', '😂', '👍', '🎯', '🎉', '❤️', '🙌', '🔥', '✅', '📚', '⭐', '🚀']

function GroupIcon({ icon, accent, size = 44 }: { icon: 'group' | 'announce'; accent: string; size?: number }) {
  const Icon = icon === 'announce' ? Megaphone : Users
  return (
    <span className="grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size, backgroundColor: `${accent}22`, color: accent }}>
      <Icon style={{ width: size * 0.42, height: size * 0.42 }} />
    </span>
  )
}

export function Messages() {
  const [groups, setGroups] = useState<Group[]>(GROUPS_SEED)
  const [activeId, setActiveId] = useState('g1')
  const [q, setQ] = useState('')
  const [draft, setDraft] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [recording, setRecording] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const active = groups.find((g) => g.id === activeId) as Group
  const list = groups.filter((g) => g.name.toLowerCase().includes(q.toLowerCase()))

  const append = (text: string) => {
    if (!text.trim()) return
    const msg: Msg = { id: `m-${Date.now()}`, from: 'me', text, time: 'now' }
    setGroups((prev) => prev.map((g) => (g.id === activeId ? { ...g, messages: [...g.messages, msg], preview: `You: ${text}`, time: 'now' } : g)))
  }
  const send = () => {
    append(draft)
    setDraft('')
    setEmojiOpen(false)
  }
  const toggleRec = () => {
    if (recording) {
      append('🎤 Voice message · 0:06')
      setRecording(false)
    } else setRecording(true)
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Inbox" title="Messages" subtitle="Class groups and Worlderly announcements." />

      <div className="grid h-[620px] grid-cols-1 overflow-hidden rounded-3xl border border-orange-100 shadow-ambient md:grid-cols-[320px_1fr]">
        {/* ---- left: chat list ---- */}
        <div className="flex min-h-0 flex-col border-r border-orange-100 bg-white">
          <div className="flex items-center justify-between bg-orange-500 px-4 py-3.5 text-white">
            <span className="text-lg font-black">Chats</span>
            <Pencil className="size-4 opacity-90" />
          </div>
          <div className="border-b border-slate-100 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-300" />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {list.map((g) => (
              <button key={g.id} onClick={() => { setActiveId(g.id); setGroups((prev) => prev.map((x) => (x.id === g.id ? { ...x, unread: undefined } : x))) }}
                className={cn('flex w-full items-center gap-3 border-b border-slate-50 px-3 py-3 text-left transition-colors hover:bg-orange-50/50', g.id === activeId && 'bg-orange-50/70')}>
                <GroupIcon icon={g.icon} accent={g.accent} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-slate-800">{g.name}</span>
                    <span className="shrink-0 text-[10px] font-medium text-slate-400">{g.time}</span>
                  </div>
                  <div className="truncate text-xs text-slate-500">{g.preview}</div>
                </div>
                {g.unread && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white">{g.unread}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ---- right: thread ---- */}
        <div className="flex min-h-0 flex-col">
          {/* header */}
          <div className="flex items-center gap-3 bg-orange-500 px-4 py-3 text-white">
            <GroupIcon icon={active.icon} accent="#ffffff" size={44} />
            <div className="min-w-0">
              <div className="truncate text-base font-black">{active.name}</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
                <span className="size-2 rounded-full bg-emerald-300" /> {active.participants}
              </div>
            </div>
          </div>

          {/* messages */}
          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
            style={{ backgroundColor: '#FBF1E9', backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          >
            {active.messages.map((m) => (
              <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[75%] rounded-2xl px-3.5 py-2 text-sm shadow-sm', m.from === 'me' ? 'rounded-br-sm bg-orange-100 text-slate-800' : 'rounded-bl-sm bg-white text-slate-700')}>
                  {m.from !== 'me' && <span className="mb-0.5 block text-xs font-bold text-orange-600">{m.from}</span>}
                  <span>{m.text}</span>
                  <span className="ml-2 inline-flex items-center gap-0.5 align-bottom text-[10px] text-slate-400">
                    {m.time}
                    {m.from === 'me' && <Check className="size-3 text-sky-500" />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* composer */}
          <div className="relative flex items-center gap-2 border-t border-orange-100 bg-white p-3">
            {emojiOpen && (
              <div className="absolute bottom-16 left-3 z-10 grid grid-cols-6 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {EMOJIS.map((em) => (
                  <button key={em} onClick={() => { setDraft((d) => d + em); setEmojiOpen(false) }} className="grid size-8 place-items-center rounded-lg text-lg hover:bg-slate-100">{em}</button>
                ))}
              </div>
            )}
            <button onClick={() => setEmojiOpen((o) => !o)} className="grid size-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-orange-500" title="Emoji"><Smile className="size-5" /></button>
            <button onClick={() => fileRef.current?.click()} className="grid size-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-orange-500" title="Attach"><Paperclip className="size-5" /></button>
            <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) append(`📎 ${f.name}`) }} />
            <input
              value={recording ? '' : draft}
              disabled={recording}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={recording ? 'Recording voice message…' : 'Type a message'}
              className={cn('min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-orange-300', recording && 'text-red-500 placeholder:text-red-400')}
            />
            <button onClick={toggleRec} className={cn('grid size-9 shrink-0 place-items-center rounded-full transition-colors', recording ? 'animate-pulse bg-red-500 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-orange-500')} title="Voice message"><Mic className="size-5" /></button>
            <button onClick={send} className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-500 text-white shadow-md transition-colors hover:bg-orange-600" title="Send"><Send className="size-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
