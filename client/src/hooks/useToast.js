import { useCallback, useRef, useState } from 'react'

// Minimal toast queue: one visible message at a time, auto-dismissed.
// No portal/library needed at this scale — the Toast component just
// renders fixed-position in App.jsx.
export function useToast() {
  const [toast, setToast] = useState(null) // { message, tone } | null
  const timerRef = useRef(null)

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(timerRef.current)
    setToast({ message, tone })
    timerRef.current = setTimeout(() => setToast(null), 2200)
  }, [])

  return { toast, showToast }
}
