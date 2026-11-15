import { AlignLeft, BookOpen, Code2, FileText, MessageSquare, Wand2 } from 'lucide-react'
import { TASKS } from '../lib/constants'

const TASK_ICONS = {
  explain: Code2,
  comment: MessageSquare,
  docs: FileText,
  summarize: AlignLeft,
  rename: Wand2,
  creator: BookOpen,
}

function SidebarToggleIcon({ compact }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-4 w-4">
      <rect x="2.5" y="3" width="15" height="14" rx="2.5" />
      <path d="M7 3v14" />
      <path d={compact ? 'm10 7 3 3-3 3' : 'm13 7-3 3 3 3'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Desktop: vertical binder tabs on the side of the editor.
// Mobile (< md): collapses into a horizontal, scrollable pill row so
// the workspace below still gets full width.
export default function TaskTabs({ value, onChange, compact, onToggleCompact }) {
  return (
    <nav
      aria-label="Task"
      data-compact={compact}
      className={`no-scrollbar flex shrink-0 snap-x snap-mandatory scroll-px-3 gap-1.5 overflow-x-auto overscroll-x-contain border-b border-border bg-panel px-3 py-2.5
                  transition-[width,padding] duration-200 ease-out md:flex-col md:overflow-visible md:border-b-0 md:border-r md:py-3
                  dark:bg-[#1F242C] ${compact ? 'md:w-[72px] md:px-2' : 'md:w-60 md:px-3'}`}
    >
      <div className={`mb-1 hidden h-10 items-center md:flex ${compact ? 'justify-center' : 'justify-between px-1.5'}`}>
        {!compact && (
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted/70">
            Tools
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCompact}
          aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!compact}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-panel-alt hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:hover:bg-[#2B323D] dark:hover:text-[#E7E9EC]"
        >
          <SidebarToggleIcon compact={compact} />
        </button>
      </div>

      {TASKS.map((task) => {
        const isActive = task.id === value
        const Icon = TASK_ICONS[task.id] ?? Code2
        const tooltipId = `task-tooltip-${task.id}`

        return (
          <button
            key={task.id}
            type="button"
            aria-label={task.label}
            aria-describedby={compact ? tooltipId : undefined}
            aria-pressed={isActive}
            onClick={() => onChange(task.id)}
            className={`group/task relative flex h-11 shrink-0 snap-start items-center gap-2.5 whitespace-nowrap rounded-lg px-3.5 text-left text-sm font-medium
                        transition-[background-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-panel
                        md:w-full dark:focus-visible:ring-offset-[#1F242C] ${compact ? 'md:justify-center md:px-0' : ''} ${
                          isActive
                            ? 'bg-accent/10 text-accent-dim shadow-sm ring-1 ring-inset ring-accent/10 dark:text-amber-400'
                            : 'text-muted hover:bg-panel-alt hover:text-ink dark:hover:bg-[#2B323D] dark:hover:text-[#E7E9EC]'
                        }`}
          >
            {isActive && (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent md:inset-x-auto md:inset-y-2 md:left-0 md:h-auto md:w-0.5" aria-hidden="true" />
            )}
            <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
            <span className={compact ? 'md:sr-only' : ''}>{task.label}</span>

            {compact && (
              <span
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 hidden -translate-y-1/2 rounded-md border border-border bg-panel px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 shadow-lg
                           transition-opacity duration-150 group-hover/task:opacity-100 group-focus-visible/task:opacity-100 md:block dark:bg-[#242A33] dark:text-[#E7E9EC]"
              >
                {task.label}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
