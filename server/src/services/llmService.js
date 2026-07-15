import { config } from '../config/index.js'
import { buildPrompt } from '../prompts/templates.js'
import { AppError } from '../utils/AppError.js'

// ── Mock responses for testing without an API key ──────────────────────
const MOCK_RESPONSES = {
  explain: (lang) => `## Code Explanation

This \`${lang}\` code defines an asynchronous function that fetches a user profile from a REST API.

### Step-by-step breakdown:

1. **URL Construction**: The function builds the API endpoint by interpolating the \`userId\` parameter into the URL string.
2. **Fetch Request**: Uses the Fetch API to make a GET request to \`https://api.example.com/v1/users/{userId}\`.
3. **Response Validation**: Checks \`response.ok\` — if false, throws an error with the HTTP status code.
4. **JSON Parsing**: Calls \`response.json()\` to parse the response body and returns the user data.
5. **Error Handling**: Wraps everything in a try/catch block. On failure, logs the error to console and returns \`null\`.

### Key Points:
- The function is \`async\` and uses \`await\` for non-blocking I/O
- Graceful error handling — returns \`null\` instead of crashing
- URL uses template literals for clean string interpolation
- Follows the standard Fetch API pattern

\`\`\`javascript
// The function returns either the user object or null on failure
const profile = await fetchUserProfile(123);
\`\`\`

### Usage Example:
\`\`\`javascript
const profile = await fetchUserProfile(42);
if (profile) {
  console.log(profile.name);
} else {
  console.log('User not found');
}
\`\`\`
`,

  comment: (lang) => `\`\`\`${lang.toLowerCase()}
/**
 * Fetches a user profile from the API by user ID.
 * @param {number|string} userId - The unique identifier of the user
 * @returns {Promise<Object|null>} The user data object, or null on failure
 */
async function fetchUserProfile(userId) {
  // Construct the API endpoint URL with the user ID
  const url = \`https://api.example.com/v1/users/\${userId}\`;

  try {
    // Send GET request to the API
    const response = await fetch(url);

    // Check if the response status indicates success
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    // Parse the JSON response body
    const userData = await response.json();
    return userData;

  } catch (error) {
    // Log the error and return null for graceful degradation
    console.error(\`Failed to fetch profile for user \${userId}:\`, error);
    return null;
  }
}
\`\`\`
`,

  docs: (lang) => `# Documentation

## Overview

This module provides a function for fetching user profile data from a remote REST API.

## Functions

### \`fetchUserProfile(userId)\`

Asynchronously fetches a user's profile data from the API.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| \`userId\` | number \| string | The unique identifier of the user to fetch |

**Returns:**
- \`Promise<Object>\` - The user data object from the API
- \`null\` - If the request fails or the user is not found

**Throws:**
- \`Error\` - If the HTTP response status is not OK (caught internally)

## Usage

\`\`\`javascript
import { fetchUserProfile } from './api';

const user = await fetchUserProfile(42);
if (user) {
  console.log(user.name, user.email);
}
\`\`\`

## Error Handling

The function gracefully handles errors by:
- Logging error details to the console
- Returning \`null\` instead of throwing to the caller

## Dependencies

- Fetch API (browser/Node 18+)

## Notes

- Uses template literals for URL construction
- Follows standard REST API conventions
- Consider adding retry logic for production use
`,

  summarize: (lang) => `## Summary

This \`${lang}\` file contains an async function \`fetchUserProfile\` that retrieves user profile data from a REST API endpoint. It constructs a URL using the provided \`userId\`, makes a GET request using the Fetch API, validates the response status, and parses the JSON body. The function includes error handling that logs failures and returns \`null\` for graceful degradation. It follows standard async/await patterns and is suitable for use in both browser and Node.js environments.

**Key exports:**
- \`fetchUserProfile\` - Async function that returns user data or null

**Integration:**
This function is likely used by UI components or services that need to display or process user profile information.
`,

  rename: (lang) => `## Naming Suggestions

| Original | Suggested | Reason |
|----------|-----------|--------|
| \`userId\` | \`userId\` | ✅ Already clear and descriptive |
| \`url\` | \`endpointUrl\` | More specific about what the URL represents |
| \`response\` | \`apiResponse\` | Distinguishes from other possible responses |
| \`userData\` | \`profileData\` | Aligns with the function's purpose (profile) |

### Recommendations:
1. Current naming is already quite good — the function is well-written
2. Consider adding JSDoc type annotations for better IDE support
3. For production, you might want to extract the base URL to a config constant
4. Consider adding a timeout parameter for the fetch request
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

// Talks to the OpenRouter API (OpenAI-compatible) for a single task and
// returns plain text — all prompt-building and response-shape details are
// hidden from the controller.
export async function generateResponse({ task, language, code }) {
  // Use mock responses when no API key is configured
  if (!config.openrouter.apiKey) {
    console.log(`[MOCK MODE] Returning fake response for task: ${task}`)
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 800))
    return getMockResponse(task, language)
  }

  const { system, user } = buildPrompt(task, { code, language })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.openrouter.timeoutMs)

  let response
  try {
    response = await fetch(config.openrouter.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openrouter.apiKey}`,
        'HTTP-Referer': 'https://github.com/documentation-assistant',
        'X-Title': 'Documentation Assistant',
      },
      body: JSON.stringify({
        model: config.openrouter.model,
        max_tokens: config.openrouter.maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
      signal: controller.signal,
    })
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') {
      throw new AppError('API took too long to respond. Try again.', 504)
    }
    throw new AppError(
      'Could not reach the API. Check your network connection.',
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
      throw new AppError('API rejected the API key.', 401)
    }
    if (status === 429) {
      throw new AppError('Rate limit hit. Try again shortly.', 429)
    }
    throw new AppError(
      detail || `API request failed with status ${status}.`,
      status >= 400 && status < 600 ? status : 502
    )
  }

  const data = await response.json()

  // OpenRouter returns OpenAI-compatible response shape
  const text = data?.choices?.[0]?.message?.content?.trim()

  if (!text) {
    throw new AppError('API returned an empty response.', 502)
  }

  return text
}
