# Worlderly · Parent Dashboard

A standalone Next.js app for the **Parent console** — the Worlderly workspace
where a parent tracks their child's learning: schedule, progress, billing,
messages, the store, and a read-only view of the child's actual student
dashboard.

The Parent dashboard loads at the root route (`/`).

## Sections

- **Dashboard** — child overview: classes this month, badges, attendance, next class + join, recent activity
- **Student Dashboard** — the child's *real* student dashboard, embedded read-only (My Dashboard / Portfolio / Resources / Courses)
- **Schedule**, **My Library**, **Billing & Plans**, **Messages**, **Store** (DeskMate PDP + checkout), **Community**, **Settings**
- A child-picker in the sidebar to switch between children

## Note on contents

Besides `app/Parent-Dashboard/`, this repo also includes the shared
student-dashboard code (`components/`, `context/`, `lib/`) because the parent's
**Student Dashboard** view embeds the child's real student components. The other
Worlderly consoles (LEC, SME, mentor) are intentionally **not** included.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query ·
Framer Motion · Recharts · lucide-react · Quicksand. Data is mocked — no backend
required.
