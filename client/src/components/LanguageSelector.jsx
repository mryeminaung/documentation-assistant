import { FileCode, Braces, Hash, Code2 } from 'lucide-react'
import { LANGUAGES } from '../lib/constants'

const LANG_ICONS = {
  JavaScript: <Braces className="h-3.5 w-3.5 text-yellow-400" />,
  TypeScript: <Code2 className="h-3.5 w-3.5 text-blue-400" />,
  Python: <Hash className="h-3.5 w-3.5 text-green-400" />,
  Java: <FileCode className="h-3.5 w-3.5 text-red-400" />,
  'C++': <Braces className="h-3.5 w-3.5 text-cyan-400" />,
  Dart: <Code2 className="h-3.5 w-3.5 text-sky-400" />,
}

export default function LanguageSelector({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="font-mono uppercase tracking-wide">Language</span>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          {LANG_ICONS[value] ?? <Code2 className="h-3.5 w-3.5 text-muted" />}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded border border-border bg-panel-alt py-1 pl-8 pr-6 font-mono text-xs text-ink
                     focus-visible:outline-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
          <svg className="h-3 w-3 text-muted" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </label>
  )
}
