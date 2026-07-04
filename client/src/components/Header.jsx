export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent/15 font-display text-sm font-semibold text-accent">
          {'</>'}
        </span>
        <div>
          <h1 className="font-display text-base font-semibold leading-none text-ink sm:text-lg">
            Documentation Assistant
          </h1>
          <p className="mt-1 hidden text-xs text-muted sm:block">
            Paste code, pick a task, get an explanation or docs back.
          </p>
        </div>
      </div>
    </header>
  )
}
