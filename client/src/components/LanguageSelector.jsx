import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../lib/constants'
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiOpenjdk,
  SiCplusplus,
  SiC,
  SiDotnet,
  SiGo,
  SiRuby,
  SiPhp,
  SiSqlite,
  SiGnubash,
  SiDart,
} from 'react-icons/si'

const LANG_CONFIG = {
  JavaScript: { icon: SiJavascript, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  TypeScript: { icon: SiTypescript, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  Python: { icon: SiPython, color: 'text-green-400', bg: 'bg-green-400/10' },
  Java: { icon: SiOpenjdk, color: 'text-red-400', bg: 'bg-red-400/10' },
  'C++': { icon: SiCplusplus, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  C: { icon: SiC, color: 'text-blue-300', bg: 'bg-blue-300/10' },
  'C#': { icon: SiDotnet, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  Go: { icon: SiGo, color: 'text-cyan-300', bg: 'bg-cyan-300/10' },
  Ruby: { icon: SiRuby, color: 'text-red-500', bg: 'bg-red-500/10' },
  PHP: { icon: SiPhp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  SQL: { icon: SiSqlite, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  Shell: { icon: SiGnubash, color: 'text-green-300', bg: 'bg-green-300/10' },
  Dart: { icon: SiDart, color: 'text-sky-400', bg: 'bg-sky-400/10' },
}

function LangIcon({ lang, className = '' }) {
  const cfg = LANG_CONFIG[lang] ?? { icon: null, color: 'text-muted', bg: 'bg-muted/10' }
  const Icon = cfg.icon
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${cfg.bg} ${className}`}>
      {Icon ? <Icon className={`h-4 w-4 ${cfg.color}`} /> : <span className={`text-xs font-bold ${cfg.color}`}>?</span>}
    </span>
  )
}

export default function LanguageSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [, setActiveIndex] = useState(() => Math.max(LANGUAGES.indexOf(value), 0))
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const selectedIndex = Math.max(LANGUAGES.indexOf(value), 0)
    setActiveIndex(selectedIndex)
    requestAnimationFrame(() => optionRefs.current[selectedIndex]?.focus())
  }, [open])

  const handleSelect = (lang) => {
    onChange(lang)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const focusOption = (index) => {
    const nextIndex = (index + LANGUAGES.length) % LANGUAGES.length
    setActiveIndex(nextIndex)
    optionRefs.current[nextIndex]?.focus()
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setOpen(true)
    setActiveIndex(event.key === 'ArrowUp' ? LANGUAGES.length - 1 : Math.max(LANGUAGES.indexOf(value), 0))
  }

  const handleOptionKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusOption(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusOption(LANGUAGES.length - 1)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div ref={ref} className="relative">
      <span id="language-label" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted/70">
        Language
      </span>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        aria-labelledby="language-label language-value"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="language-options"
        className="flex h-11 min-w-40 items-center gap-2.5 rounded-lg border border-border bg-panel px-2.5 text-sm font-medium text-ink shadow-sm
                   transition-[border-color,background-color,box-shadow] hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 dark:bg-[#1F242C] dark:text-[#E7E9EC]"
      >
        <LangIcon lang={value} />
        <span id="language-value">{value}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-auto z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-panel shadow-xl sm:left-auto sm:right-0 dark:bg-[#1F242C]">
          <div id="language-options" role="listbox" aria-labelledby="language-label" className="thin-scroll max-h-64 overflow-y-auto p-1.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang === value
              const index = LANGUAGES.indexOf(lang)
              return (
                <button
                  ref={(element) => { optionRefs.current[index] = element }}
                  key={lang}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent
                    ${
                      isSelected
                        ? 'bg-accent/10 text-accent-dim dark:text-amber-400'
                        : 'text-ink hover:bg-panel-alt hover:text-accent-dim dark:text-[#E7E9EC] dark:hover:bg-[#242A33] dark:hover:text-amber-400'
                    }`}
                >
                  <LangIcon lang={lang} />
                  <span className="flex-1 font-medium">{lang}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
