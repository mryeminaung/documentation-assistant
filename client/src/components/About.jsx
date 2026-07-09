import { Code2, Sparkles, FileText, Lightbulb } from 'lucide-react'
import logo from '../assets/doc-assistant-logo.svg'

const STEPS = [
  {
    icon: <Code2 className="h-5 w-5" />,
    title: 'Paste your code',
    desc: 'Drop any JavaScript, TypeScript, Python, Java, C++, or Dart code into the editor on the left.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Pick a task',
    desc: 'Choose what you want — explain, comment, document, summarize, or improve variable names.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Generate',
    desc: 'Click the Generate button and Claude will produce the output in the right panel.',
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'Copy & use',
    desc: 'Hit the copy button on the output and paste the result wherever you need it.',
  },
]

const FEATURES = [
  'Syntax highlighting with CodeMirror',
  'Supports 6 languages with auto-detection',
  'Tab / Shift-Tab indent support',
  'Light & dark theme support',
  'Copy output to clipboard in one click',
  'Works offline in demo mode (mock responses)',
  'File upload & drag-and-drop support',
]

export default function About() {
  return (
    <div className="h-full w-full overflow-auto no-scrollbar">
      <div className="mx-auto max-w-5xl space-y-10 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-1">
          <img src={logo} alt="Documentation Assistant" className="h-16 w-16" />
          <div>
            <h1 className="font-display text-xl font-bold text-ink dark:text-[#E7E9EC]">Documentation Assistant</h1>
            <p className="text-sm text-muted">Powered by Claude AI</p>
          </div>
        </div>

        {/* About */}
        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            About
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-ink/80 dark:text-[#E7E9EC]/80">
            Documentation Assistant is a developer tool that uses Claude AI to generate
            code documentation, explanations, comments, summaries, and variable rename
            suggestions — instantly. Paste your code, pick a task, and get results.
          </p>
        </section>

        {/* How to Use — 2-column grid on md+ */}
        <section className="space-y-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            User Manual
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((step, i) => (
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

        {/* Features — 2-column list on md+ */}
        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Features
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink/80 dark:text-[#E7E9EC]/80">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted/60">
          Built with React, Vite, Tailwind CSS & Claude API
        </div>
      </div>
    </div>
  )
}
