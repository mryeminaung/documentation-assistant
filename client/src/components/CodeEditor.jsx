import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView, keymap, placeholder as ph } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { getLanguageExtension } from '../lib/codemirrorLanguages'
import { EXT_TO_LANG } from '../lib/constants'
import { Upload, X, FileCode } from 'lucide-react'

const TAB_SIZE = 2

const EXT_MAP = {
  JavaScript: 'js',
  TypeScript: 'ts',
  Python: 'py',
  Java: 'java',
  'C++': 'cpp',
  C: 'c',
  'C#': 'cs',
  Go: 'go',
  Ruby: 'rb',
  PHP: 'php',
  SQL: 'sql',
  Shell: 'sh',
  Dart: 'dart',
}
const languageConf = new Compartment()
const themeConf = new Compartment()

// Light theme for CodeMirror matching the app's light palette
const oneLight = EditorView.theme({
  '&': { backgroundColor: '#F0F1F3' },
  '.cm-content': { color: '#1A1D23', caretColor: '#D97706' },
  '.cm-cursor': { borderLeftColor: '#D97706' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: '#D9770620',
  },
  '.cm-gutters': { backgroundColor: '#F0F1F3', color: '#6B7280', borderRight: '1px solid #D1D5DB' },
  '.cm-activeLineGutter': { backgroundColor: '#E5E7EB' },
  '.cm-activeLine': { backgroundColor: '#E5E7EB20' },
}, { dark: false })

// Syntax highlighting for light mode
const lightHighlighting = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword, color: '#8B5CF6' },
  { tag: tags.controlKeyword, color: '#8B5CF6' },
  { tag: tags.operatorKeyword, color: '#8B5CF6' },
  { tag: tags.definitionKeyword, color: '#8B5CF6' },
  { tag: tags.moduleKeyword, color: '#8B5CF6' },
  { tag: tags.operator, color: '#D97706' },
  { tag: tags.punctuation, color: '#6B7280' },
  { tag: tags.bracket, color: '#6B7280' },
  { tag: tags.squareBracket, color: '#6B7280' },
  { tag: tags.brace, color: '#6B7280' },
  { tag: tags.paren, color: '#6B7280' },
  { tag: tags.angleBracket, color: '#6B7280' },
  { tag: tags.string, color: '#059669' },
  { tag: tags.special(tags.string), color: '#059669' },
  { tag: tags.number, color: '#D97706' },
  { tag: tags.bool, color: '#D97706' },
  { tag: tags.null, color: '#D97706' },
  { tag: tags.comment, color: '#9CA3AF', fontStyle: 'italic' },
  { tag: tags.lineComment, color: '#9CA3AF', fontStyle: 'italic' },
  { tag: tags.blockComment, color: '#9CA3AF', fontStyle: 'italic' },
  { tag: tags.docComment, color: '#9CA3AF', fontStyle: 'italic' },
  { tag: tags.variableName, color: '#1A1D23' },
  { tag: tags.definition(tags.variableName), color: '#2563EB' },
  { tag: tags.definition(tags.function(tags.variableName)), color: '#2563EB' },
  { tag: tags.function(tags.variableName), color: '#2563EB' },
  { tag: tags.propertyName, color: '#2563EB' },
  { tag: tags.definition(tags.propertyName), color: '#2563EB' },
  { tag: tags.function(tags.propertyName), color: '#2563EB' },
  { tag: tags.typeName, color: '#D97706' },
  { tag: tags.className, color: '#D97706' },
  { tag: tags.namespace, color: '#D97706' },
  { tag: tags.regexp, color: '#DC2626' },
  { tag: tags.tagName, color: '#DC2626' },
  { tag: tags.attributeName, color: '#D97706' },
  { tag: tags.attributeValue, color: '#059669' },
  { tag: tags.self, color: '#DC2626' },
  { tag: tags.meta, color: '#6B7280' },
  { tag: tags.processingInstruction, color: '#6B7280' },
]))

export default function CodeEditor({ value, onChange, placeholder, language, theme, onFileUpload, onFileClear, fileName }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [rejectMsg, setRejectMsg] = useState(null)
  const dragCounter = useRef(0)

  // Keep the callback ref fresh without re-creating the editor
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Boot the editor once
  useEffect(() => {
    if (!containerRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: value ?? '',
      extensions: [
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,          // Tab / Shift-Tab with 2-space indent
        ]),
        history(),
        bracketMatching(),
        indentOnInput(),
        themeConf.of(theme === 'dark' ? oneDark : oneLight),
        ...(theme !== 'dark' ? [lightHighlighting] : []),
        languageConf.of(getLanguageExtension(language)),
        EditorView.lineWrapping,
        ph(placeholder ?? 'Paste your code here…'),
        updateListener,
        EditorState.tabSize.of(TAB_SIZE),
      ],
    })

    const view = new EditorView({ state, parent: containerRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount once only

  // Sync external value changes into the editor
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (value !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value ?? '' },
      })
    }
  }, [value])

  // Swap language when selector changes
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({
      effects: languageConf.reconfigure(getLanguageExtension(language)),
    })
  }, [language])

  // Swap CodeMirror theme when app theme changes
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({
      effects: themeConf.reconfigure(theme === 'dark' ? oneDark : oneLight),
    })
  }, [theme])

  const processFile = useCallback((file) => {
    if (!file || !onFileUpload) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !EXT_TO_LANG[ext]) {
      setRejectMsg(`Unsupported file type: .${ext ?? '?'}`)
      setTimeout(() => setRejectMsg(null), 3000)
      return
    }
    onFileUpload(file)
  }, [onFileUpload])

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.types.includes('Files')) {
      setDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    dragCounter.current = 0

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }, [processFile])

  const handleClear = useCallback((e) => {
    e.stopPropagation()
    onFileClear?.()
  }, [onFileClear])

  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel-alt shadow-sm"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header bar */}
      <div className="flex items-center gap-1.5 border-b border-border bg-panel-alt px-4 py-2.5 dark:bg-[#242A33]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

        <div className="ml-2 flex items-center gap-1.5">
          {fileName ? (
            <>
              <FileCode className="h-3.5 w-3.5 text-muted" />
              <span className="font-mono text-xs text-muted">{fileName}</span>
              <button
                type="button"
                onClick={handleClear}
                className="ml-0.5 rounded p-0.5 text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                title="Clear file"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <span className="font-mono text-xs text-muted">source.{EXT_MAP[language] ?? 'txt'}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleUploadClick}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent md:px-1.5"
          title="Import file"
        >
          <Upload className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Import</span>
        </button>
      </div>

      {/* Editor container */}
      <div className="relative h-full flex-1 overflow-auto thin-scroll cm-editor-hack">
        <div ref={containerRef} className="h-full" />

        {/* Rejection toast */}
        {rejectMsg && (
          <div className="absolute top-2 left-1/2 z-50 -translate-x-1/2 rounded-md border border-red-500/40 bg-panel-alt px-3 py-1.5 text-xs font-medium text-red-400 shadow-lg dark:bg-[#242A33]">
            ⚠ {rejectMsg}
          </div>
        )}

        {/* Drag overlay */}
        {dragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center border-2 border-dashed border-accent/60 bg-accent/10 backdrop-blur-sm">
            <Upload className="mb-2 h-8 w-8 text-accent" />
            <p className="text-sm font-medium text-accent">Drop your file here</p>
            <p className="mt-1 text-xs text-muted">Supported: JS, TS, Python, Java, C, C#, C++, Go, Ruby, PHP, SQL, Shell, Dart</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".js,.jsx,.mjs,.ts,.tsx,.py,.pyw,.java,.cpp,.cc,.cxx,.h,.hpp,.c,.cs,.go,.rb,.php,.sql,.sh,.bash,.zsh,.dart"
        onChange={handleFileInputChange}
      />
    </div>
  )
}
