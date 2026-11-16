import { jsPDF } from 'jspdf'

const APP_NAME = 'Documentation Assistant'
const PAGE = { left: 16, right: 194, top: 18, bottom: 278, width: 178 }

function formatDateParts(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function sourceBaseName(sourceFileName) {
  if (!sourceFileName) return 'untitled-snippet'
  return sourceFileName.replace(/\.[^.]+$/, '') || 'untitled-snippet'
}

export function sanitizeFilenamePart(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'export'
}

function titleFromSource(sourceFileName, taskLabel) {
  if (!sourceFileName) return `${taskLabel || 'Generated'} Result`
  return sourceBaseName(sourceFileName)
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function createExportDetails({ taskLabel, language, sourceFileName, generatedAt } = {}) {
  const date = generatedAt instanceof Date ? generatedAt : new Date(generatedAt || Date.now())
  const safeTaskLabel = taskLabel || 'Generated Response'

  return {
    application: APP_NAME,
    title: titleFromSource(sourceFileName, safeTaskLabel),
    task: safeTaskLabel,
    language: language || 'Not specified',
    source: sourceFileName || 'Untitled snippet',
    generatedAt: date,
    generatedLabel: new Intl.DateTimeFormat(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date),
  }
}

export function createExportFilename(context, extension) {
  const details = createExportDetails(context)
  const source = sanitizeFilenamePart(sourceBaseName(context?.sourceFileName))
  const task = sanitizeFilenamePart(details.task)
  const date = formatDateParts(details.generatedAt)
  const safeExtension = extension === 'pdf' ? 'pdf' : 'md'
  return `${source}-${task}-${date}.${safeExtension}`
}

export function buildMarkdownDocument(content, context) {
  const details = createExportDetails(context)
  const metadata = [
    `# ${details.title}`,
    '',
    `- **Task:** ${details.task}`,
    `- **Language:** ${details.language}`,
    `- **Source:** ${details.source}`,
    `- **Generated:** ${details.generatedLabel}`,
    `- **Created with:** ${details.application}`,
    '',
    '---',
    '',
  ].join('\n')
  return `${metadata}${String(content || '').trim()}\n`
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function downloadMarkdown(content, context) {
  const filename = createExportFilename(context, 'md')
  const document = buildMarkdownDocument(content, context)
  downloadBlob(new Blob([document], { type: 'text/markdown;charset=utf-8' }), filename)
  return filename
}

function cleanInlineMarkdown(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

function renderPdf(content, context) {
  const details = createExportDetails(context)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = PAGE.top
  let pageNumber = 1

  const addFooter = () => {
    doc.setDrawColor(220)
    doc.line(PAGE.left, 286, PAGE.right, 286)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(110)
    doc.text(details.application, PAGE.left, 291)
    doc.text(`Page ${pageNumber}`, PAGE.right, 291, { align: 'right' })
  }

  const addPage = () => {
    addFooter()
    doc.addPage()
    pageNumber += 1
    y = PAGE.top
  }

  const ensureSpace = (height) => {
    if (y + height > PAGE.bottom) addPage()
  }

  const writeWrapped = (text, options = {}) => {
    const {
      font = 'helvetica', style = 'normal', size = 10.5,
      color = [35, 39, 47], indent = 0, lineHeight = 5.2, after = 2.5,
    } = options
    doc.setFont(font, style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(cleanInlineMarkdown(text), PAGE.width - indent)
    ensureSpace(Math.max(lines.length, 1) * lineHeight + after)
    doc.text(lines.length ? lines : [''], PAGE.left + indent, y)
    y += Math.max(lines.length, 1) * lineHeight + after
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(21)
  doc.setTextColor(24, 29, 38)
  const titleLines = doc.splitTextToSize(details.title, PAGE.width)
  doc.text(titleLines, PAGE.left, y)
  y += titleLines.length * 8 + 3

  doc.setFontSize(9)
  doc.setTextColor(90)
  for (const [label, value] of [
    ['Task', details.task], ['Language', details.language],
    ['Source', details.source], ['Generated', details.generatedLabel],
  ]) {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, PAGE.left, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), PAGE.left + 22, y)
    y += 4.5
  }

  y += 2
  doc.setDrawColor(210)
  doc.line(PAGE.left, y, PAGE.right, y)
  y += 8

  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n')
  let inCodeBlock = false
  let codeLines = []

  const flushCodeBlock = () => {
    if (!codeLines.length) return
    const wrappedLines = codeLines.flatMap((line) => doc.splitTextToSize(line || ' ', PAGE.width - 8))
    const chunkSize = 42
    for (let index = 0; index < wrappedLines.length; index += chunkSize) {
      const chunk = wrappedLines.slice(index, index + chunkSize)
      const height = chunk.length * 4.4 + 7
      ensureSpace(height)
      doc.setFillColor(244, 246, 249)
      doc.setDrawColor(218, 222, 228)
      doc.roundedRect(PAGE.left, y - 3.5, PAGE.width, height, 1.5, 1.5, 'FD')
      doc.setFont('courier', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(40, 45, 54)
      doc.text(chunk, PAGE.left + 4, y)
      y += height + 3
    }
    codeLines = []
  }

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      if (inCodeBlock) flushCodeBlock()
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    const unorderedItem = line.match(/^\s*[-*+]\s+(.+)$/)
    const orderedItem = line.match(/^\s*(\d+)\.\s+(.+)$/)
    const quote = line.match(/^\s*>\s?(.*)$/)

    if (heading) {
      const level = heading[1].length
      y += level <= 2 ? 3 : 1
      writeWrapped(heading[2], {
        style: 'bold',
        size: level === 1 ? 17 : level === 2 ? 14 : 11.5,
        lineHeight: level <= 2 ? 6.5 : 5.5,
        after: 3,
      })
    } else if (unorderedItem) {
      writeWrapped(`-  ${unorderedItem[1]}`, { indent: 4, after: 1 })
    } else if (orderedItem) {
      writeWrapped(`${orderedItem[1]}.  ${orderedItem[2]}`, { indent: 4, after: 1 })
    } else if (quote) {
      writeWrapped(quote[1], { style: 'italic', color: [80, 86, 96], indent: 5 })
    } else if (/^\s*---+\s*$/.test(line)) {
      ensureSpace(6)
      doc.setDrawColor(220)
      doc.line(PAGE.left, y, PAGE.right, y)
      y += 6
    } else if (line.trim()) {
      writeWrapped(line)
    } else {
      y += 2.5
    }
  }

  flushCodeBlock()
  addFooter()
  return doc
}

export function downloadPdf(content, context) {
  const filename = createExportFilename(context, 'pdf')
  renderPdf(content, context).save(filename)
  return filename
}
