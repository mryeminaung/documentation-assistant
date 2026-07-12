import { config } from '../config/index.js'
import { buildPrompt } from '../prompts/templates.js'
import { AppError } from '../utils/AppError.js'

// ── Mock responses for testing without an API key ──────────────────────
const MOCK_RESPONSES = {
  explain: (lang) => `## Code Explanation

This \`${lang}\` code implements a function that processes input data and returns a result.

### Step-by-step breakdown:

1. **Input Validation**: The function first checks if the input is valid.
2. **Processing**: It transforms the data according to the specified logic.
3. **Output**: Returns the processed result.

### Key Points:
- The function follows a clean, functional approach
- Error handling is built-in for edge cases
- The code is modular and easy to test

\`\`\`${lang.toLowerCase()}
// Original code analysis
// This function is designed to be reusable across the project
\`\`\`

### Usage Example:
\`\`\`${lang.toLowerCase()}
const result = myFunction(inputData);
console.log(result); // Expected output
\`\`\`
`,

  comment: (lang) => `\`\`\`${lang.toLowerCase()}
/**
 * Processes the input data and returns transformed result.
 * @param {Object} data - The input data to process
 * @returns {Object} The transformed result
 */
function processData(data) {
  // Validate input exists and has required properties
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input: expected an object');
  }

  // Transform the data using the core algorithm
  const result = {
    ...data,
    processed: true,
    timestamp: Date.now()
  };

  // Return the enriched result object
  return result;
}
\`\`\`
`,

  docs: (lang) => `# Documentation

## Overview

This module provides core functionality for processing data in the application.

## Functions

### \`processData(data)\`

Processes the input data and returns a transformed result.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| \`data\` | Object | The input data to process |

**Returns:**
- \`Object\` - The transformed result with additional metadata

**Throws:**
- \`Error\` - If input is invalid

## Usage

\`\`\`${lang.toLowerCase()}
import { processData } from './module';

const result = processData({ key: 'value' });
\`\`\`

## Dependencies

- None (standalone module)

## Notes

- This function is pure and has no side effects
- Safe to use in concurrent environments
`,

  summarize: (lang) => `## Summary

This \`${lang}\` file provides core data processing functionality. It contains a main function that validates and transforms input data, returning enriched results with metadata. The module is designed to be reusable across the project and follows functional programming patterns. It includes proper error handling and is suitable for production use.

**Key exports:**
- \`processData\` - Main processing function

**Integration:**
This module is likely used by multiple parts of the application for consistent data handling.
`,

  rename: (lang) => `## Naming Suggestions

| Original | Suggested | Reason |
|----------|-----------|--------|
| \`d\` | \`data\` | More descriptive of the parameter's purpose |
| \`res\` | \`result\` | Clearer indication of the return value |
| \`fn\` | \`processData\` | Describes what the function actually does |
| \`tmp\` | \`temporaryBuffer\` | Explicit about its temporary nature |
| \`obj\` | \`configObject\` | Shows it contains configuration |

### Recommendations:
1. Use descriptive names that reveal intent
2. Avoid abbreviations unless they're universally understood
3. Boolean variables should use \`is\` or \`has\` prefixes
4. Functions should use verb phrases (\`getData\`, \`processInput\`)
`,
}

/**
 * Returns a mock response for testing without an API key.
 * @param {string} task - The task type
 * @param {string} language - The programming language
 * @returns {string} Mock response content
 */
function getMockResponse(task, language) {
  const generator = MOCK_RESPONSES[task]
  if (!generator) {
    return `Mock response for "${task}" task in ${language}.`
  }
  return generator(language)
}

// Talks to the Anthropic Messages API for a single task and returns
// plain text — all prompt-building and response-shape details are
// hidden from the controller.
export async function generateResponse({ task, language, code }) {
  // Use mock responses when no API key is configured
  if (!config.anthropic.apiKey) {
    console.log(`[MOCK MODE] Returning fake response for task: ${task}`)
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 800))
    return getMockResponse(task, language)
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
