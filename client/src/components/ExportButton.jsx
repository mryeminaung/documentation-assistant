import { useState, useRef, useEffect } from 'react'
import { Download, FileText, File } from 'lucide-react'
import { jsPDF } from 'jspdf'

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadMarkdown(content) {
  downloadFile(content, 'documentation.md', 'text/markdown')
}

function stripMarkdown(md) {
  return md
    .replace(/^#{1,6}\s+/gm, '')          // headings
    .replace(/\*\*(.+?)\*\*/g, '$1')      // bold
    .replace(/\*(.+?)\*/g, '$1')          // italic
    .replace(/__(.+?)__/g, '$1')          // bold alt
    .replace(/_(.+?)_/g, '$1')            // italic alt
    .replace(/~~(.+?)~~/g, '$1')          // strikethrough
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => // code blocks
      m.replace(/`{3}\w*\n?/g, '').replace(/`{3}/g, ''))
    .replace(/`(.+?)`/g, '$1')            // inline code
    .replace(/^\s*[-*+]\s+/gm, '• ')      // unordered lists
    .replace(/^\s*\d+\.\s+/gm, (m) => m.trim()) // ordered lists
    .replace(/^\s*>+\s+/gm, '')           // blockquotes
    .replace(/!?\[(.+?)\]\(.+?\)/g, '$1') // links and images
    .replace(/^-{3,}$/gm, '')             // horizontal rules
    .replace(/^\s*$/gm, '')               // empty lines
    .replace(/\n{3,}/g, '\n\n')           // excess newlines
    .trim()
}

function downloadPDF(content) {
  const doc = new jsPDF()
  const plainText = stripMarkdown(content)
  const lines = doc.splitTextToSize(plainText, 180)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  let y = 20
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(line, 15, y)
    y += 6
  })
  doc.save('documentation.pdf')
}

export default function ExportButton({ content }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => optionRefs.current[0]?.focus())
    const handler = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector('button')?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleOptionKeyDown = (event, index) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % 2
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + 2) % 2
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = 1
    optionRefs.current[nextIndex]?.focus()
  }

  if (!content) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Export response"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 items-center gap-1.5 rounded-md border border-border bg-panel-alt px-3 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent-dim focus-visible:outline-none dark:bg-[#242A33] dark:hover:text-amber-400 sm:h-8 sm:px-2.5"
        title="Export"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {open && (
        <div role="menu" aria-label="Export format" className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-panel shadow-xl dark:bg-[#1F242C]">
          <button
            ref={(element) => { optionRefs.current[0] = element }}
            type="button"
            role="menuitem"
            onClick={() => { downloadMarkdown(content); setOpen(false) }}
            onKeyDown={(event) => handleOptionKeyDown(event, 0)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent dark:text-[#E7E9EC]"
          >
            <FileText className="h-4 w-4" />
            <span>Markdown (.md)</span>
          </button>
          <button
            ref={(element) => { optionRefs.current[1] = element }}
            type="button"
            role="menuitem"
            onClick={() => { downloadPDF(content); setOpen(false) }}
            onKeyDown={(event) => handleOptionKeyDown(event, 1)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent dark:text-[#E7E9EC]"
          >
            <File className="h-4 w-4" />
            <span>PDF (.pdf)</span>
          </button>
        </div>
      )}
    </div>
  )
}
