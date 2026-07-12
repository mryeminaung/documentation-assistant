import 'dotenv/config'

export const config = {
  port: process.env.PORT || 8000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    maxTokens: 2000,
    timeoutMs: 30000,
  },
}

// Single source of truth for which task IDs are legal. Anything not in
// this list is rejected at the validation layer before it ever reaches
// the prompt builder or the Claude API.
export const VALID_TASKS = ['explain', 'comment', 'docs', 'summarize', 'rename']

// Mirrors client/src/lib/constants.js LANGUAGES — keep both in sync.
export const SUPPORTED_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'Go',
  'Ruby',
  'PHP',
  'SQL',
  'Shell',
  'Dart',
]
