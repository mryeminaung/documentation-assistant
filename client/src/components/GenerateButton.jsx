export default function GenerateButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5
                 font-display text-sm font-semibold text-bg transition-colors
                 hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40
                 focus-visible:outline-none sm:w-auto"
    >
      {loading ? 'Generating…' : 'Generate'}
      {!loading && <span aria-hidden="true">→</span>}
    </button>
  )
}
