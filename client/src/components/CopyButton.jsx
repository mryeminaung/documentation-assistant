import { useState } from 'react'

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
      className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1
                 font-mono text-xs text-muted transition-colors hover:border-teal
                 hover:text-teal focus-visible:outline-none"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
