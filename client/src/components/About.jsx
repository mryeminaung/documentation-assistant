import { Code2, Sparkles, FileText, Lightbulb, BookOpen, Zap, Keyboard } from 'lucide-react'
import logo from '../assets/doc-assistant-logo.svg'
import { LANGUAGES, TASKS } from '../lib/constants'

const HOW_TO_USE = [
  {
    icon: <Code2 className="h-5 w-5" />,
    title: 'Paste your code',
    desc: 'Drop any supported code into the editor, or drag-and-drop a file.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Pick a task',
    desc: 'Choose what you want — explain, comment, document, summarize, or rename.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Generate',
    desc: 'Click Generate and Claude will produce the output in the right panel.',
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'Copy & use',
    desc: 'Copy to clipboard or export as Markdown / PDF — ready to paste.',
  },
]

const TASK_DESCRIPTIONS = {
  explain: 'Step-by-step walkthrough of what your code does.',
  comment: 'Inline comments added without changing any logic.',
  docs: 'Markdown docs with purpose, params, returns, and usage.',
  summarize: 'Quick summary of the whole file in a few sentences.',
  rename: 'Better variable names with reasons, formatted as a table.',
}

const SHORTCUTS = [
  { keys: ['Ctrl', 'V'], desc: 'Paste code into editor' },
  { keys: ['Ctrl', 'C'], desc: 'Copy output (when output is focused)' },
  { keys: ['Tab'], desc: 'Indent selected code' },
  { keys: ['Shift', 'Tab'], desc: 'Unindent selected code' },
]

export default function About() {
  return (
    <div className="h-full w-full overflow-auto no-scrollbar">
      <div className="mx-auto max-w-5xl space-y-10 p-6 md:p-10">

        {/* Hero */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Documentation Assistant" className="h-14 w-14" />
            <div>
              <h1 className="font-display text-2xl font-bold text-ink dark:text-[#E7E9EC]">
                Documentation Assistant
              </h1>
              <p className="text-sm text-muted">AI-powered code docs, instantly.</p>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-ink/80 dark:text-[#E7E9EC]/80">
            Paste code, pick a task, and get clean documentation, explanations, or
            refactor suggestions — powered by Claude AI. Works with 13 languages,
            supports file import, and exports to Markdown or PDF.
          </p>
        </section>

        {/* How to Use */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
              How to Use
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {HOW_TO_USE.map((step, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-panel-alt p-4 dark:bg-[#242A33]">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink dark:text-[#E7E9EC]">
                    <span className="mr-1.5 font-mono text-xs text-muted/60">{i + 1}.</span>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Tasks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
              Available Tasks
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TASKS.filter((t) => t.id !== 'creator').map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-border bg-panel-alt p-3 dark:bg-[#242A33]"
              >
                <p className="text-sm font-medium text-ink dark:text-[#E7E9EC]">{task.label}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {TASK_DESCRIPTIONS[task.id] ?? task.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Languages */}
        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Supported Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <span
                key={lang}
                className="rounded-md border border-border bg-panel-alt px-2.5 py-1 text-xs font-medium text-ink/80 dark:bg-[#242A33] dark:text-[#E7E9EC]/80"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-accent" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
              Keyboard Shortcuts
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SHORTCUTS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-panel-alt px-3 py-2 dark:bg-[#242A33]">
                <div className="flex gap-1">
                  {s.keys.map((key) => (
                    <kbd
                      key={key}
                      className="rounded border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
                <span className="text-xs text-muted">{s.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted/60">
          Built with React, Vite, Tailwind CSS & Claude API
        </div>
      </div>
    </div>
  )
}
