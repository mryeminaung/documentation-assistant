export default function CodeEditor({ value, onChange, placeholder }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel-alt shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-muted">source.txt</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        aria-label="Code input"
        className="thin-scroll h-full w-full flex-1 resize-none bg-transparent p-5 font-mono
                   text-sm leading-relaxed text-ink placeholder:text-muted/70
                   focus-visible:outline-none"
      />
    </div>
  )
}
