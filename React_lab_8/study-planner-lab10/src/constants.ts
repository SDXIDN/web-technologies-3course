import type { Priority } from './types/task';

/** Кількість завдань на сторінці (параметр limit у запиті). */
export const PAGE_SIZE = 10;

/** Через скільки мс Toast зникає сам. */
export const TOAST_DURATION_MS = 3000;

export const DEFAULT_CATEGORY = 'Загальне';

export const STORAGE_KEYS = {
  // У localStorage зберігається лише client/UI state. Дані з API (server state) — ні.
  filter: 'study-planner:filter',
} as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};
