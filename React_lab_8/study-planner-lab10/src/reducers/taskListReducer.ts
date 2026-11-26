import type { Task } from '../types/task';

export type ListStatus = 'loading' | 'success' | 'error';

/** Server state: список завдань, отриманий через API, та стан запиту. */
export interface TaskListState {
  status: ListStatus;
  tasks: Task[];
  total: number;
  error: string;
}

export type TaskListAction =
  | { type: 'fetch' }
  | { type: 'success'; payload: { tasks: Task[]; total: number } }
  | { type: 'failure'; payload: string }
  | { type: 'created'; payload: Task }
  | { type: 'updated'; payload: Task }
  | { type: 'deleted'; payload: number };

export const initialTaskListState: TaskListState = {
  status: 'loading',
  tasks: [],
  total: 0,
  error: '',
};

/** Чиста функція. Після mutation оновлюємо локальну копію, бо навчальний API нічого не зберігає. */
export function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
  switch (action.type) {
    case 'fetch':
      return { ...state, status: 'loading', error: '' };

    case 'success':
      return { status: 'success', error: '', ...action.payload };

    case 'failure':
      return { ...state, status: 'error', error: action.payload };

    case 'created':
      return { ...state, tasks: [action.payload, ...state.tasks], total: state.total + 1 };

    case 'updated':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
      };

    case 'deleted':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        total: Math.max(0, state.total - 1),
      };

    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
