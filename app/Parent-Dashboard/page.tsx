// Parent-facing dashboard — "Parent Dashboard". Served at /Parent-Dashboard.
// (Folder is hyphenated because Next.js App Router can't route a path segment
// containing a space.)
//
// Client-only (ssr: false) to mirror the other Worlderly dashboards; all state
// (active section, selected child, store flow) lives on the client.

'use client'

import dynamic from 'next/dynamic'

const Shell = dynamic(() => import('./shell').then((m) => ({ default: m.Shell })), { ssr: false })

export default function ParentDashboardPage() {
  return <Shell />
}
