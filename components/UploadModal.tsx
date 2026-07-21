'use client'

import { useApp } from '@/context/AppContext'

export function UploadModal() {
  const { isUploadModalOpen, closeUploadModal, addTrophyFromFile, addTrophyFromUrl } = useApp()

  if (!isUploadModalOpen) return null

  const handleUrlLink = () => {
    const pathLink = prompt('Paste your verification badge link or URL path here:')
    if (pathLink) {
      addTrophyFromUrl(pathLink)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center border-b pb-2 border-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide">
              Add Content Element
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Select an asset to publish straight to your Trophies Case
            </p>
          </div>
          <button
            type="button"
            onClick={closeUploadModal}
            className="text-slate-400 font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-5 bg-blue-50/50 hover:bg-blue-100 border border-blue-200 rounded-2xl cursor-pointer relative flex flex-col items-center justify-center transition-all">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) addTrophyFromFile(file, 'pdf')
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-3xl block mb-2">🖼️</span>
            <span className="text-[11px] font-black uppercase text-blue-700">Certificate</span>
          </div>
          <div className="p-5 bg-purple-50/50 hover:bg-purple-100 border border-purple-200 rounded-2xl cursor-pointer relative flex flex-col items-center justify-center transition-all">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) addTrophyFromFile(file, 'video')
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-3xl block mb-2">🎬</span>
            <span className="text-[11px] font-black uppercase text-purple-700">Video</span>
          </div>
          <div className="p-5 bg-emerald-50/50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl cursor-pointer relative flex flex-col items-center justify-center transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) addTrophyFromFile(file, 'image')
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-3xl block mb-2">📸</span>
            <span className="text-[11px] font-black uppercase text-emerald-700">Image</span>
          </div>
          <button
            type="button"
            onClick={handleUrlLink}
            className="p-5 bg-red-50/50 hover:bg-red-100 border border-red-200 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all"
          >
            <span className="text-3xl block mb-2">🔗</span>
            <span className="text-[11px] font-black uppercase text-red-700">URL Link</span>
          </button>
        </div>
      </div>
    </div>
  )
}
