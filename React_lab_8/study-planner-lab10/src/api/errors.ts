/** Помилка HTTP-рівня. status = 0 означає, що відповіді не було (мережа). */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Скасований запит (AbortController) — це не помилка для користувача. */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

/** Перетворює будь-яку помилку на зрозумілий текст для інтерфейсу. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 0) return 'Не вдалося з’єднатися з сервером. Перевірте інтернет.';
    if (error.status === 404) return 'Завдання не знайдено (404).';
    if (error.status >= 500) return `Помилка сервера (${error.status}). Спробуйте пізніше.`;
    return `${error.message} (${error.status})`;
  }
  if (error instanceof Error) return error.message;
  return 'Сталася невідома помилка.';
}
