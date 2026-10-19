/**
 * @fileoverview Custom error class for API errors returning the standardized backend error envelope.
 */

export class ApiError extends Error {
  /**
   * @param {number} status - HTTP status code
   * @param {string} code - Backend error code
   * @param {string} message - Error description
   * @param {string} requestId - Trace ID from X-Request-ID or error body
   */
  constructor(status, code, message, requestId) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}
