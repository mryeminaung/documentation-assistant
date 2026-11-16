import { useEffect, useRef, useState } from 'react'
import { Download, File, FileText, LoaderCircle } from 'lucide-react'
import { createExportFilename, downloadMarkdown, downloadPdf } from '../lib/exportDocument'

const FORMATS = ['md', 'pdf']

export default function ExportButton({ content, context, onToast }) {
  const [open, setOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const ref = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (!open) return undefined
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    requestAnimationFrame(() => optionRefs.current[0]?.focus())
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  const handleOptionKeyDown = (event, index) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % FORMATS.length
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + FORMATS.length) % FORMATS.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = FORMATS.length - 1
    optionRefs.current[nextIndex]?.focus()
  }

  const handleExport = async (format) => {
    if (exporting) return
    setExporting(true)

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const filename = format === 'pdf'
        ? downloadPdf(content, context)
        : downloadMarkdown(content, context)
      setOpen(false)
      onToast?.(`Exported ${filename}`)
    } catch (error) {
      console.error('Export failed:', error)
      onToast?.('Could not export this response. Please try again.', 'error')
    } finally {
      setExporting(false)
    }
  }

  if (!content) return null

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={exporting}
        aria-label="Export response"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-md border border-border bg-panel-alt px-3 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent-dim focus-visible:outline-none disabled:cursor-wait disabled:opacity-60 dark:bg-[#242A33] dark:hover:text-amber-400 sm:h-8 sm:px-2.5"
        title="Export"
      >
        {exporting
          ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          : <Download className="h-3.5 w-3.5" aria-hidden="true" />}
        <span className="hidden sm:inline">{exporting ? 'Exporting' : 'Export'}</span>
      </button>

      {open && (
        <div role="menu" aria-label="Export format" className="absolute right-0 z-50 mt-1 w-72 overflow-hidden rounded-lg border border-border bg-panel shadow-xl dark:bg-[#1F242C]">
          <button
            ref={(element) => { optionRefs.current[0] = element }}
            type="button"
            role="menuitem"
            disabled={exporting}
            onClick={() => handleExport('md')}
            onKeyDown={(event) => handleOptionKeyDown(event, 0)}
            className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-60 dark:text-[#E7E9EC]"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block">Markdown (.md)</span>
              <span className="block truncate font-mono text-[10px] text-muted">
                {createExportFilename(context, 'md')}
              </span>
            </span>
          </button>
          <button
            ref={(element) => { optionRefs.current[1] = element }}
            type="button"
            role="menuitem"
            disabled={exporting}
            onClick={() => handleExport('pdf')}
            onKeyDown={(event) => handleOptionKeyDown(event, 1)}
            className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent disabled:opacity-60 dark:text-[#E7E9EC]"
          >
            <File className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block">PDF (.pdf)</span>
              <span className="block truncate font-mono text-[10px] text-muted">
                {createExportFilename(context, 'pdf')}
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
