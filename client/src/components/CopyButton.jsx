import { useState } from 'react'
import { Clipboard, ClipboardCheck } from 'lucide-react'

export default function CopyButton({ text, onCopied }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopied?.('Copied to clipboard')
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard access can fail (e.g. permissions) — surface it, don't crash.
      onCopied?.('Could not copy — check clipboard permissions', 'error')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Response copied' : 'Copy response to clipboard'}
      className={`flex h-10 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-[border-color,background-color,color] sm:h-8 sm:px-2.5
                 focus-visible:outline-none ${copied
                   ? 'border-teal/30 bg-teal/10 text-teal dark:text-teal-300'
                   : 'border-accent/30 bg-accent/10 text-accent-dim hover:border-accent/50 hover:bg-accent/15 dark:text-amber-400'
                 }`}
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
