import { LANGUAGES } from '../lib/constants'

export default function LanguageSelector({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="font-mono uppercase tracking-wide">Language</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-panel-alt px-2 py-1 font-mono text-xs text-ink
                   focus-visible:outline-none"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </label>
  )
}
