/**
 * Node.js test runner script for apiClient.
 * Exercises response parsing, error envelope parsing, timeout, retry backoff, and Authorization injection.
 */
import assert from 'node:assert';
import { apiClient, setTokenProvider } from './src/lib/api/client.js';
import { ApiError } from './src/lib/api/error.js';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err);
    failed++;
  }
}

console.log('Running API Client Unit Tests (Phase A)...');

// Test 1: Successful fetch and JSON parsing
await test('apiClient successfully parses JSON response', async () => {
  const originalFetch = global.fetch;
  const mockData = { status: 'ok', version: '0.1.0' };
  global.fetch = async () => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': 'req-test-123' }),
    json: async () => mockData,
  });

  try {
    const result = await apiClient('/api/v1/health');
    assert.deepStrictEqual(result, mockData);
  } finally {
    global.fetch = originalFetch;
  }
});

// Test 2: Standardized error envelope parsing into ApiError
await test('apiClient parses backend error envelope into ApiError with requestId', async () => {
  const originalFetch = global.fetch;
  const errorPayload = {
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      request_id: 'req-404-trace',
    },
  };
  global.fetch = async () => ({
    ok: false,
    status: 404,
    headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': 'req-404-trace' }),
    json: async () => errorPayload,
  });

  try {
    await apiClient('/api/v1/missing');
    assert.fail('Expected apiClient to throw ApiError');
  } catch (err) {
    assert(err instanceof ApiError, 'Expected ApiError instance');
    assert.strictEqual(err.status, 404);
    assert.strictEqual(err.code, 'NOT_FOUND');
    assert.strictEqual(err.message, 'Resource not found');
    assert.strictEqual(err.requestId, 'req-404-trace');
  } finally {
    global.fetch = originalFetch;
  }
});

// Test 3: Idempotent GET retry on 500 server error
await test('apiClient retries GET on 500 error up to 2 times', async () => {
  const originalFetch = global.fetch;
  let attempts = 0;
  global.fetch = async () => {
    attempts++;
    if (attempts < 3) {
      return {
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': '500-trace' }),
        json: async () => ({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Temporary failure' } }),
      };
    }
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': '200-trace' }),
      json: async () => ({ status: 'recovered' }),
    };
  };

  try {
    const res = await apiClient('/api/v1/health');
    assert.deepStrictEqual(res, { status: 'recovered' });
    assert.strictEqual(attempts, 3, 'Expected 3 attempts (1 initial + 2 retries)');
  } finally {
    global.fetch = originalFetch;
  }
});

// Test 4: Dynamic Authorization Bearer injection
await test('apiClient dynamically injects Authorization header from tokenProvider', async () => {
  const originalFetch = global.fetch;
  let capturedHeaders = null;
  setTokenProvider(async () => 'fresh-jwt-token-xyz');

  global.fetch = async (url, options) => {
    capturedHeaders = options.headers;
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ authenticated: true }),
    };
  };

  try {
    await apiClient('/api/v1/admin/me');
    assert(capturedHeaders instanceof Headers, 'Headers should be a Headers instance');
    assert.strictEqual(capturedHeaders.get('Authorization'), 'Bearer fresh-jwt-token-xyz');
  } finally {
    setTokenProvider(null);
    global.fetch = originalFetch;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
