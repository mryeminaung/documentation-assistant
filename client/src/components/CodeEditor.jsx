import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { useEffect, useRef } from 'react'
import { EditorView, keymap, placeholder as ph } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { getLanguageExtension } from '../lib/codemirrorLanguages'

const TAB_SIZE = 2

const EXT_MAP = {
  JavaScript: 'js',
  TypeScript: 'ts',
  Python: 'py',
  Java: 'java',
  'C++': 'cpp',
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

export default function CodeEditor({ value, onChange, placeholder, language, theme }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)

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

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel-alt shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-panel-alt px-4 py-2.5 dark:bg-[#242A33]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-muted">source.{EXT_MAP[language] ?? 'txt'}</span>
      </div>
      <div ref={containerRef} className="h-full flex-1 overflow-auto thin-scroll cm-editor-hack" />
    </div>
  )
}
