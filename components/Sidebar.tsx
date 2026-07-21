'use client'

import { useApp, type Tab } from '@/context/AppContext'

export const NAV_ITEMS: { id: Tab; icon: string; label: string; hasUpdate?: boolean }[] = [
  { id: 'dashboard', icon: 'fa-solid fa-gauge-high', label: 'My Dashboard' },
  { id: 'portfolio', icon: 'fa-solid fa-id-badge', label: 'My Portfolio' },
  { id: 'resources', icon: 'fa-solid fa-book-open', label: 'Resources', hasUpdate: true },
  { id: 'courses', icon: 'fa-solid fa-clapperboard', label: 'Courses', hasUpdate: true },
  { id: 'messages', icon: 'fa-solid fa-comment-dots', label: 'Messages', hasUpdate: true },
  { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings' },
]

export function Sidebar() {
  const { activeTab, setActiveTab } = useApp()

  return (
    <aside className="hidden md:flex w-60 lg:w-64 h-full bg-white border-r border-orange-100 flex-col justify-between p-5 shrink-0 z-10 transition-colors duration-300">
      <div>
        <div className="reveal text-2xl font-black text-orange-600 mb-6 tracking-wide text-center">Worlderly</div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ id, icon, label, hasUpdate }, i) => {
            const isActive = activeTab === id
            const base =
              'group w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2'
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`reveal reveal-${i + 1} ${base} ${
                  isActive
                    ? 'font-semibold bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'font-medium text-slate-500 hover:bg-orange-50 hover:text-orange-600 active:scale-[0.98]'
                }`}
              >
                {/* nested icon tray — button-in-button treatment */}
                <span
                  className={`grid place-items-center w-7 h-7 rounded-lg text-base shrink-0 transition-colors duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-white'
                  }`}
                >
                  <i className={icon} />
                </span>
                <span>{label}</span>
                {hasUpdate && (
                  <i
                    className={`fa-solid fa-bell ml-auto text-xs animate-pulse ${isActive ? 'text-white' : 'text-orange-500'}`}
                    title="New update"
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center space-x-3 border-t border-slate-100 pt-4 transition-colors duration-300">
        <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-extrabold text-base shadow-inner shrink-0">
          J
        </div>
        <div>
          <div className="font-bold text-sm text-slate-800">Jhanvi</div>
          <div className="text-xs text-slate-400 font-medium">Grade 5 • Worlderly</div>
        </div>
      </div>
    </aside>
  )
}
