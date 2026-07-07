export default function Toast({ toast }) {
  if (!toast) return null

  const isError = toast.tone === 'error'

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md border px-4 py-2.5',
        'font-mono text-xs shadow-lg backdrop-blur',
        'animate-[toast-in_0.15s_ease-out]',
        isError
          ? 'border-accent/40 bg-panel-alt text-accent dark:bg-[#242A33]'
          : 'border-teal/40 bg-panel-alt text-teal dark:bg-[#242A33]',
      ].join(' ')}
    >
      {isError ? '⚠ ' : '✓ '}
      {toast.message}
    </div>
  )
}
