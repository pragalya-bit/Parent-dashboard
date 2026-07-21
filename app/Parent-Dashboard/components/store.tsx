'use client'

import { useState } from 'react'
import {
  Star,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  Package,
  MapPin,
  BadgeCheck,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, SectionHeader } from './shared'
import { PRODUCTS } from '../lib/mock'
import { DeskMateImage, type DeskMateVariant } from './deskmate-art'
import type { Product } from '../lib/types'

const GALLERY: DeskMateVariant[] = ['device', 'scene', 'features', 'detail']

function money(n: number, cur: string) {
  return `${cur}${n.toLocaleString('en-IN')}`
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn('size-4', i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300')}
        />
      ))}
    </div>
  )
}

// ---------- Product grid ----------
function ProductCard({ p, onOpen }: { p: Product; onOpen: () => void }) {
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100)
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <button onClick={onOpen} className="relative block">
        <DeskMateImage variant="device" className="h-48 w-full" />
        {p.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            {p.badge}
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-sm font-bold text-slate-900">{p.name}</div>
        <div className="text-xs font-medium text-slate-400">Model {p.model}</div>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{p.tagline}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <Stars rating={p.rating} />
          <span className="text-xs font-semibold text-slate-500">{p.rating}</span>
          <span className="text-xs text-slate-400">({p.reviews})</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-xl font-black text-slate-900">{money(p.price, p.currency)}</span>
          <span className="mb-0.5 text-sm text-slate-400 line-through">{money(p.mrp, p.currency)}</span>
          <span className="mb-0.5 text-xs font-bold text-emerald-600">{off}% off</span>
        </div>
        <button
          onClick={onOpen}
          className="mt-4 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          View product
        </button>
      </div>
    </Card>
  )
}

// ---------- Product detail (Amazon-style) ----------
function ProductDetail({ p, onBack, onBuy }: { p: Product; onBack: () => void; onBuy: (qty: number) => void }) {
  const [img, setImg] = useState<DeskMateVariant>('device')
  const [qty, setQty] = useState(1)
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100)

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-orange-600"
      >
        <ChevronLeft className="size-4" /> Back to Store
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* gallery */}
        <div>
          <Card className="overflow-hidden">
            <DeskMateImage variant={img} className="aspect-[4/3] w-full" />
          </Card>
          <div className="mt-3 flex gap-3">
            {GALLERY.map((g) => (
              <button
                key={g}
                onClick={() => setImg(g)}
                className={cn(
                  'overflow-hidden rounded-xl border-2 transition-colors',
                  img === g ? 'border-orange-500' : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <DeskMateImage variant={g} className="h-16 w-20" />
              </button>
            ))}
          </div>
        </div>

        {/* buy box */}
        <div>
          <h1 className="text-2xl font-black text-slate-900">{p.name}</h1>
          <div className="mt-1 text-sm font-medium text-slate-400">Model {p.model}</div>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-sm font-semibold text-slate-600">{p.rating}</span>
            <span className="text-sm text-slate-400">· {p.reviews} ratings</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-black text-slate-900">{money(p.price, p.currency)}</span>
            <span className="mb-1 text-lg text-slate-400 line-through">{money(p.mrp, p.currency)}</span>
            <span className="mb-1 rounded-full bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-600">{off}% off</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Inclusive of all taxes</p>

          {/* India-only notice */}
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-800">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              <span className="font-bold">Available for Indian addresses only.</span> The DeskMate currently ships within India. Billing &
              shipping details are required at checkout.
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {h}
              </li>
            ))}
          </ul>

          {/* qty + CTA */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-50"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-slate-800">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-50"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              onClick={() => onBuy(qty)}
              className="flex-1 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600"
            >
              Buy now
            </button>
          </div>

          {/* trust row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, t: 'Free delivery', s: 'Across India' },
              { icon: ShieldCheck, t: '1-yr warranty', s: 'Brand assured' },
              { icon: BadgeCheck, t: 'Genuine', s: 'Sold by Worlderly' },
            ].map((x) => {
              const Icon = x.icon
              return (
                <div key={x.t} className="rounded-2xl border border-slate-100 p-3 text-center">
                  <Icon className="mx-auto size-5 text-orange-500" />
                  <div className="mt-1 text-xs font-bold text-slate-700">{x.t}</div>
                  <div className="text-[10px] text-slate-400">{x.s}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* description + specs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900">About this item</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>
          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-500">In the box</h3>
          <ul className="mt-2 space-y-1.5">
            {p.inBox.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                <Package className="size-4 text-slate-400" />
                {b}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900">Specifications</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {p.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-2.5 text-sm">
                <span className="font-semibold text-slate-500">{s.label}</span>
                <span className="text-right font-medium text-slate-800">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ---------- Checkout ----------
function Field({
  label,
  value,
  onChange,
  placeholder,
  half,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  half?: boolean
}) {
  return (
    <div className={half ? '' : 'sm:col-span-2'}>
      <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300"
      />
    </div>
  )
}

type Addr = { name: string; phone: string; line1: string; line2: string; city: string; state: string; pin: string }
const EMPTY: Addr = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '' }

function AddressForm({ addr, set }: { addr: Addr; set: (a: Addr) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field half label="Full name" value={addr.name} onChange={(v) => set({ ...addr, name: v })} placeholder="Parent name" />
      <Field half label="Phone" value={addr.phone} onChange={(v) => set({ ...addr, phone: v })} placeholder="+91 …" />
      <Field label="Address line 1" value={addr.line1} onChange={(v) => set({ ...addr, line1: v })} placeholder="House no., street" />
      <Field label="Address line 2" value={addr.line2} onChange={(v) => set({ ...addr, line2: v })} placeholder="Area, landmark (optional)" />
      <Field half label="City" value={addr.city} onChange={(v) => set({ ...addr, city: v })} />
      <Field half label="State" value={addr.state} onChange={(v) => set({ ...addr, state: v })} />
      <Field half label="PIN code" value={addr.pin} onChange={(v) => set({ ...addr, pin: v })} />
      <div className="flex items-end">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
          <MapPin className="size-4 text-slate-400" /> Country: India
        </div>
      </div>
    </div>
  )
}

function Checkout({ p, qty, onBack, onPlaced }: { p: Product; qty: number; onBack: () => void; onPlaced: () => void }) {
  const [billing, setBilling] = useState<Addr>(EMPTY)
  const [shipping, setShipping] = useState<Addr>(EMPTY)
  const [same, setSame] = useState(true)
  const [error, setError] = useState('')

  const subtotal = p.price * qty

  const valid = (a: Addr) => a.name && a.phone && a.line1 && a.city && a.state && a.pin

  const place = () => {
    if (!valid(billing) || (!same && !valid(shipping))) {
      setError('Please complete all required billing and shipping fields.')
      return
    }
    onPlaced()
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-orange-600"
      >
        <ChevronLeft className="size-4" /> Back to product
      </button>

      <SectionHeader eyebrow="Checkout" title="Shipping & billing" subtitle="Ships within India only." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Billing address</h2>
            <AddressForm addr={billing} set={setBilling} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Shipping address</h2>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                <input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} className="size-4 accent-orange-500" />
                Same as billing
              </label>
            </div>
            {!same && (
              <div className="mt-4">
                <AddressForm addr={shipping} set={setShipping} />
              </div>
            )}
            {same && (
              <p className="mt-3 text-sm text-slate-400">We'll ship to your billing address.</p>
            )}
          </Card>
        </div>

        {/* summary */}
        <Card className="h-fit p-6">
          <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
          <div className="mt-4 flex items-center gap-3">
            <DeskMateImage variant="device" className="h-16 w-20 shrink-0 rounded-xl" />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-slate-800">{p.name}</div>
              <div className="text-xs text-slate-400">Qty {qty} · Model {p.model}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{money(subtotal, p.currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-black text-slate-900">{money(subtotal, p.currency)}</span>
            </div>
          </div>
          {error && <p className="mt-3 text-xs font-semibold text-red-500">{error}</p>}
          <button
            onClick={place}
            className="mt-4 w-full rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600"
          >
            Place order
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-400">Secure checkout · India only</p>
        </Card>
      </div>
    </div>
  )
}

function Confirmation({ onDone }: { onDone: () => void }) {
  return (
    <Card className="mx-auto max-w-md p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
        <Check className="size-8" />
      </span>
      <h2 className="mt-4 text-2xl font-black text-slate-900">Order placed!</h2>
      <p className="mt-2 text-sm text-slate-500">
        Thank you for your order. Your Worlderly DeskMate will be shipped within India shortly. A confirmation has been sent to your
        registered email.
      </p>
      <button
        onClick={onDone}
        className="mt-6 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-orange-600"
      >
        Back to Store
      </button>
    </Card>
  )
}

// ---------- Root ----------
type View = 'grid' | 'product' | 'checkout' | 'done'

export function Store() {
  const [view, setView] = useState<View>('grid')
  const [product, setProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)

  if (view === 'product' && product) {
    return (
      <ProductDetail
        p={product}
        onBack={() => setView('grid')}
        onBuy={(q) => {
          setQty(q)
          setView('checkout')
        }}
      />
    )
  }

  if (view === 'checkout' && product) {
    return <Checkout p={product} qty={qty} onBack={() => setView('product')} onPlaced={() => setView('done')} />
  }

  if (view === 'done') {
    return <Confirmation onDone={() => setView('grid')} />
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Shop" title="Store" subtitle="Worlderly learning gear, delivered to your door." />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            onOpen={() => {
              setProduct(p)
              setView('product')
            }}
          />
        ))}
      </div>
    </div>
  )
}
