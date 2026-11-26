import { initialTasks } from '../data/initialTasks';
import type { NewTask, Task } from '../types/task';

/** Завдання, що очікують остаточного видалення (Undoable Delete). */
export interface PendingDelete {
  ids: number[];
  /** Унікальний номер запиту: за ним Effect перезапускає таймер. */
  token: number;
}

export interface TaskState {
  tasks: Task[];
  pendingDelete: PendingDelete | null;
  deleteCounter: number;
}

export type TaskAction =
  | { type: 'add'; payload: NewTask }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; changes: NewTask } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'clearCompleted' }
  | { type: 'reset' };

export function createInitialState(tasks: Task[]): TaskState {
  return { tasks, pendingDelete: null, deleteCounter: 0 };
}

/** Остаточно прибирає з масиву завдання, що очікували видалення. */
function commitPendingDelete(state: TaskState): TaskState {
  if (!state.pendingDelete) return state;
  const { ids } = state.pendingDelete;
  return {
    ...state,
    tasks: state.tasks.filter((task) => !ids.includes(task.id)),
    pendingDelete: null,
  };
}

/** Запускає відкладене видалення. Таймера тут немає — його створює useEffect. */
function startPendingDelete(state: TaskState, ids: number[]): TaskState {
  // Підтримується лише одне активне видалення: попереднє завершуємо одразу.
  const base = commitPendingDelete(state);
  const existingIds = ids.filter((id) => base.tasks.some((task) => task.id === id));
  if (existingIds.length === 0) return base;

  const token = base.deleteCounter + 1;
  return { ...base, pendingDelete: { ids: existingIds, token }, deleteCounter: token };
}

/**
 * Чиста функція: без HTTP, DOM, localStorage, таймерів та UI-логіки.
 * Однаковий вхід завжди дає однаковий результат.
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const nextId = state.tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      const task: Task = { ...action.payload, id: nextId, completed: false };
      return { ...state, tasks: [...state.tasks, task] };
    }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, completed: !task.completed } : task,
        ),
      };

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.changes } : task,
        ),
      };

    case 'requestDelete':
      return startPendingDelete(state, [action.payload.id]);

    case 'confirmDelete':
      return commitPendingDelete(state);

    case 'undoDelete':
      return state.pendingDelete ? { ...state, pendingDelete: null } : state;

    case 'clearCompleted':
      return startPendingDelete(
        state,
        state.tasks.filter((task) => task.completed).map((task) => task.id),
      );

    case 'reset':
      return createInitialState(initialTasks);

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
