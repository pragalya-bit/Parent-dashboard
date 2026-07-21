'use client'

import { useEffect, useState } from 'react'
import { useApp, type AppTheme, type FontSize, type SettingsPanel } from '@/context/AppContext'

const THEME_ACTIVE =
  'theme-btn border-2 border-orange-400 bg-orange-50 rounded-xl py-6 flex flex-col items-center justify-center space-y-2 text-slate-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer'
const THEME_INACTIVE =
  'theme-btn border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-xl py-6 flex flex-col items-center justify-center space-y-2 text-slate-700 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 cursor-pointer'

const FONT_BTN_BASE =
  'font-btn px-5 py-2 text-xs font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1'
const FONT_ACTIVE = `${FONT_BTN_BASE} text-white bg-orange-500 shadow-md`
const FONT_INACTIVE = `${FONT_BTN_BASE} text-slate-500 hover:bg-slate-200`

const MENU_BASE =
  'w-full text-left text-xs font-bold p-3 rounded-xl flex items-center space-x-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1'
const MENU_ACTIVE = `${MENU_BASE} bg-orange-50 text-orange-600`
const MENU_INACTIVE = `${MENU_BASE} text-slate-500 hover:bg-slate-50`

export function Settings() {
  const { appTheme, fontSize, settingsPanel, studentGoal, setStudentGoal, setAppTheme, setFontSize, setSettingsPanel } =
    useApp()
  const [saved, setSaved] = useState(false)

  const toggleSettingsMenu = (panel: SettingsPanel) => {
    setSettingsPanel(panel)
  }

  // Inline confirmation replaces a blocking alert(); it clears itself after a beat.
  useEffect(() => {
    if (!saved) return
    const id = setTimeout(() => setSaved(false), 2600)
    return () => clearTimeout(id)
  }, [saved])

  return (
    <div className="rounded-3xl p-6 transition-all duration-300 space-y-6">
      <header className="reveal">
        <span className="eyebrow text-orange-500">Preferences</span>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Personalize your Worlderly experience.</p>
      </header>
      <div className="flex gap-6">
        <div className="w-56 shrink-0 space-y-1.5">
          <button
            type="button"
            onClick={() => toggleSettingsMenu('profile')}
            className={settingsPanel === 'profile' ? MENU_ACTIVE : MENU_INACTIVE}
          >
            <span className="text-lg">👤</span> <span>My Profile</span>
          </button>
          <button
            type="button"
            onClick={() => toggleSettingsMenu('appearance')}
            className={settingsPanel === 'appearance' ? MENU_ACTIVE : MENU_INACTIVE}
          >
            <span className="text-lg">🎨</span> <span>Appearance</span>
          </button>
        </div>

        {settingsPanel === 'appearance' && (
          <div className="reveal reveal-1 flex-1 bg-white border border-slate-100 rounded-2xl p-8 shadow-ambient block transition-colors duration-500">
            <h3 className="text-xl font-black text-slate-800 mb-6">Appearance</h3>

            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Theme</h4>
                <div className="grid grid-cols-3 gap-4 max-w-2xl">
                  {(
                    [
                      { id: 'light' as AppTheme, emoji: '☀️', label: 'Light' },
                      { id: 'dark' as AppTheme, emoji: '🌙', label: 'Dark Mode' },
                      { id: 'ocean' as AppTheme, emoji: '🌊', label: 'Ocean' },
                    ] as const
                  ).map(({ id, emoji, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAppTheme(id)}
                      className={appTheme === id ? THEME_ACTIVE : THEME_INACTIVE}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <span className="text-xs font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3">Font Size</h4>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl w-max shadow-inner">
                  {(
                    [
                      { id: 'small' as FontSize, label: 'Small' },
                      { id: 'medium' as FontSize, label: 'Medium' },
                      { id: 'large' as FontSize, label: 'Large' },
                    ] as const
                  ).map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFontSize(id)}
                      className={fontSize === id ? FONT_ACTIVE : FONT_INACTIVE}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {settingsPanel === 'profile' && (
          <div className="reveal reveal-1 flex-1 bg-white border border-slate-100 rounded-2xl p-8 shadow-ambient block transition-colors duration-500">
            <h3 className="text-xl font-black text-slate-800 mb-6">My Profile</h3>
            <div className="flex items-center space-x-4 mb-6 border-b border-slate-50 pb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 border border-orange-200 overflow-hidden flex items-center justify-center text-2xl font-black text-orange-600">
                J
              </div>
              <div>
                <button
                  type="button"
                  className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer relative overflow-hidden"
                >
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  Upload a new avatar
                </button>
                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">JPG, PNG up to 5MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Jhanvi"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Jhanvi"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  Grade
                </label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50">
                  <option>Grade 7</option>
                  <option>Grade 8</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  Board
                </label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50">
                  <option>CBSE</option>
                  <option>ICSE</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  School Name
                </label>
                <input
                  type="text"
                  defaultValue="Metropolitan Civil Academy"
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  Language
                </label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-400 bg-slate-50">
                  <option>English</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5 mb-2">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                  🎯 My goal
                </label>
                <textarea
                  value={studentGoal}
                  onChange={(e) => setStudentGoal(e.target.value)}
                  rows={2}
                  placeholder="What are you aiming for?"
                  className="w-full resize-none border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-400 bg-slate-50 leading-snug"
                />
                <p className="text-[10px] text-slate-400 font-semibold">Shown at the top of your dashboard.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="group inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold pl-5 pr-2 py-2 rounded-full shadow-md shadow-orange-500/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                <span>Save changes</span>
                <span className="grid place-items-center w-7 h-7 rounded-full bg-white/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:scale-105">
                  <i className="fa-solid fa-check text-[11px]" />
                </span>
              </button>
              {saved && (
                <span className="reveal inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <i className="fa-solid fa-circle-check" /> Profile saved
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
