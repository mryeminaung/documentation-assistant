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
import WorkspaceSplit from './components/WorkspaceSplit'
import { useClaudeRequest } from './hooks/useClaudeRequest'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { DEFAULT_LANGUAGE, DEFAULT_TASK, TASKS, EXT_TO_LANG } from './lib/constants'

const isCreatorTask = (id) => id === 'creator'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [sidebarCompact, setSidebarCompact] = useState(false)
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
      showToast(`Unsupported file type: .${ext ?? 'unknown'}`, 'error')
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
          compact={sidebarCompact}
          onToggleCompact={() => setSidebarCompact((current) => !current)}
        />

        {showCreator ? (
          <main className="flex flex-1 overflow-hidden">
            <About />
          </main>
        ) : (
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-5 md:p-6 lg:overflow-hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted/70">
                  Workspace
                </p>
                <div>
                  <h2 className="font-display text-base font-semibold leading-tight text-ink dark:text-[#E7E9EC]">
                    {activeTask.label}
                  </h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{activeTask.description}</p>
                </div>
              </div>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <WorkspaceSplit
              status={status}
              editor={
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
              }
              response={
                <ResponsePanel
                  status={status}
                  result={result}
                  error={error}
                  onToast={showToast}
                />
              }
              action={
                <GenerateButton
                  onClick={handleGenerate}
                  disabled={status === 'loading'}
                  loading={status === 'loading'}
                />
              }
            />
          </main>
        )}
      </div>

      <Toast toast={toast} />
    </div>
  )
}
