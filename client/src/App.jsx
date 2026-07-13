import { useCallback, useState } from 'react'
import About from './components/About'
import CodeEditor from './components/CodeEditor'
import GenerateButton from './components/GenerateButton'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import ResponsePanel from './components/ResponsePanel'
import SplashScreen from './components/SplashScreen'
import TaskTabs from './components/TaskTabs'
import Toast from './components/Toast'
import { useClaudeRequest } from './hooks/useClaudeRequest'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { DEFAULT_LANGUAGE, DEFAULT_TASK, TASKS, EXT_TO_LANG } from './lib/constants'

function MenuIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

const isCreatorTask = (id) => id === 'creator'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [task, setTask] = useState(DEFAULT_TASK)
  const [code, setCode] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState(null)

  const { run, status, result, error } = useClaudeRequest()
  const { toast, showToast } = useToast()
  const { theme, toggle: toggleTheme } = useTheme()

  const activeTask = TASKS.find((t) => t.id === task) ?? TASKS[0]
  const showCreator = isCreatorTask(task)

  const handleGenerate = () => {
    run({ task, code, language })
  }

  const handleFileUpload = useCallback((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !EXT_TO_LANG[ext]) {
      showToast({ message: `Unsupported file type: .${ext ?? 'unknown'}`, tone: 'error' })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') {
        setCode(content)
        setUploadedFileName(file.name)
        setLanguage(EXT_TO_LANG[ext])
      }
    }
    reader.readAsText(file)
  }, [showToast])

  const handleFileClear = useCallback(() => {
    setCode('')
    setUploadedFileName(null)
  }, [])

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-bg text-ink dark:bg-[#171B21] dark:text-[#E7E9EC]">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <TaskTabs
          value={task}
          onChange={setTask}
          className={sidebarOpen ? '' : 'md:hidden'}
        />

        {showCreator ? (
          <main className="flex flex-1 overflow-hidden">
            <About />
          </main>
        ) : (
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-5 md:overflow-hidden md:p-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
                className="hidden md:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-panel
                           text-muted transition-colors hover:border-accent/40 hover:text-accent
                           focus-visible:outline-none dark:bg-[#1F242C]"
              >
                <MenuIcon className="h-4 w-4" />
              </button>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-sm font-semibold text-ink dark:text-[#E7E9EC]">
                    {activeTask.label}
                  </h2>
                  <p className="text-xs text-muted">{activeTask.description}</p>
                </div>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:overflow-hidden">
              <div className="min-h-[260px] md:min-h-0">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  placeholder="Paste your code here…"
                  language={language}
                  theme={theme}
                  onFileUpload={handleFileUpload}
                  onFileClear={handleFileClear}
                  fileName={uploadedFileName}
                />
              </div>
              <div className="min-h-[260px] md:min-h-0">
                <ResponsePanel
                  status={status}
                  result={result}
                  error={error}
                  onToast={showToast}
                />
              </div>
            </div>

            <div className="flex justify-stretch sm:justify-end">
              <GenerateButton
                onClick={handleGenerate}
                disabled={status === 'loading'}
                loading={status === 'loading'}
              />
            </div>
          </main>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  )
}
