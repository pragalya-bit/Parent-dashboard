// Parent console — the root of this standalone app.
// Client-only (ssr: false); all state (active section, selected child, store
// flow) lives on the client, and the read-only student view embeds client-only
// student-dashboard components.

'use client'

import dynamic from 'next/dynamic'

const Shell = dynamic(() => import('./Parent-Dashboard/shell').then((m) => ({ default: m.Shell })), { ssr: false })

export default function Home() {
  return <Shell />
}
