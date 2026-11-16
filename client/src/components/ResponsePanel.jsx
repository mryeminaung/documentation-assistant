import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Code2, Eye, FileText, Sparkles } from 'lucide-react'
import LoadingIndicator from './LoadingIndicator'
import CopyButton from './CopyButton'
import ExportButton from './ExportButton'
import MarkdownPreview from './MarkdownPreview'

export default function ResponsePanel({ status, result, error, exportContext, onToast }) {
  const [viewMode, setViewMode] = useState('raw')

  const statusLabel = {
    idle: 'Waiting',
    loading: 'Generating',
    error: 'Needs attention',
    success: 'Ready',
  }[status]

  const statusTone = {
    idle: 'bg-muted/60',
    loading: 'animate-pulse bg-accent',
    error: 'bg-red-500',
    success: 'bg-teal',
  }[status]

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-panel-alt shadow-sm dark:bg-[#242A33]">
      <div className="border-b border-border bg-panel dark:bg-[#1F242C]">
      <div className="flex min-h-14 items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-dim dark:text-amber-400">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xs font-semibold text-ink dark:text-[#E7E9EC]">Generated response</p>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px] text-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${statusTone}`} aria-hidden="true" />
              <span>{statusLabel}</span>
              <span aria-hidden="true">·</span>
              <span>output.md</span>
            </div>
          </div>
        </div>
      </div>

        {status === 'success' && result && (
          <div className="flex min-h-11 items-center justify-between gap-2 border-t border-border/70 px-3 py-1.5 sm:px-4">
            <div role="group" aria-label="Response view" className="flex items-center gap-0.5 rounded-lg border border-border bg-panel-alt p-0.5 dark:bg-[#242A33]">
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                aria-label="Show raw response"
                aria-pressed={viewMode === 'raw'}
                className={`flex h-10 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all sm:h-8 sm:px-2 ${
                  viewMode === 'raw'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:bg-accent/10 hover:text-accent dark:hover:text-[#E7E9EC]'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Raw</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                aria-label="Preview formatted response"
                aria-pressed={viewMode === 'preview'}
                className={`flex h-10 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all sm:h-8 sm:px-2 ${
                  viewMode === 'preview'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:bg-accent/10 hover:text-accent dark:hover:text-[#E7E9EC]'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
            </div>
          <div className="flex items-center gap-1.5">
            <ExportButton content={result} context={exportContext} onToast={onToast} />
            <CopyButton text={result} onCopied={onToast} />
          </div>
          </div>
        )}
      </div>

      <div className="thin-scroll h-full min-w-0 flex-1 overflow-auto p-4 sm:p-5" aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'idle' && (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-border bg-panel text-muted dark:bg-[#1F242C]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="font-display text-sm font-semibold text-ink dark:text-[#E7E9EC]">Ready when you are</p>
            <p className="mt-1 max-w-[34ch] text-xs leading-relaxed text-muted">
              Add your source code, choose a task, then generate a response.
            </p>
          </div>
        )}

        {status === 'loading' && <LoadingIndicator />}

        {status === 'error' && (
          <div role="alert" className="mx-auto flex max-w-lg items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
            <div>
              <p className="font-display text-sm font-semibold text-red-700 dark:text-red-300">We couldn’t generate a response</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/80 dark:text-[#E7E9EC]/80">{error}</p>
            </div>
          </div>
        )}

        {status === 'success' && viewMode === 'raw' && (
          <div className="relative">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-medium text-teal dark:text-teal-300">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Response ready
            </span>
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-panel p-4 font-mono text-[13px] leading-6 text-ink dark:bg-[#1F242C] dark:text-[#E7E9EC]">
              {result}
            </pre>
          </div>
        )}

        {status === 'success' && viewMode === 'preview' && (
          <MarkdownPreview content={result} />
        )}
      </div>
    </div>
  )
}
