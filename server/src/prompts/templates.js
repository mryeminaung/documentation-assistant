// Each builder takes { code, language } and returns { system, user } —
// the two pieces claudeService needs to assemble the API call.
// Keeping these as small pure functions makes them easy to unit test
// and easy to tweak independently of the HTTP/service layer.

const SYSTEM_PREFIX =
  'You are a precise, senior software engineer helping another developer ' +
  'understand and document their code. Be concrete and avoid filler.'

function explain({ code, language }) {
  return {
    system: `${SYSTEM_PREFIX} Explain code clearly for someone unfamiliar with it.`,
    user:
      `Explain what this ${language} code does, step by step. ` +
      `Focus on intent and behavior, not just syntax.\n\n` +
      '```' + language.toLowerCase() + '\n' + code + '\n```',
  }
}

function comment({ code, language }) {
  return {
    system: `${SYSTEM_PREFIX} Add comments without altering logic.`,
    user:
      `Add clear, concise inline comments to this ${language} code. ` +
      `Return the full code with comments added. Do not change any logic. ` +
      `Return only the commented code in a single code block.\n\n` +
      '```' + language.toLowerCase() + '\n' + code + '\n```',
  }
}

function docs({ code, language }) {
  return {
    system: `${SYSTEM_PREFIX} Write Markdown documentation developers actually use.`,
    user:
      `Generate Markdown documentation for this ${language} code. Include: ` +
      `purpose, parameters, return value(s), and a short usage example.\n\n` +
      '```' + language.toLowerCase() + '\n' + code + '\n```',
  }
}

function summarize({ code, language }) {
  return {
    system: `${SYSTEM_PREFIX} Summarize concisely — no line-by-line walkthroughs.`,
    user:
      `Summarize this ${language} file in 3-5 sentences: what it does, ` +
      `its key functions/exports, and how it likely fits into a larger project.\n\n` +
      '```' + language.toLowerCase() + '\n' + code + '\n```',
  }
}

function rename({ code, language }) {
  return {
    system: `${SYSTEM_PREFIX} Improve naming without changing behavior.`,
    user:
      `Review the variable and function names in this ${language} code. ` +
      `Return a Markdown table with columns: Original | Suggested | Reason. ` +
      `Only include names worth changing.\n\n` +
      '```' + language.toLowerCase() + '\n' + code + '\n```',
  }
}

const builders = { explain, comment, docs, summarize, rename }

export function buildPrompt(task, { code, language }) {
  const builder = builders[task]
  if (!builder) {
    throw new Error(`No prompt template for task "${task}"`)
  }
  return builder({ code, language })
}
