/** Скільки часу (мс) користувач може скасувати видалення. */
export const UNDO_DELAY_MS = 5000;

/** Через скільки мс звичайний Toast зникає сам. */
export const TOAST_DURATION_MS = 3000;

export const STORAGE_KEYS = {
  tasks: 'study-planner:tasks',
  filter: 'study-planner:filter',
} as const;
