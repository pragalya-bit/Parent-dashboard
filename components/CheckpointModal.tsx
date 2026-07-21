'use client'

// A single checkpoint flag bundles three tasks: an interactive activity, a worksheet and
// a quiz. The student can view and submit each one here. Finishing the LAST
// checkpoint of a week (with a passing quiz) summits the mountain and triggers
// the parachute to the next week. Tasks are optional — the next class runs on
// schedule whether or not they're finished.

import { useEffect, useMemo, useState } from 'react'
import { useApp, JOURNEY_NODES, JOURNEY_CHAPTERS } from '@/context/AppContext'

type TabKey = 'interactive' | 'worksheet' | 'quiz'

const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'interactive', icon: '🎮', label: 'Interactive activity' },
  { key: 'worksheet', icon: '📐', label: 'Worksheet' },
  { key: 'quiz', icon: '🧠', label: 'Quiz' },
]

interface Question {
  q: string
  options: string[]
  answer: number
}

const QUESTIONS: Question[] = [
  { q: 'Solve: 2x + 3 = 11.  x = ?', options: ['3', '4', '5', '6'], answer: 1 },
  { q: 'Simplify: 5a − 2a', options: ['3a', '7a', '10a', '2a'], answer: 0 },
  { q: 'If x = 4, what is 3x − 5 ?', options: ['7', '12', '17', '9'], answer: 0 },
  { q: 'Which one is a linear equation?', options: ['x² + 1 = 0', '2x + 1 = 5', 'x³ = 8', '√x = 2'], answer: 1 },
]

// Upload your answer script (client-side only — no file leaves the browser).
function UploadBox({
  accent,
  fileName,
  onPick,
}: {
  accent: 'orange' | 'sky'
  fileName: string | null
  onPick: (name: string) => void
}) {
  const ring = accent === 'orange' ? 'border-orange-300 text-orange-600' : 'border-sky-300 text-sky-600'
  return (
    <label
      className={`flex flex-col items-center justify-center gap-1 w-full rounded-2xl border-2 border-dashed cursor-pointer px-4 py-5 transition-colors ${
        fileName ? 'bg-emerald-50 border-emerald-300' : `bg-white hover:bg-slate-50 ${ring}`
      }`}
    >
      <input
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.heic,.doc,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f.name)
        }}
      />
      {fileName ? (
        <>
          <span className="text-2xl">✅</span>
          <span className="text-xs font-black text-emerald-700 max-w-full truncate">📎 {fileName}</span>
          <span className="text-[10px] font-bold text-emerald-600">Uploaded · tap to replace</span>
        </>
      ) : (
        <>
          <span className="text-2xl">⬆️</span>
          <span className="text-xs font-black">Upload your answer script</span>
          <span className="text-[10px] font-bold text-slate-400">PDF, image or doc — snap a photo or pick a file</span>
        </>
      )}
    </label>
  )
}

export function CheckpointModal() {
  const { checkpointNode, closeCheckpoint, completeCheckpoint } = useApp()
  const [tab, setTab] = useState<TabKey>('interactive')
  const [interactiveFile, setInteractiveFile] = useState<string | null>(null)
  const [worksheetFile, setWorksheetFile] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null))
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const interactiveDone = !!interactiveFile
  const worksheetDone = !!worksheetFile

  // Reset everything each time a checkpoint is opened.
  useEffect(() => {
    if (checkpointNode != null) {
      setTab('interactive')
      setInteractiveFile(null)
      setWorksheetFile(null)
      setAnswers(QUESTIONS.map(() => null))
      setQuizSubmitted(false)
    }
  }, [checkpointNode])

  const node = checkpointNode != null ? JOURNEY_NODES[checkpointNode] : null
  const week = node ? JOURNEY_CHAPTERS[node.chapter - 1] : null
  const isWeekEnd = checkpointNode != null && checkpointNode % 4 === 3

  const correctCount = useMemo(
    () => answers.filter((a, i) => a === QUESTIONS[i].answer).length,
    [answers],
  )
  const scorePct = Math.round((correctCount / QUESTIONS.length) * 100)
  const quizPassed = quizSubmitted && scorePct >= 60

  if (checkpointNode == null || !node) return null

  function finish() {
    if (checkpointNode == null) return
    // Hand the quiz result to the context — a passing week-end checkpoint fires
    // the summit celebration; everything else just advances the trek.
    completeCheckpoint(checkpointNode, quizSubmitted ? correctCount : 0, QUESTIONS.length)
  }

  const tasksDone = (interactiveDone ? 1 : 0) + (worksheetDone ? 1 : 0) + (quizSubmitted ? 1 : 0)

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-orange-100 max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
          <div>
            <span className="text-[10px] font-extrabold text-white/90 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1 w-max">
              Week {node.chapter} · {week?.title ?? ''}
            </span>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              🚩 Checkpoint {isWeekEnd ? '· Summit' : ''}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeCheckpoint}
            className="text-white/90 font-bold bg-white/20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 pt-3 pb-2 border-b border-slate-100">
          {TABS.map((t) => {
            const active = tab === t.key
            const done =
              (t.key === 'interactive' && interactiveDone) ||
              (t.key === 'worksheet' && worksheetDone) ||
              (t.key === 'quiz' && quizSubmitted)
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-black py-2 rounded-xl border transition-all ${
                  active
                    ? 'bg-orange-500 border-orange-500 text-white shadow'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-orange-300'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {done && <span className={active ? 'text-white' : 'text-emerald-500'}>✓</span>}
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {tab === 'interactive' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <h4 className="text-sm font-black text-slate-800">🎮 Build-a-Balance interactive activity</h4>
                <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                  Play through the drag-and-drop balance challenge — build 5 of your own equations
                  where both sides balance, then solve for the unknown. Snap a photo or upload your work to submit.
                </p>
                <div className="flex gap-2 mt-3 text-[11px] font-bold">
                  <span className="bg-white border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full">⏳ Due Sun</span>
                  <span className="bg-white border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full">🪙 +75</span>
                </div>
              </div>
              <UploadBox accent="orange" fileName={interactiveFile} onPick={setInteractiveFile} />
            </div>
          )}

          {tab === 'worksheet' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <h4 className="text-sm font-black text-slate-800">📐 Practice worksheet</h4>
                <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                  10 guided problems on this week&apos;s skill. View it online, work through each
                  one, and mark it complete when you&apos;re done.
                </p>
                <div className="flex gap-2 mt-3 text-[11px] font-bold">
                  <span className="bg-white border border-sky-100 text-sky-600 px-2.5 py-1 rounded-full">📄 10 problems</span>
                  <span className="bg-white border border-sky-100 text-sky-600 px-2.5 py-1 rounded-full">🪙 +60</span>
                </div>
              </div>
              <UploadBox accent="sky" fileName={worksheetFile} onPick={setWorksheetFile} />
            </div>
          )}

          {tab === 'quiz' && (
            <div className="space-y-4">
              {!quizSubmitted ? (
                <>
                  <p className="text-xs font-bold text-slate-400">
                    {QUESTIONS.length} quick questions · 60% to clear the checkpoint.
                  </p>
                  {QUESTIONS.map((question, qi) => (
                    <div key={qi}>
                      <p className="text-sm font-bold text-slate-800 mb-2">
                        {qi + 1}. {question.q}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((opt, oi) => {
                          const selected = answers[qi] === oi
                          return (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                              className={`text-xs font-bold py-2.5 px-3 rounded-xl border text-left transition-all ${
                                selected
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-orange-300'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-sm py-3 rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Submit &amp; See Score
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div
                    className={`rounded-2xl border p-4 text-center ${
                      quizPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div className="text-4xl mb-1">{quizPassed ? '🎉' : '💪'}</div>
                    <h4 className="text-base font-black text-slate-800">
                      {correctCount}/{QUESTIONS.length} correct · {scorePct}%
                    </h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                      {quizPassed ? 'Checkpoint quiz cleared!' : 'Below 60% — you can retry anytime.'}
                    </p>
                  </div>
                  {QUESTIONS.map((question, qi) => {
                    const chosen = answers[qi]
                    const isCorrect = chosen === question.answer
                    return (
                      <div
                        key={qi}
                        className={`rounded-xl border p-3 ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-800 flex items-start gap-1.5">
                          <span>{isCorrect ? '✅' : '❌'}</span>
                          <span>{qi + 1}. {question.q}</span>
                        </p>
                        <div className="text-[11px] font-semibold mt-1.5 pl-5">
                          <span className="text-emerald-700">
                            Correct: <strong>{question.options[question.answer]}</strong>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers(QUESTIONS.map(() => null))
                      setQuizSubmitted(false)
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    ↺ Retry quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-3">
          <span className="text-[11px] font-black text-slate-400">{tasksDone}/3 tasks done</span>
          <div className="flex-1" />
          <button
            type="button"
            onClick={closeCheckpoint}
            className="text-[12px] font-bold text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={finish}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black text-[13px] px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
          >
            {isWeekEnd && quizPassed ? '🏔️ Summit the week' : 'Finish checkpoint'}
          </button>
        </div>
      </div>
    </div>
  )
}
