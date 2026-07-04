export default function LoadingIndicator() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
      <div
        role="status"
        aria-label="Generating response"
        className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      <p className="font-mono text-xs">Reading your code…</p>
    </div>
  )
}
