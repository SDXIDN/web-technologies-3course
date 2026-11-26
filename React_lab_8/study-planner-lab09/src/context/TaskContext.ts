import { createContext } from 'react';
import type { PendingDelete } from '../reducers/taskReducer';
import type { NewTask, Task, TaskFilter, ToastMessage } from '../types/task';

export interface TaskContextValue {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  pendingDelete: PendingDelete | null;
  editingTask: Task | null;
  toast: ToastMessage | null;

  addTask: (task: NewTask) => void;
  updateTask: (id: number, changes: NewTask) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: () => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  startEdit: (id: number) => void;
  cancelEdit: () => void;
  dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
