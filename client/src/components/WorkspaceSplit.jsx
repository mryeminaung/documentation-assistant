import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_EDITOR_PERCENT = 50
const MIN_PANEL_WIDTH = 320
const DIVIDER_WIDTH = 12
const KEYBOARD_STEP = 32

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default function WorkspaceSplit({ editor, response, action, status }) {
  const containerRef = useRef(null)
  const tabRefs = useRef({})
  const previousStatusRef = useRef(status)
  const [editorPercent, setEditorPercent] = useState(DEFAULT_EDITOR_PERCENT)
  const [dragging, setDragging] = useState(false)
  const [activePane, setActivePane] = useState('editor')

  useEffect(() => {
    if (status === 'success' && previousStatusRef.current !== 'success') {
      setActivePane('response')
    }
    previousStatusRef.current = status
  }, [status])

  const getBounds = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null

    const availableWidth = Math.max(rect.width - DIVIDER_WIDTH, 0)
    const minimum = Math.min(MIN_PANEL_WIDTH, availableWidth / 2)
    return {
      rect,
      min: minimum,
      max: Math.max(availableWidth - minimum, minimum),
    }
  }, [])

  const setWidthFromClientX = useCallback((clientX) => {
    const bounds = getBounds()
    if (!bounds || bounds.rect.width === 0) return

    const width = clamp(clientX - bounds.rect.left, bounds.min, bounds.max)
    setEditorPercent((width / bounds.rect.width) * 100)
  }, [getBounds])

  useEffect(() => {
    if (!dragging) return undefined

    const handlePointerMove = (event) => setWidthFromClientX(event.clientX)
    const handlePointerUp = () => setDragging(false)

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragging, setWidthFromClientX])

  const handleKeyDown = (event) => {
    const bounds = getBounds()
    if (!bounds || bounds.rect.width === 0) return

    const currentWidth = (editorPercent / 100) * bounds.rect.width
    let nextWidth = currentWidth

    if (event.key === 'ArrowLeft') nextWidth -= KEYBOARD_STEP
    else if (event.key === 'ArrowRight') nextWidth += KEYBOARD_STEP
    else if (event.key === 'Home') nextWidth = bounds.min
    else if (event.key === 'End') nextWidth = bounds.max
    else if (event.key === 'Enter') nextWidth = bounds.rect.width * (DEFAULT_EDITOR_PERCENT / 100)
    else return

    event.preventDefault()
    const width = clamp(nextWidth, bounds.min, bounds.max)
    setEditorPercent((width / bounds.rect.width) * 100)
  }

  const handleTabKeyDown = (event) => {
    let nextPane
    if (event.key === 'ArrowRight' || event.key === 'End') nextPane = 'response'
    else if (event.key === 'ArrowLeft' || event.key === 'Home') nextPane = 'editor'
    else return

    event.preventDefault()
    setActivePane(nextPane)
    tabRefs.current[nextPane]?.focus()
  }

  return (
    <div
      ref={containerRef}
      className="grid min-w-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(360px,1fr)_auto] gap-4 lg:min-h-0 lg:grid-cols-[minmax(320px,var(--editor-width))_12px_minmax(320px,1fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-0 lg:gap-y-5"
      style={{ '--editor-width': `${editorPercent}%` }}
    >
      <div
        role="tablist"
        aria-label="Workspace panels"
        className="grid grid-cols-2 rounded-xl border border-border bg-panel p-1 shadow-sm lg:hidden dark:bg-[#1F242C]"
      >
        <button
          ref={(element) => { tabRefs.current.editor = element }}
          id="workspace-tab-editor"
          type="button"
          role="tab"
          aria-selected={activePane === 'editor'}
          aria-controls="workspace-panel-editor"
          tabIndex={activePane === 'editor' ? 0 : -1}
          onClick={() => setActivePane('editor')}
          onKeyDown={handleTabKeyDown}
          className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            activePane === 'editor'
              ? 'bg-accent/10 text-accent-dim shadow-sm dark:text-amber-400'
              : 'text-muted hover:bg-panel-alt hover:text-ink dark:hover:bg-[#242A33] dark:hover:text-[#E7E9EC]'
          }`}
        >
          Code Editor
        </button>
        <button
          ref={(element) => { tabRefs.current.response = element }}
          id="workspace-tab-response"
          type="button"
          role="tab"
          aria-selected={activePane === 'response'}
          aria-controls="workspace-panel-response"
          tabIndex={activePane === 'response' ? 0 : -1}
          onClick={() => setActivePane('response')}
          onKeyDown={handleTabKeyDown}
          className={`relative min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            activePane === 'response'
              ? 'bg-accent/10 text-accent-dim shadow-sm dark:text-amber-400'
              : 'text-muted hover:bg-panel-alt hover:text-ink dark:hover:bg-[#242A33] dark:hover:text-[#E7E9EC]'
          }`}
        >
          AI Response
          {status === 'success' && activePane !== 'response' && (
            <span className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-teal" aria-label="New response available" />
          )}
        </button>
      </div>

      <section
        id="workspace-panel-editor"
        role="tabpanel"
        aria-labelledby="workspace-tab-editor"
        className={`row-start-2 min-h-0 min-w-0 lg:col-start-1 lg:row-start-1 lg:block lg:pr-1.5 ${activePane === 'editor' ? 'block' : 'hidden'}`}
      >
        {editor}
      </section>

      <div
        role="separator"
        aria-label="Resize code editor and response panels"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(editorPercent)}
        tabIndex={0}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          event.preventDefault()
          setDragging(true)
        }}
        onDoubleClick={() => setEditorPercent(DEFAULT_EDITOR_PERCENT)}
        onKeyDown={handleKeyDown}
        className={`group relative hidden cursor-col-resize touch-none items-center justify-center rounded-md lg:col-start-2 lg:row-start-1 lg:flex ${
          dragging ? 'bg-accent/10' : 'hover:bg-accent/10'
        } focus-visible:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:focus-visible:ring-offset-[#171B21]`}
      >
        <span
          aria-hidden="true"
          className={`h-14 w-1 rounded-full transition-colors ${
            dragging ? 'bg-accent' : 'bg-border group-hover:bg-accent group-focus-visible:bg-accent'
          }`}
        />
      </div>

      <section
        id="workspace-panel-response"
        role="tabpanel"
        aria-labelledby="workspace-tab-response"
        className={`row-start-2 min-h-0 min-w-0 lg:col-start-3 lg:row-start-1 lg:block lg:pl-1.5 ${activePane === 'response' ? 'block' : 'hidden'}`}
      >
        {response}
      </section>

      <div className="row-start-3 flex justify-stretch sm:justify-end lg:col-span-3 lg:row-start-2">
        {action}
      </div>
    </div>
  )
}
