import { config } from '../config/index.js'
import { buildPrompt } from '../prompts/templates.js'
import { AppError } from '../utils/AppError.js'

// Talks to the Anthropic Messages API for a single task and returns
// plain text — all prompt-building and response-shape details are
// hidden from the controller.
export async function generateResponse({ task, language, code }) {
  if (!config.anthropic.apiKey) {
    throw new AppError(
      'Server is missing ANTHROPIC_API_KEY. Add it to server/.env.',
      500
    )
  }

  const { system, user } = buildPrompt(task, { code, language })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.anthropic.timeoutMs)

  let response
  try {
    response = await fetch(config.anthropic.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropic.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.anthropic.model,
        max_tokens: config.anthropic.maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      signal: controller.signal,
    })
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') {
      throw new AppError('Claude API took too long to respond. Try again.', 504)
    }
    // fetch itself throws on DNS/connection failures, not just on 4xx/5xx.
    throw new AppError(
      'Could not reach the Claude API. Check your network connection.',
      502
    )
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const status = response.status
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.error?.message || ''
    } catch {
      // response wasn't JSON — ignore and use the generic message below.
    }

    if (status === 401) {
      throw new AppError('Claude API rejected the API key.', 401)
    }
    if (status === 429) {
      throw new AppError('Rate limit hit on the Claude API. Try again shortly.', 429)
    }
    throw new AppError(
      detail || `Claude API request failed with status ${status}.`,
      status >= 400 && status < 600 ? status : 502
    )
  }

  const data = await response.json()

  const text = data?.content
    ?.filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()

  if (!text) {
    throw new AppError('Claude API returned an empty response.', 502)
  }

  return text
}
