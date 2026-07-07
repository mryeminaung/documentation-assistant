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
import { DEFAULT_LANGUAGE, DEFAULT_TASK, TASKS } from './lib/constants'

const isCreatorTask = (id) => id === 'creator'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const [task, setTask] = useState(DEFAULT_TASK)
  const [code, setCode] = useState('')

  const { run, status, result, error } = useClaudeRequest()
  const { toast, showToast } = useToast()
  const { theme, toggle: toggleTheme } = useTheme()

  const activeTask = TASKS.find((t) => t.id === task) ?? TASKS[0]
  const showCreator = isCreatorTask(task)

  const handleGenerate = () => {
    run({ task, code, language })
  }

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-bg text-ink dark:bg-[#171B21] dark:text-[#E7E9EC]">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <TaskTabs value={task} onChange={setTask} />

        {showCreator ? (
          <main className="flex flex-1 overflow-hidden">
            <About />
          </main>
        ) : (
          <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:gap-5 md:overflow-hidden md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-sm font-semibold text-ink dark:text-[#E7E9EC]">
                  {activeTask.label}
                </h2>
                <p className="text-xs text-muted">{activeTask.description}</p>
              </div>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:overflow-hidden">
              <div className="min-h-[260px] md:min-h-0">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  placeholder="Paste your code here…"
                  language={language}
                  theme={theme}
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
