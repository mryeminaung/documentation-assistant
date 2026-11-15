export default function LoadingIndicator() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-muted" role="status" aria-live="polite">
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-accent"
      />
      <p className="mt-4 font-display text-sm font-semibold text-ink dark:text-[#E7E9EC]">Generating your response</p>
      <p className="mt-1 max-w-[30ch] text-xs leading-relaxed">Reading the code and preparing a structured answer…</p>
      <span className="sr-only">Generating response</span>
    </div>
  )
}
