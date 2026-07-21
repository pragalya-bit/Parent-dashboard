'use client'

import { useState } from 'react'
import { Eye, CalendarClock, CreditCard, Gift, Copy, Check, MessageCircle, Send, Share2, UserPlus, CheckCircle2, Clock, Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, SectionHeader } from './shared'
import { INVOICES, UPCOMING_PAYMENT, REFERRAL } from '../lib/mock'
import type { ReferralEntry } from '../lib/types'

const money = (n: number) => `₹${n.toLocaleString('en-IN')}`

export function Billing() {
  const p = UPCOMING_PAYMENT
  const r = REFERRAL
  const [entries, setEntries] = useState<ReferralEntry[]>(r.entries)
  const [copied, setCopied] = useState(false)

  const joined = entries.filter((e) => e.status === 'joined')
  const pending = entries.filter((e) => e.status === 'pending')
  const discount = joined.reduce((a, e) => a + e.reward, 0)
  const payable = Math.max(0, p.amountValue - discount)

  // direct referral → send friend's details to the LEC
  const [friendName, setFriendName] = useState('')
  const [friendContact, setFriendContact] = useState('')
  const [sent, setSent] = useState(false)

  // edit a past referral
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ friendName: string; reward: string; status: ReferralEntry['status'] }>({ friendName: '', reward: '', status: 'pending' })

  const copy = () => {
    navigator.clipboard?.writeText(r.link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const shareText = `Hi! I use Worlderly for my child's maths & science 🎓. Take a look — join with my link and we both get a reward on our next bill: ${r.link}`
  const waShare = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  const sendToLec = () => {
    if (!friendName.trim() || !friendContact.trim()) return
    // a new referral is now pending — the count updates automatically
    setEntries((prev) => [{ id: `re-${Date.now()}`, friendName: friendName.trim(), status: 'pending', reward: 0, when: 'Just now' }, ...prev])
    setSent(true)
  }

  const startEdit = (e: ReferralEntry) => {
    setEditingId(e.id)
    setDraft({ friendName: e.friendName, reward: String(e.reward), status: e.status })
  }
  const saveEdit = () => {
    setEntries((prev) => prev.map((e) => (e.id === editingId ? { ...e, friendName: draft.friendName.trim() || e.friendName, reward: Number(draft.reward) || 0, status: draft.status } : e)))
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Account" title="Billing & Plans" subtitle="Your upcoming payment, referrals and invoice history." />

      {/* Upcoming payment */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-orange-100/60 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-xl bg-orange-100 text-orange-600"><CalendarClock className="size-5" /></span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-orange-600">Upcoming payment</div>
              <div className="text-sm font-semibold text-slate-500">{p.plan}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-400">Amount due</div>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-black text-slate-900">{money(payable)}</div>
                {discount > 0 && <div className="mb-1 text-lg text-slate-400 line-through">{money(p.amountValue)}</div>}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Due date</div>
              <div className="text-lg font-bold text-slate-800">{p.dueDate}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400">Renews on</div>
              <div className="text-lg font-bold text-slate-800">{p.renewalDate}</div>
            </div>
          </div>

          {/* referral reward line */}
          {discount > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
              <span className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                <Gift className="size-4" /> Referral reward · {joined.length} friend{joined.length === 1 ? '' : 's'} joined
              </span>
              <span className="text-sm font-black text-emerald-700">−{money(discount)}</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 font-semibold"><CreditCard className="size-4 text-slate-400" /> {p.method}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600">Pay {money(payable)}</button>
          </div>
        </div>
      </Card>

      {/* ---- Refer a parent ---- */}
      <Card className="overflow-hidden">
        {/* hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white sm:p-8">
          <div className="absolute -right-6 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-3xl font-black leading-tight">Refer a parent to Worlderly</h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-white/90">
              Introduce another parent to Worlderly — you'll both be rewarded on your next bill when their child enrols.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
          {/* left: share link + how it works + stats */}
          <div className="p-6">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Share your referral link</label>
            <div className="mt-1.5 flex gap-2">
              <input readOnly value={r.link} className="min-w-0 flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-600 outline-none" />
              <button onClick={copy} className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-colors', copied ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-900')}>
                {copied ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Copy</>}
              </button>
            </div>
            <a href={waShare} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-600">
              <MessageCircle className="size-4" /> Share on WhatsApp
            </a>

            {/* how it works */}
            <div className="mt-6">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">How it works</div>
              <div className="space-y-3">
                {[
                  { icon: Share2, tint: 'bg-orange-50 text-orange-600', t: 'Share your link — or their details', s: 'Send your link on WhatsApp, or pass a friend’s name & number to your co-ordinator (on the right).' },
                  { icon: UserPlus, tint: 'bg-sky-50 text-sky-600', t: 'They join Worlderly', s: 'Your link opens our WhatsApp — they leave their email & phone, then enrol their child.' },
                  { icon: Gift, tint: 'bg-emerald-50 text-emerald-600', t: 'You’re both rewarded', s: 'A reward is applied to each of your next bills once their child enrols to Worlderly class.' },
                ].map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', step.tint)}><Icon className="size-4.5" /></span>
                      <div>
                        <div className="text-sm font-bold text-slate-800"><span className="text-slate-400">{i + 1}.</span> {step.t}</div>
                        <div className="text-xs text-slate-500">{step.s}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-2xl font-black text-slate-900">{joined.length}</div>
                <div className="text-[11px] font-semibold text-slate-500">Friends joined</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-black text-emerald-700">{money(discount)}</div>
                <div className="text-[11px] font-semibold text-emerald-600">Reward earned</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-center">
                <div className="text-2xl font-black text-slate-900">{pending.length}</div>
                <div className="text-[11px] font-semibold text-slate-500">Pending</div>
              </div>
            </div>
          </div>

          {/* right: refer a friend directly → send to LEC */}
          <div className="border-t border-slate-100 bg-slate-50/60 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-orange-100 text-orange-600"><UserPlus className="size-4.5" /></span>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Refer your friend</h3>
                <p className="text-xs text-slate-500">Share their details — your co-ordinator will reach out to them.</p>
              </div>
            </div>

            {sent ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="size-6" /></span>
                <p className="text-sm font-bold text-slate-800">Sent to your co-ordinator</p>
                <p className="text-xs text-slate-500">The LEC will reach out to <span className="font-bold text-slate-700">{friendName}</span> soon. Added to your pending referrals.</p>
                <button onClick={() => { setSent(false); setFriendName(''); setFriendContact('') }} className="mt-1 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50">
                  Refer another
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Friend's name</label>
                  <input value={friendName} onChange={(e) => setFriendName(e.target.value)} placeholder="Parent's name" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Friend's contact number</label>
                  <input value={friendContact} onChange={(e) => setFriendContact(e.target.value)} placeholder="+91 …" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300" />
                </div>
                <button onClick={sendToLec} disabled={!friendName.trim() || !friendContact.trim()} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300">
                  <Send className="size-4" /> Send to LEC
                </button>
                <p className="text-[11px] text-slate-400">We'll only use these details to introduce {friendName || 'your friend'} to Worlderly.</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ---- Referral history ---- */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Referral history</h2>
          <span className="text-xs font-semibold text-slate-400">{entries.length} referral{entries.length === 1 ? '' : 's'}</span>
        </div>
        <div className="divide-y divide-slate-100">
          {entries.map((e) =>
            editingId === e.id ? (
              <div key={e.id} className="grid grid-cols-1 gap-3 bg-slate-50/60 px-6 py-4 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
                <input value={draft.friendName} onChange={(ev) => setDraft({ ...draft, friendName: ev.target.value })} placeholder="Friend's name" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
                <select value={draft.status} onChange={(ev) => setDraft({ ...draft, status: ev.target.value as ReferralEntry['status'] })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300">
                  <option value="pending">Pending</option>
                  <option value="joined">Joined</option>
                </select>
                <input type="number" value={draft.reward} onChange={(ev) => setDraft({ ...draft, reward: ev.target.value })} placeholder="Reward ₹" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300" />
                <div className="flex items-center gap-2">
                  <button onClick={saveEdit} className="rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600">Save</button>
                  <button onClick={() => setEditingId(null)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="size-4" /></button>
                </div>
              </div>
            ) : (
              <div key={e.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', e.status === 'joined' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                  {e.status === 'joined' ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800">{e.friendName}{e.childName ? <span className="font-medium text-slate-400"> · {e.childName}</span> : null}</div>
                  <div className="text-xs font-medium text-slate-400">{e.when}</div>
                </div>
                {e.status === 'joined' && e.reward > 0 && <span className="text-sm font-black text-emerald-600">+{money(e.reward)}</span>}
                <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize', e.status === 'joined' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{e.status}</span>
                <button onClick={() => startEdit(e)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"><Pencil className="size-3.5" /> Edit</button>
              </div>
            ),
          )}
        </div>
      </Card>

      {/* Invoice history */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Invoice History</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-800">{inv.no}</div>
                <div className="text-xs font-medium text-slate-400">{inv.date}</div>
              </div>
              <div className="text-sm font-black text-slate-900">{inv.amount}</div>
              <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize', inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{inv.status}</span>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"><Eye className="size-3.5" /> View</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
