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

function downloadPDF(content) {
  const doc = new jsPDF()
  const lines = doc.splitTextToSize(content, 180)
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

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!content) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
        title="Export"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Export</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-panel-alt shadow-xl dark:bg-[#242A33]">
          <button
            type="button"
            onClick={() => { downloadMarkdown(content); setOpen(false) }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent/10 hover:text-accent dark:text-[#E7E9EC]"
          >
            <FileText className="h-4 w-4" />
            <span>Markdown (.md)</span>
          </button>
          <button
            type="button"
            onClick={() => { downloadPDF(content); setOpen(false) }}
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
