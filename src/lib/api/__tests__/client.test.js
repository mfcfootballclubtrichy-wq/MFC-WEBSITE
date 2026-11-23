/* global global */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, setTokenProvider } from '../client.js';
import { ApiError } from '../error.js';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setTokenProvider(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully fetches and parses JSON response', async () => {
    const mockData = { status: 'ok', version: '0.1.0' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': 'req-123' }),
      json: async () => mockData,
    });

    const result = await apiClient('/api/v1/health');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('parses standardized backend error envelope into ApiError', async () => {
    const errorBody = {
      error: {
        code: 'NOT_FOUND',
        message: 'Section not found',
        request_id: 'req-404-trace',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': 'req-404-trace' }),
      json: async () => errorBody,
    });

    try {
      await apiClient('/api/v1/content/nonexistent');
      expect.fail('Expected apiClient to throw ApiError');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect(err.status).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
      expect(err.message).toBe('Section not found');
      expect(err.requestId).toBe('req-404-trace');
    }
  });

  it('retries idempotent GET requests on 500 error up to 2 times', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount < 3) {
        return {
          ok: false,
          status: 500,
          headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': '500-err' }),
          json: async () => ({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Temporary failure' } }),
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json', 'X-Request-ID': 'success' }),
        json: async () => ({ status: 'recovered' }),
      };
    });

    const result = await apiClient('/api/v1/health');
    expect(result).toEqual({ status: 'recovered' });
    expect(callCount).toBe(3);
  });

  it('injects Authorization Bearer header when tokenProvider is set', async () => {
    setTokenProvider(async () => 'mock-jwt-token');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ data: 'authenticated' }),
    });

    await apiClient('/api/v1/admin/me');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const callArgs = global.fetch.mock.calls[0];
    const headers = callArgs[1].headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-jwt-token');
  });
});
