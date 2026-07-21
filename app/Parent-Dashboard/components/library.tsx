'use client'

import { useRef, useState } from 'react'
import { UploadCloud, FileText, Trash2, Paperclip, Eye, File as FileIcon, Link2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, SectionHeader } from './shared'
import type { Child } from '../lib/types'

type Category = 'Publication' | 'Worksheet' | 'Exam paper' | 'Other'
const CATEGORIES: Category[] = ['Publication', 'Worksheet', 'Exam paper', 'Other']

const CAT_TINT: Record<Category, string> = {
  Publication: 'bg-violet-50 text-violet-600',
  Worksheet: 'bg-sky-50 text-sky-600',
  'Exam paper': 'bg-red-50 text-red-600',
  Other: 'bg-slate-100 text-slate-500',
}

interface Upload {
  id: string
  name: string
  size: string
  category: Category
  url: string
  when: string
  link?: boolean
}

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// a couple of seeded uploads so the page isn't empty
const SEED: Upload[] = [
  { id: 's1', name: 'Term 2 Science Worksheet.pdf', size: '482 KB', category: 'Worksheet', url: '#', when: 'Uploaded 2 days ago' },
  { id: 's2', name: 'Half-Yearly Math Paper 2025.pdf', size: '1.2 MB', category: 'Exam paper', url: '#', when: 'Uploaded last week' },
]

export function Library({ child }: { child: Child }) {
  const [uploads, setUploads] = useState<Upload[]>(SEED)
  const [category, setCategory] = useState<Category>('Worksheet')
  const [drag, setDrag] = useState(false)
  const [url, setUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const visible = uploads.filter((u) => u.category === category)

  const addUrl = () => {
    const v = url.trim()
    if (!v) return
    const href = /^https?:\/\//i.test(v) ? v : `https://${v}`
    let label = href
    try {
      label = new URL(href).hostname.replace(/^www\./, '') + ' link'
    } catch {}
    setUploads((prev) => [{ id: `l-${Date.now()}`, name: label, size: 'Link', category, url: href, when: 'Just now', link: true }, ...prev])
    setUrl('')
  }

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const added: Upload[] = Array.from(files).map((f, i) => ({
      id: `u-${uploads.length + i}-${f.name}`,
      name: f.name,
      size: humanSize(f.size),
      category,
      url: URL.createObjectURL(f),
      when: 'Just now',
    }))
    setUploads((prev) => [...added, ...prev])
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Resources"
        title="My Library"
        subtitle={`Upload ${child.name}'s school publications, worksheets and exam papers to share with teachers.`}
      />

      {/* category picker — also filters the list below */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const n = uploads.filter((u) => u.category === c).length
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors', category === c ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}
            >
              {c}
              <span className={cn('grid min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold', category === c ? 'bg-white/25 text-white' : 'bg-white text-slate-500')}>{n}</span>
            </button>
          )
        })}
      </div>

      {/* dropzone */}
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed p-10 text-center transition-colors',
          drag ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/40',
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-orange-100 text-orange-600">
          <UploadCloud className="size-7" />
        </span>
        <div className="mt-1 text-sm font-bold text-slate-800">
          Drag &amp; drop files here, or <span className="text-orange-600">browse</span>
        </div>
        <div className="text-xs font-medium text-slate-400">
          Uploading as <span className="font-bold text-slate-600">{category}</span> · PDF, images, DOCX up to 20 MB
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {/* paste a URL — adds a link under the active category */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            placeholder={`Paste a URL to add under ${category} (Drive, website…)`}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-300"
          />
        </div>
        <button onClick={addUrl} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-900">
          <Plus className="size-4" /> Add link
        </button>
      </div>

      {/* uploaded list — only the active category */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{category} files</h2>
          <span className="text-xs font-semibold text-slate-400">{visible.length} file{visible.length === 1 ? '' : 's'}</span>
        </div>

        {visible.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <FileText className="size-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-400">No {category.toLowerCase()} files yet — upload above.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visible.map((u) => (
              <Card key={u.id} className="flex items-center gap-3 p-4">
                <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', u.link ? 'bg-orange-50 text-orange-500' : 'bg-slate-50 text-slate-400')}>
                  {u.link ? <Link2 className="size-5" /> : <FileIcon className="size-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {u.link ? <Link2 className="size-3 shrink-0 text-slate-400" /> : <Paperclip className="size-3 shrink-0 text-slate-400" />}
                    <span className="truncate text-sm font-bold text-slate-800">{u.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', CAT_TINT[u.category])}>{u.category}</span>
                    <span className="text-[11px] font-medium text-slate-400">{u.size} · {u.when}</span>
                  </div>
                </div>
                <a href={u.url} target="_blank" rel="noreferrer" className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50" title="View">
                  <Eye className="size-4" />
                </a>
                <button
                  onClick={() => setUploads((prev) => prev.filter((x) => x.id !== u.id))}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="size-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
