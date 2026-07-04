import { useCallback, useState } from 'react'

// Wraps the call to POST /api/generate.
// In development only, if no server is reachable, falls back to a mock
// response so the UI stays demoable without a running backend.
export function useClaudeRequest() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  const run = useCallback(async ({ task, code, language }) => {
    if (!code.trim()) {
      setStatus('error')
      setError('Paste some code before generating.')
      return
    }

    setStatus('loading')
    setError('')
    setResult('')

    let res
    try {
      res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, code, language }),
      })
    } catch (networkErr) {
      // fetch throws only on network-level failure (server not running,
      // DNS, CORS block). In dev, fall back to a mock so the UI is still
      // demoable; in production, surface it as a real error instead of
      // silently pretending to succeed.
      if (import.meta.env.DEV) {
        setResult(mockResult(task, language))
        setStatus('success')
        console.warn('No backend reachable, showing mock result:', networkErr.message)
        return
      }
      setStatus('error')
      setError('Could not reach the server. Please try again.')
      return
    }

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      // A real response came back but with an error (bad input, Claude
      // API failure, etc.) — surface it instead of masking it.
      setStatus('error')
      setError(data.error || `Request failed with status ${res.status}.`)
      return
    }

    setResult(data.result)
    setStatus('success')
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult('')
    setError('')
  }, [])

  return { run, reset, status, result, error }
}

function mockResult(task, language) {
  const mocks = {
    explain: `### What this code does\n\nThis is a placeholder response — the backend server isn't running yet. Start it with \`npm run dev\` in /server, then this panel will show Claude's actual explanation of your ${language} code.`,
    comment: `\`\`\`${language.toLowerCase()}\n// Placeholder: commented code will appear here\n// once the backend is running.\n\`\`\``,
    docs: `## Documentation (placeholder)\n\n**Purpose:** —\n\n**Parameters:** —\n\n**Returns:** —\n\nStart the backend server to see real generated docs.`,
    summarize: `This is a placeholder summary. Start the backend server (\`npm run dev\` in /server) to see a real summary of your file.`,
    rename: `| Original | Suggested | Reason |\n|---|---|---|\n| — | — | Connect the backend to see real suggestions |`,
  }
  return mocks[task] ?? 'No result.'
}
