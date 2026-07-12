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
      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5
                 font-mono text-xs text-muted transition-colors hover:border-accent/40
                 hover:text-accent focus-visible:outline-none md:px-1.5"
    >
      {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
      <span className="hidden lg:inline">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}
