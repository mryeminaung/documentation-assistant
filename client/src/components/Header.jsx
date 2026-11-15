import ThemeToggle from './ThemeToggle'
import logo from '../assets/doc-assistant-logo.svg'

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-panel px-4 sm:px-5 md:px-6 dark:bg-[#1F242C]">
      <div className="flex min-w-0 items-center gap-3">
        <img src={logo} alt="" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
        <div className="min-w-0">
          <h1 className="truncate font-display text-sm font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-base dark:text-[#E7E9EC]">
            Documentation Assistant
          </h1>
          <p className="mt-0.5 hidden truncate text-[11px] leading-tight text-muted sm:block">
            AI-powered code documentation workspace
          </p>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <a
          href="https://github.com/mryeminaung/documentation-assistant"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          title="View source on GitHub"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-panel text-muted
                     transition-[border-color,background-color,color] duration-150 hover:border-accent/40 hover:bg-accent/5 hover:text-accent
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-panel dark:bg-[#1F242C] dark:focus-visible:ring-offset-[#1F242C]"
        >
          <GithubIcon className="h-[18px] w-[18px]" />
        </a>
      </div>
    </header>
  )
}
