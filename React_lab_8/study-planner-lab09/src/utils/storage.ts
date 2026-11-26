import { STORAGE_KEYS } from '../constants';
import type { Priority, Task } from '../types/task';

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.category === 'string' &&
    PRIORITIES.includes(task.priority as Priority)
  );
}

/** Читає завдання зі сховища. Для порожніх або пошкоджених даних повертає null. */
export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tasks);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isTask)) return null;
    return parsed;
  } catch {
    // Пошкоджений JSON або недоступний localStorage не повинні ламати застосунок.
    return null;
  }
}

/** Повертає false, якщо записати дані не вдалося. */
export function saveTasks(tasks: Task[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
