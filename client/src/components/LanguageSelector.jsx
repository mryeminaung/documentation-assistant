import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../lib/constants'
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiOpenjdk,
  SiCplusplus,
  SiDart,
} from 'react-icons/si'

const LANG_CONFIG = {
  JavaScript: { icon: SiJavascript, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  TypeScript: { icon: SiTypescript, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  Python: { icon: SiPython, color: 'text-green-400', bg: 'bg-green-400/10' },
  Java: { icon: SiOpenjdk, color: 'text-red-400', bg: 'bg-red-400/10' },
  'C++': { icon: SiCplusplus, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
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
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleSelect = (lang) => {
    onChange(lang)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted/60">
        Language
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-lg border border-border bg-panel-alt px-3 py-2 text-sm font-medium text-ink
                   transition-colors hover:border-accent/40 hover:bg-accent/5 focus-visible:outline-none dark:bg-[#242A33] dark:text-[#E7E9EC]"
      >
        <LangIcon lang={value} />
        <span>{value}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-auto z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-panel-alt shadow-2xl shadow-black/30 sm:left-auto sm:right-0 dark:bg-[#242A33]">
          <div className="p-1.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang === value
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors
                    ${
                      isSelected
                        ? 'bg-accent/15 text-accent'
                        : 'text-ink hover:bg-accent/10 hover:text-accent dark:text-[#E7E9EC]'
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
