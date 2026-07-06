import { useEffect, useRef } from 'react'
import { EditorView, keymap, placeholder as ph } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { getLanguageExtension } from '../lib/codemirrorLanguages'

const TAB_SIZE = 2
const languageConf = new Compartment()

export default function CodeEditor({ value, onChange, placeholder, language }) {
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
        oneDark,
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

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel-alt shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-muted">source.txt</span>
      </div>
      <div ref={containerRef} className="h-full flex-1 overflow-auto thin-scroll cm-editor-hack" />
    </div>
  )
}
