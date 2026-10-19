/**
 * @fileoverview JSDoc types and interfaces mirroring the FastAPI backend schemas.
 */

/**
 * @typedef {Object} BackendErrorDetails
 * @property {string} code - Machine-readable error code (e.g. VALIDATION_ERROR, NOT_FOUND)
 * @property {string} message - Human-readable explanation
 * @property {string} request_id - Request trace ID
 */

/**
 * @typedef {Object} BackendErrorResponse
 * @property {BackendErrorDetails} error
 */

/**
 * @typedef {Object} HealthResponse
 * @property {string} status - Health status ("ok")
 * @property {string} version - Semantic version ("0.1.0")
 * @property {string} environment - Environment name (e.g. "development", "production")
 * @property {string} club - Full club name
 */

export {};
