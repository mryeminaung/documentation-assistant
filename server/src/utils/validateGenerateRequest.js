import { VALID_TASKS, SUPPORTED_LANGUAGES } from '../config/index.js'
import { AppError } from '../utils/AppError.js'

const MAX_CODE_LENGTH = 20000 // ~roughly a few thousand tokens; keeps requests reasonable

// Throws AppError(400) on the first problem found. Kept separate from
// the controller so it's easy to unit test in isolation.
export function validateGenerateRequest(body) {
  const { task, language, code } = body || {}

  if (!task || typeof task !== 'string') {
    throw new AppError('"task" is required and must be a string.', 400)
  }
  if (!VALID_TASKS.includes(task)) {
    throw new AppError(
      `"task" must be one of: ${VALID_TASKS.join(', ')}.`,
      400
    )
  }

  if (!language || typeof language !== 'string') {
    throw new AppError('"language" is required and must be a string.', 400)
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new AppError(
      `"language" must be one of: ${SUPPORTED_LANGUAGES.join(', ')}.`,
      400
    )
  }

  if (!code || typeof code !== 'string' || !code.trim()) {
    throw new AppError('"code" is required and must be a non-empty string.', 400)
  }
  if (code.length > MAX_CODE_LENGTH) {
    throw new AppError(
      `"code" is too long (max ${MAX_CODE_LENGTH} characters).`,
      400
    )
  }

  return { task, language, code }
}
