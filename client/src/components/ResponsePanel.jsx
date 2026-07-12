import { useState } from 'react'
import { Code2, Eye } from 'lucide-react'
import LoadingIndicator from './LoadingIndicator'
import CopyButton from './CopyButton'
import ExportButton from './ExportButton'
import MarkdownPreview from './MarkdownPreview'

export default function ResponsePanel({ status, result, error, onToast }) {
  const [viewMode, setViewMode] = useState('raw')

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel-alt shadow-sm dark:bg-[#242A33]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted">output.md</span>
          {status === 'success' && result && (
            <div className="flex items-center gap-0.5 rounded-lg border border-border bg-panel p-0.5 dark:bg-[#1F242C]">
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all md:px-1.5 ${
                  viewMode === 'raw'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:bg-accent/10 hover:text-accent dark:hover:text-[#E7E9EC]'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Raw</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all md:px-1.5 ${
                  viewMode === 'preview'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:bg-accent/10 hover:text-accent dark:hover:text-[#E7E9EC]'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Preview</span>
              </button>
            </div>
          )}
        </div>
        {status === 'success' && result && (
          <div className="flex items-center gap-2">
            <ExportButton content={result} />
            <CopyButton text={result} onCopied={onToast} />
          </div>
        )}
      </div>

      <div className="thin-scroll h-full flex-1 overflow-auto p-5">
        {status === 'idle' && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="font-display text-2xl text-border" aria-hidden="true">
              {'{ }'}
            </span>
            <p className="text-sm text-muted">Nothing generated yet.</p>
            <p className="max-w-[22ch] text-xs text-muted/70">
              Paste code, pick a task, and click Generate.
            </p>
          </div>
        )}

        {status === 'loading' && <LoadingIndicator />}

        {status === 'error' && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-accent/40 bg-accent/10 p-3"
          >
            <span className="mt-0.5 text-accent" aria-hidden="true">⚠</span>
            <div>
              <p className="text-sm font-medium text-accent">Something went wrong</p>
              <p className="mt-0.5 font-mono text-xs text-ink/80 dark:text-[#E7E9EC]/80">{error}</p>
            </div>
          </div>
        )}

        {status === 'success' && viewMode === 'raw' && (
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-ink dark:text-[#E7E9EC]">
            {result}
          </pre>
        )}

        {status === 'success' && viewMode === 'preview' && (
          <MarkdownPreview content={result} />
        )}
      </div>
    </div>
  )
}
