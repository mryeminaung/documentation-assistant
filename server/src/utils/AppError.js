// A lightweight typed error so controllers/services can throw with an
// intended HTTP status, and the error-handling middleware doesn't have
// to guess what status code a given failure deserves.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}
