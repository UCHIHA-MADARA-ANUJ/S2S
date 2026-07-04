/**
 * Lightweight retry with exponential backoff.
 * Use for flaky network calls and rate-limited APIs.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  factor?: number;
  shouldRetry?: (err: any) => boolean;
  onRetry?: (attempt: number, err: any) => void;
}

export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 500,
    maxDelayMs = 8000,
    factor = 2,
    shouldRetry = () => true,
    onRetry
  } = opts;

  let lastErr: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      if (attempt === maxRetries) break;
      if (!shouldRetry(err)) break;
      const delay = Math.min(initialDelayMs * Math.pow(factor, attempt), maxDelayMs);
      onRetry?.(attempt + 1, err);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

/** Wraps fetch with a timeout (default 30s) + retry on 5xx/429/network. */
export async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit & { timeoutMs?: number; maxRetries?: number; onRetry?: (n: number) => void }): Promise<Response> {
  const { timeoutMs = 30000, maxRetries = 2, onRetry, ...rest } = init || {};
  return retry(async () => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(input, { ...rest, signal: controller.signal });
      if (res.status >= 500 || res.status === 429 || res.status === 408) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (e: any) {
      if (e.name === "AbortError") throw new Error(`Request timed out after ${timeoutMs}ms`);
      throw e;
    } finally {
      clearTimeout(t);
    }
  }, { maxRetries, onRetry: (n) => onRetry?.(n) });
}
