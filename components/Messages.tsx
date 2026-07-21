'use client'

import { useEffect, useRef, useState } from 'react'

interface ChatMessage {
  from: 'me' | 'them'
  text: string
  time: string
}

interface Chat {
  id: string
  name: string
  avatar: string
  color: string
  subtitle: string
  online: boolean
  unread: number
  lastTime: string
  messages: ChatMessage[]
}

// Quick reactions the student can drop into chat, each with a description.
const REACTIONS = [
  { emoji: '👍', label: 'Understood' },
  { emoji: '🙋', label: 'Question' },
  { emoji: '💡', label: 'Idea' },
  { emoji: '🎯', label: 'Goal achieved' },
  { emoji: '🎉', label: 'Celebration' },
  { emoji: '👏', label: 'Appreciation' },
]

const INITIAL_CHATS: Chat[] = [
  {
    id: 'class',
    name: 'Jhanvi-Math-Worlderly',
    avatar: '👥',
    color: 'bg-orange-100',
    subtitle: 'Lavanya, You, Aarav, Riya +4',
    online: true,
    unread: 0,
    lastTime: '4:15 PM',
    messages: [
      { from: 'them', text: 'Aarav: Is the quiz today or tomorrow?', time: '4:10 PM' },
      { from: 'them', text: 'Riya: Tomorrow at 5pm I think!', time: '4:12 PM' },
      { from: 'me', text: 'Yep, tomorrow 5pm 🎯', time: '4:15 PM' },
    ],
  },
  {
    id: 'announce',
    name: 'Worlderly Announcements',
    avatar: '📢',
    color: 'bg-amber-100',
    subtitle: 'official channel',
    online: false,
    unread: 1,
    lastTime: 'Mon',
    messages: [
      { from: 'them', text: '🎉 New badges just dropped! Keep your streak alive to unlock them.', time: 'Mon 9:00 AM' },
    ],
  },
]

export function Messages() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS)
  const [activeId, setActiveId] = useState('class')
  const [draft, setDraft] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recSecs, setRecSecs] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeChat = chats.find((c) => c.id === activeId)!

  useEffect(() => {
    if (!isRecording) return
    const id = setInterval(() => setRecSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [isRecording])

  const selectChat = (id: string) => {
    setActiveId(id)
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  const pushMessage = (text: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, lastTime: 'now', messages: [...c.messages, { from: 'me', text, time: 'now' }] }
          : c,
      ),
    )
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    pushMessage(text)
    setDraft('')
    setShowEmojis(false)
  }

  const toggleVoice = () => {
    if (isRecording) {
      const mm = Math.floor(recSecs / 60)
      const ss = (recSecs % 60).toString().padStart(2, '0')
      pushMessage(`🎤 Voice message · ${mm}:${ss}`)
      setIsRecording(false)
      setRecSecs(0)
    } else {
      setIsRecording(true)
      setRecSecs(0)
    }
  }

  return (
    <div className="reveal h-[600px] flex rounded-2xl overflow-hidden border border-orange-200 shadow-ambient">
      {/* ===== Chat list ===== */}
      <div className="w-72 shrink-0 bg-white flex flex-col border-r border-orange-100">
        <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-black text-sm">Chats</span>
          <span className="text-lg">✎</span>
        </div>
        <div className="p-2">
          <input
            type="text"
            placeholder="🔍  Search"
            className="w-full text-xs bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const last = chat.messages[chat.messages.length - 1]
            const isActive = chat.id === activeId
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => selectChat(chat.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 border-b border-slate-50 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-300 ${
                  isActive ? 'bg-orange-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-11 h-11 rounded-full ${chat.color} grid place-items-center text-xl shrink-0`}>
                  {chat.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800 truncate">{chat.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0 ml-1">
                      {chat.lastTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[11px] text-slate-500 truncate">
                      {last.from === 'me' ? 'You: ' : ''}
                      {last.text}
                    </span>
                    {chat.unread > 0 && (
                      <span className="ml-1 shrink-0 bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full grid place-items-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== Conversation ===== */}
      <div className="flex-1 flex flex-col bg-[#fdf6f0]">
        {/* Chat header (no call / 3-dots) */}
        <div className="bg-orange-500 text-white px-4 py-2.5 flex items-center gap-3 shadow-sm">
          <div className={`w-10 h-10 rounded-full ${activeChat.color} grid place-items-center text-lg`}>
            {activeChat.avatar}
          </div>
          <div>
            <div className="text-sm font-bold">{activeChat.name}</div>
            <div className="text-[10px] text-orange-100 flex items-center gap-1">
              {activeChat.online && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />}
              {activeChat.subtitle}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-2"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          {activeChat.messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[72%] px-3 py-1.5 rounded-xl shadow-sm text-[13px] leading-snug ${
                  m.from === 'me'
                    ? 'bg-orange-100 text-slate-800 rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none'
                }`}
              >
                <span>{m.text}</span>
                <span className="text-[9px] text-slate-400 font-semibold ml-2 inline-flex items-center gap-0.5 align-bottom">
                  {m.time}
                  {m.from === 'me' && <span className="text-orange-400">✓✓</span>}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Emoji reaction bar */}
        {showEmojis && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-t border-orange-100">
            {REACTIONS.map((r) => (
              <div key={r.label} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    setDraft((d) => `${d}${r.emoji} `)
                    setShowEmojis(false)
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {r.emoji}
                </button>
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-5 py-2 bg-red-50 border-t border-red-100 text-red-600 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            Recording… {Math.floor(recSecs / 60)}:{(recSecs % 60).toString().padStart(2, '0')}
            <span className="text-slate-400 font-semibold">— tap the mic again to send</span>
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#f7efe7]">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) pushMessage(`📎 ${f.name}`)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => setShowEmojis((v) => !v)}
            title="Reactions"
            className={`text-xl transition-transform hover:scale-110 ${showEmojis ? 'scale-110' : 'text-slate-500'}`}
          >
            😊
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Attach a file"
            className="text-xl text-slate-500 hover:scale-110 transition-transform"
          >
            📎
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
            placeholder="Type a message"
            className="flex-1 text-sm bg-white rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            type="button"
            onClick={toggleVoice}
            title="Record a voice message"
            className={`text-xl w-10 h-10 rounded-full grid place-items-center shrink-0 transition-colors ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-orange-100'
            }`}
          >
            🎤
          </button>
          <button
            type="button"
            onClick={sendMessage}
            title="Send"
            className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-full grid place-items-center shadow-md shadow-orange-500/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 shrink-0"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
