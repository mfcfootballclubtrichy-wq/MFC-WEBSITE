/**
 * @fileoverview Robust fetch client wrapper for MFC FastAPI backend.
 *
 * Requirements:
 * - Prepends VITE_API_BASE_URL to /api/v1/...
 * - Automatic timeout handling (15 s) with AbortController
 * - Retries only GET requests, max 2 times with exponential backoff
 * - Parses backend error envelope {"error": {"code", "message", "request_id"}} into ApiError
 * - Authorization Bearer token injected dynamically at call time
 * - Never logs sensitive headers, tokens, or form bodies
 */
import { ApiError } from './error.js';

const DEFAULT_TIMEOUT_MS = 15000;
const MAX_GET_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 300;

/**
 * Resolves the API base URL from Vite environment variables.
 * @returns {string}
 */
export function getApiBaseUrl() {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL
    : process.env.VITE_API_BASE_URL;
  if (!envUrl) {
    return 'http://localhost:8000';
  }
  return envUrl.replace(/\/+$/, '');
}

/**
 * Optional session provider for retrieving fresh Supabase access tokens.
 * Injected at runtime; returns null when not authenticated.
 * @type {(() => Promise<string | null>) | null}
 */
let tokenProvider = null;

export function setTokenProvider(provider) {
  tokenProvider = provider;
}

/**
 * Sleep helper for retry backoff.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core apiClient wrapper.
 *
 * @template T
 * @param {string} endpoint - API endpoint starting with /api/v1
 * @param {RequestInit & { timeoutMs?: number; skipAuth?: boolean }} [options]
 * @returns {Promise<T>}
 */
export async function apiClient(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const method = (options.method || 'GET').toUpperCase();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const headers = new Headers(options.headers || {});

  // Set JSON Content-Type only when sending a body that is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject fresh access token if authenticated and not skipped
  if (!options.skipAuth && tokenProvider && !headers.has('Authorization')) {
    try {
      const token = await tokenProvider();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // Continue without token; backend will enforce 401 if needed
    }
  }

  let attempt = 0;
  const isIdempotentGet = method === 'GET';

  while (attempt <= (isIdempotentGet ? MAX_GET_RETRIES : 0)) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        method,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Handle successful empty response (e.g., 204)
      if (response.status === 204) {
        return /** @type {T} */ ({});
      }

      const requestId = response.headers.get('X-Request-ID') || 'unknown';

      // Parse JSON if possible
      let data = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      }

      if (!response.ok) {
        let code = 'HTTP_ERROR';
        let message = `Request failed with status ${response.status}`;

        if (data && data.error) {
          code = data.error.code || code;
          message = data.error.message || message;
          if (data.error.request_id) {
            // Prefer server-returned trace ID
            data.requestId = data.error.request_id;
          }
        }

        throw new ApiError(response.status, code, message, requestId);
      }

      return /** @type {T} */ (data);
    } catch (err) {
      clearTimeout(timer);

      // If aborted by timeout
      if (err.name === 'AbortError') {
        throw new ApiError(408, 'TIMEOUT', 'The request timed out. Please check your connection.', 'client-timeout');
      }

      // If already an ApiError, check if retrying 5xx on GET is eligible
      if (err instanceof ApiError) {
        const isServerError = err.status >= 500 && err.status < 600;
        if (isIdempotentGet && isServerError && attempt <= MAX_GET_RETRIES) {
          await sleep(BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1));
          continue;
        }
        throw err;
      }

      // Network / connection drop error
      if (isIdempotentGet && attempt <= MAX_GET_RETRIES) {
        await sleep(BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1));
        continue;
      }

      throw new ApiError(0, 'NETWORK_ERROR', 'Network connection unavailable. Please verify connectivity.', 'network-error');
    }
  }

  throw new ApiError(0, 'MAX_RETRIES_EXCEEDED', 'Unable to complete request after retries.', 'retry-failed');
}
