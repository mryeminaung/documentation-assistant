import { useEffect, useState } from 'react'
import logo from '../assets/doc-assistant-logo.svg'

const LINES = [
  'const app = new DocumentationAssistant();',
  'await app.initialize();',
  'app.ready();',
]

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0)      // 0=typing, 1=done, 2=exit
  const [visibleLines, setVisibleLines] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  // Type out each line one character at a time
  useEffect(() => {
    if (phase !== 0) return
    if (visibleLines >= LINES.length) {
      setPhase(1)
      return
    }

    const line = LINES[visibleLines]
    if (charIndex < line.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), 25)
      return () => clearTimeout(timer)
    }

    // Line done — move to next after a small pause
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1)
      setCharIndex(0)
    }, 200)
    return () => clearTimeout(timer)
  }, [phase, visibleLines, charIndex])

  // After typing finishes, wait then fade out
  useEffect(() => {
    if (phase !== 1) return
    const timer = setTimeout(() => setPhase(2), 800)
    return () => clearTimeout(timer)
  }, [phase])

  // After fade out, unmount
  useEffect(() => {
    if (phase !== 2) return
    const timer = setTimeout(onComplete, 500)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg p-6 transition-opacity duration-500 dark:bg-[#171B21] ${
        phase === 2 ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo / Icon */}
      <div className="splash-logo mb-3">
        <img src={logo} alt="Documentation Assistant" className="h-20 w-20" />
      </div>

      {/* Title */}
      <h1 className="splash-title font-display text-2xl font-bold text-ink dark:text-[#E7E9EC] sm:text-3xl">
        Documentation Assistant
      </h1>
      <p className="splash-subtitle mt-2 text-sm text-muted">
        Powered by Claude AI
      </p>

      {/* Code typing animation */}
      <div className="mt-10 w-full max-w-md overflow-hidden rounded-lg border border-border bg-panel-alt p-4 font-mono text-xs shadow-xl dark:bg-[#242A33] sm:text-sm">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex gap-2 leading-relaxed">
            <span className="select-none text-muted/40">{i + 1}</span>
            <span className="text-green-600 dark:text-green-400">{line}</span>
          </div>
        ))}
        {visibleLines < LINES.length && (
          <div className="flex gap-2 leading-relaxed">
            <span className="select-none text-muted/40">{visibleLines + 1}</span>
            <span className="text-green-600 dark:text-green-400">
              {LINES[visibleLines].slice(0, charIndex)}
              <span className="splash-cursor inline-block h-4 w-0.5 animate-pulse bg-accent align-middle" />
            </span>
          </div>
        )}
      </div>

      {/* Loading dots */}
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="splash-dot h-2 w-2 rounded-full bg-accent"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
