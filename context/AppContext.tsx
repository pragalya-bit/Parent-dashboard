'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Tab = 'dashboard' | 'portfolio' | 'resources' | 'courses' | 'messages' | 'settings'
export type AppTheme = 'light' | 'dark' | 'ocean'
export type FontSize = 'small' | 'medium' | 'large'
export type PortfolioTheme = 'default' | 'chalkboard' | 'bubblegum' | 'arcade'
export type SettingsPanel = 'profile' | 'appearance'

export interface TrophyItem {
  id: string
  icon: string
  title: string
  subtitle: string
  iconBg: string
  iconBorder: string
  subtitleColor: string
  cardBorder: string
  animate?: boolean
}

export type DetailAccent = 'orange' | 'amber' | 'sky' | 'purple' | 'emerald' | 'blue'

/** Detail shown in the dashboard's first container when hovering the
 *  calendar or a journey-map bubble. */
export interface HoverDetail {
  badge: string
  title: string
  time?: string
  meta?: string
  status?: string
  accent: DetailAccent
  hint?: string
}

// A class is a Base Camp; a checkpoint bundles assignment + worksheet + quiz.
export type JourneyNodeType = 'class' | 'checkpoint'

export interface JourneyNode {
  id: string
  type: JourneyNodeType
  label: string
  /** which WEEK (mountain) this node belongs to */
  chapter: number
  x: number
  y: number
}

// Each "chapter" here is one WEEK = one mountain on the trek.
export interface JourneyChapter {
  id: number
  title: string
  peakX: number
  peakY: number
}

interface AppContextValue {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  appTheme: AppTheme
  fontSize: FontSize
  accentHue: number
  settingsPanel: SettingsPanel
  portfolioTheme: PortfolioTheme
  currentMonthOffset: number
  isUploadModalOpen: boolean
  /** summit flow overlay state: null = closed */
  summitResult: { score: number; total: number; chapter: number } | null
  closeSummitFlow: () => void
  /** gear ids collected from summit treasures */
  backpack: string[]
  /** node index the parachute flies FROM (week-end checkpoint), or null */
  pendingFlight: number | null
  clearFlight: () => void
  /** fired at the START of the treasure phase — rewards + progress, atomically */
  persistSummit: (scorePct: number) => void
  /** node index of the open checkpoint (assignment + worksheet + quiz), or null */
  checkpointNode: number | null
  openCheckpoint: (i: number) => void
  closeCheckpoint: () => void
  completeCheckpoint: (i: number, score: number, total: number) => void
  /** last quiz score percentage, or null if not taken yet */
  lastQuizScore: number | null
  /** index of the node the student is currently standing on */
  studentStep: number
  /** index of the node the mentor is standing on (one step ahead) */
  teacherStep: number
  /** the student's self-set learning goal, shown on the dashboard + edited in settings */
  studentGoal: string
  setStudentGoal: (goal: string) => void
  hoverDetail: HoverDetail | null
  setHoverDetail: (detail: HoverDetail | null) => void
  advanceStudent: () => void
  resetJourney: () => void
  trophies: TrophyItem[]
  setAppTheme: (theme: AppTheme) => void
  setFontSize: (size: FontSize) => void
  setAccentHue: (hue: number) => void
  setSettingsPanel: (panel: SettingsPanel) => void
  setPortfolioTheme: (theme: PortfolioTheme) => void
  navigateMonth: (direction: number) => void
  openUploadModal: () => void
  closeUploadModal: () => void
  addTrophyFromFile: (file: File, typeKey: 'pdf' | 'video' | 'image') => void
  addTrophyFromUrl: (url: string) => void
  secureInAppView: (assetType: string) => void
  copyShareLink: () => void
  handleJoinClass: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const INITIAL_TROPHIES: TrophyItem[] = [
  {
    id: '1',
    icon: '🥋',
    title: 'Advanced Brown Belt',
    subtitle: 'Karate Rank Certification',
    iconBg: 'bg-red-50',
    iconBorder: 'border',
    subtitleColor: 'text-slate-400',
    cardBorder: 'border-slate-100',
  },
  {
    id: '2',
    icon: '♟️',
    title: 'Top 5 Finalist Medal',
    subtitle: 'District Open Chess Tournament',
    iconBg: 'bg-blue-50',
    iconBorder: 'border',
    subtitleColor: 'text-slate-400',
    cardBorder: 'border-slate-100',
  },
  {
    id: '3',
    icon: '🔬',
    title: 'Gold Winner Shield',
    subtitle: 'Science Quiz Bowl League',
    iconBg: 'bg-purple-50',
    iconBorder: 'border',
    subtitleColor: 'text-slate-400',
    cardBorder: 'border-slate-100',
  },
]

// Each WEEK is a mountain. Per week: 2 classes (base camps) + 2 checkpoints
// (each checkpoint bundles assignment + worksheet + quiz). The range climbs
// gently week over week — learning = growing. Coordinate space 2440 x 470.
// Each successive mountain is TALLER than the last (smaller peakY = taller),
// so the trek visibly climbs week over week. Base camps all sit near the
// valley floor (y≈360); peaks rise from 150 → 46.
export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  { id: 1, title: 'Variables', peakX: 405, peakY: 150 },
  { id: 2, title: 'Simple Equations', peakX: 875, peakY: 124 },
  { id: 3, title: 'Balancing', peakX: 1345, peakY: 98 },
  { id: 4, title: 'Word Problems', peakX: 1815, peakY: 72 },
  { id: 5, title: 'Review & Mastery', peakX: 2285, peakY: 46 },
]

// Per week, in order: Class 1 (base camp), Checkpoint 1, Class 2, Checkpoint 2
// (the summit). Each week climbs from the valley floor up to its taller peak.
export const JOURNEY_NODES: JourneyNode[] = [
  // Week 1 — peak 150
  { id: 'w1-c1', type: 'class', label: 'Class 1', chapter: 1, x: 90, y: 360 },
  { id: 'w1-k1', type: 'checkpoint', label: 'Checkpoint', chapter: 1, x: 190, y: 276 },
  { id: 'w1-c2', type: 'class', label: 'Class 2', chapter: 1, x: 300, y: 213 },
  { id: 'w1-k2', type: 'checkpoint', label: 'Checkpoint', chapter: 1, x: 405, y: 150 },
  // Week 2 — peak 124
  { id: 'w2-c1', type: 'class', label: 'Class 1', chapter: 2, x: 560, y: 360 },
  { id: 'w2-k1', type: 'checkpoint', label: 'Checkpoint', chapter: 2, x: 660, y: 266 },
  { id: 'w2-c2', type: 'class', label: 'Class 2', chapter: 2, x: 770, y: 195 },
  { id: 'w2-k2', type: 'checkpoint', label: 'Checkpoint', chapter: 2, x: 875, y: 124 },
  // Week 3 — peak 98
  { id: 'w3-c1', type: 'class', label: 'Class 1', chapter: 3, x: 1030, y: 360 },
  { id: 'w3-k1', type: 'checkpoint', label: 'Checkpoint', chapter: 3, x: 1130, y: 255 },
  { id: 'w3-c2', type: 'class', label: 'Class 2', chapter: 3, x: 1240, y: 177 },
  { id: 'w3-k2', type: 'checkpoint', label: 'Checkpoint', chapter: 3, x: 1345, y: 98 },
  // Week 4 — peak 72
  { id: 'w4-c1', type: 'class', label: 'Class 1', chapter: 4, x: 1500, y: 360 },
  { id: 'w4-k1', type: 'checkpoint', label: 'Checkpoint', chapter: 4, x: 1600, y: 245 },
  { id: 'w4-c2', type: 'class', label: 'Class 2', chapter: 4, x: 1710, y: 158 },
  { id: 'w4-k2', type: 'checkpoint', label: 'Checkpoint', chapter: 4, x: 1815, y: 72 },
  // Week 5 — peak 46
  { id: 'w5-c1', type: 'class', label: 'Class 1', chapter: 5, x: 1970, y: 360 },
  { id: 'w5-k1', type: 'checkpoint', label: 'Checkpoint', chapter: 5, x: 2070, y: 234 },
  { id: 'w5-c2', type: 'class', label: 'Class 2', chapter: 5, x: 2180, y: 140 },
  { id: 'w5-k2', type: 'checkpoint', label: 'Checkpoint', chapter: 5, x: 2285, y: 46 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [appTheme, setAppTheme] = useState<AppTheme>('light')
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [accentHue, setAccentHue] = useState(0)
  const [settingsPanel, setSettingsPanel] = useState<SettingsPanel>('appearance')
  const [portfolioTheme, setPortfolioTheme] = useState<PortfolioTheme>('default')
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null)
  // Student starts at the very first node (Class 1); the mentor is always a
  // step ahead, having "uploaded" the next piece of the quest.
  const [studentStep, setStudentStep] = useState(0)
  const teacherStep = Math.min(studentStep + 1, JOURNEY_NODES.length - 1)
  const [hoverDetail, setHoverDetail] = useState<HoverDetail | null>(null)
  const [studentGoal, setStudentGoal] = useState('I should get 100% in week 2 quiz')
  const [trophies, setTrophies] = useState<TrophyItem[]>(INITIAL_TROPHIES)

  const advanceStudent = useCallback(() => {
    setStudentStep((prev) => Math.min(prev + 1, JOURNEY_NODES.length - 1))
  }, [])

  const resetJourney = useCallback(() => setStudentStep(0), [])

  const [summitResult, setSummitResult] = useState<{
    score: number
    total: number
    chapter: number
  } | null>(null)
  const [backpack, setBackpack] = useState<string[]>([])
  // node index of the week-end checkpoint to fly FROM (parachute), or null
  const [pendingFlight, setPendingFlight] = useState<number | null>(null)
  // node index of the open checkpoint, or null
  const [checkpointNode, setCheckpointNode] = useState<number | null>(null)

  const closeSummitFlow = useCallback(() => setSummitResult(null), [])
  const clearFlight = useCallback(() => setPendingFlight(null), [])

  const openCheckpoint = useCallback((i: number) => setCheckpointNode(i), [])
  const closeCheckpoint = useCallback(() => setCheckpointNode(null), [])

  // A checkpoint is the last node of its week when index % 4 === 3. Finishing
  // the week's final checkpoint with a passing quiz fires the full celebration.
  const completeCheckpoint = useCallback((i: number, score: number, total: number) => {
    setCheckpointNode(null)
    const weekEnd = i % 4 === 3
    if (weekEnd && total > 0 && (score / total) * 100 >= 60) {
      setSummitResult({ score, total, chapter: Math.floor(i / 4) + 1 })
    } else {
      setStudentStep((prev) => Math.min(prev + 1, JOURNEY_NODES.length - 1))
    }
  }, [])

  // Persist (treasure phase): gear into backpack, advance past the cleared week,
  // and queue the parachute glide from the week-end checkpoint to the next base.
  const persistSummit = useCallback((scorePct: number) => {
    setLastQuizScore(scorePct)
    setBackpack((prev) => [...prev, 'oxygen', 'tent', 'compass'])
    setStudentStep((prev) => {
      setPendingFlight(prev)
      return Math.min(prev + 1, JOURNEY_NODES.length - 1)
    })
  }, [])

  useEffect(() => {
    const body = document.body
    body.classList.remove('theme-dark', 'theme-ocean', 'font-small', 'font-large')
    if (appTheme === 'dark') body.classList.add('theme-dark')
    else if (appTheme === 'ocean') body.classList.add('theme-ocean')
    if (fontSize === 'small') body.classList.add('font-small')
    else if (fontSize === 'large') body.classList.add('font-large')
    // Tailwind text sizes are rem-based, so scale the root element —
    // body-level font-size would leave them untouched.
    document.documentElement.style.fontSize =
      fontSize === 'small' ? '87.5%' : fontSize === 'large' ? '112.5%' : '100%'
    body.style.filter = `hue-rotate(${accentHue}deg)`
  }, [appTheme, fontSize, accentHue])

  const navigateMonth = useCallback((direction: number) => {
    setCurrentMonthOffset((prev) => {
      const next = prev + direction
      if (next < -1) return -1
      if (next > 1) return 1
      return next
    })
  }, [])

  const openUploadModal = useCallback(() => setIsUploadModalOpen(true), [])
  const closeUploadModal = useCallback(() => setIsUploadModalOpen(false), [])

  const addTrophyFromFile = useCallback(
    (file: File, typeKey: 'pdf' | 'video' | 'image') => {
      const config = {
        pdf: {
          icon: '📄',
          iconBg: 'bg-emerald-50',
          iconBorder: 'border border-emerald-100',
          subtitleColor: 'text-emerald-600',
          cardBorder: 'border-emerald-200',
        },
        video: {
          icon: '🎬',
          iconBg: 'bg-purple-50',
          iconBorder: 'border border-purple-100',
          subtitleColor: 'text-purple-600',
          cardBorder: 'border-emerald-200',
        },
        image: {
          icon: '📸',
          iconBg: 'bg-blue-50',
          iconBorder: 'border border-blue-100',
          subtitleColor: 'text-blue-600',
          cardBorder: 'border-emerald-200',
        },
      }[typeKey]

      setTrophies((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          icon: config.icon,
          title: file.name,
          subtitle: 'Newly Added Accomplishment',
          iconBg: config.iconBg,
          iconBorder: config.iconBorder,
          subtitleColor: config.subtitleColor,
          cardBorder: config.cardBorder,
          animate: true,
        },
      ])
      setIsUploadModalOpen(false)
      alert('Success! The new asset has been loaded into your Trophies Case.')
    },
    [],
  )

  const addTrophyFromUrl = useCallback((url: string) => {
    setTrophies((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        icon: '🔗',
        title: url,
        subtitle: 'External Connected Resource',
        iconBg: 'bg-red-50',
        iconBorder: 'border border-red-100',
        subtitleColor: 'text-red-600',
        cardBorder: 'border-red-200',
        animate: true,
      },
    ])
    setIsUploadModalOpen(false)
    alert('Success! Your URL Link has been pinned into your Trophies Case.')
  }, [])

  const secureInAppView = useCallback((assetType: string) => {
    alert(
      `Opening secure in-app viewer for ${assetType}.\n\nNote: Downloads and screenshots are restricted for security reasons.`,
    )
  }, [])

  const copyShareLink = useCallback(() => {
    alert('Unique portfolio web tracer link copied safely!')
  }, [])

  const handleJoinClass = useCallback(() => {
    alert('Connecting to Live Video Server... Room 106 initialized!')
  }, [])

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      appTheme,
      fontSize,
      accentHue,
      settingsPanel,
      portfolioTheme,
      currentMonthOffset,
      isUploadModalOpen,
      lastQuizScore,
      studentStep,
      teacherStep,
      studentGoal,
      setStudentGoal,
      hoverDetail,
      setHoverDetail,
      advanceStudent,
      resetJourney,
      summitResult,
      closeSummitFlow,
      backpack,
      pendingFlight,
      clearFlight,
      persistSummit,
      checkpointNode,
      openCheckpoint,
      closeCheckpoint,
      completeCheckpoint,
      trophies,
      setAppTheme,
      setFontSize,
      setAccentHue,
      setSettingsPanel,
      setPortfolioTheme,
      navigateMonth,
      openUploadModal,
      closeUploadModal,
      addTrophyFromFile,
      addTrophyFromUrl,
      secureInAppView,
      copyShareLink,
      handleJoinClass,
    }),
    [
      activeTab,
      appTheme,
      fontSize,
      accentHue,
      settingsPanel,
      portfolioTheme,
      currentMonthOffset,
      isUploadModalOpen,
      lastQuizScore,
      studentStep,
      teacherStep,
      studentGoal,
      hoverDetail,
      advanceStudent,
      resetJourney,
      summitResult,
      closeSummitFlow,
      backpack,
      pendingFlight,
      clearFlight,
      persistSummit,
      checkpointNode,
      openCheckpoint,
      closeCheckpoint,
      completeCheckpoint,
      trophies,
      navigateMonth,
      openUploadModal,
      closeUploadModal,
      addTrophyFromFile,
      addTrophyFromUrl,
      secureInAppView,
      copyShareLink,
      handleJoinClass,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
