import { HttpError, isAbortError } from './errors';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: Method;
  body?: unknown;
  query?: Record<string, string | number>;
  signal?: AbortSignal;
}

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('Не задано VITE_API_URL. Скопіюйте .env.example у .env і перезапустіть dev-сервер.');
  }
  return url.replace(/\/+$/, '');
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${getBaseUrl()}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const { message } = data as { message: unknown };
      if (typeof message === 'string') return message;
    }
  } catch {
    // тіло відповіді не JSON — використовуємо загальний текст
  }
  return response.statusText || `HTTP ${response.status}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, signal } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      signal,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (isAbortError(error)) throw error; // скасування обробляє вищий рівень
    throw new HttpError(0, 'Network error');
  }

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

/** Єдине місце, яке знає про fetch, базовий URL та обробку HTTP-статусів. */
export const httpClient = {
  get: <T>(path: string, options?: Pick<RequestOptions, 'query' | 'signal'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body, signal }),
  put: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PUT', body, signal }),
  patch: <T>(path: string, body: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PATCH', body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: 'DELETE', signal }),
};
