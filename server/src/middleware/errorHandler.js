import { AppError } from '../utils/AppError.js'

// Centralized error handling: every route forwards errors here via
// next(err), so response shape stays consistent no matter where the
// error came from (validation, Claude API, or an unexpected bug).
export function errorHandler(err, req, res, next) {
  const isKnown = err instanceof AppError
  const statusCode = isKnown ? err.statusCode : 500
  const message = isKnown ? err.message : 'Something went wrong on the server.'

  if (!isKnown) {
    // Log unexpected errors with full detail; never leak internals to the client.
    console.error('Unexpected error:', err)
  }

  res.status(statusCode).json({ error: message })
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
}
