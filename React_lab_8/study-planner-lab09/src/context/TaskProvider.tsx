import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS, TOAST_DURATION_MS, UNDO_DELAY_MS } from '../constants';
import { initialTasks } from '../data/initialTasks';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createInitialState, taskReducer } from '../reducers/taskReducer';
import type { TaskState } from '../reducers/taskReducer';
import type { NewTask, TaskFilter, ToastMessage, ToastVariant } from '../types/task';
import { loadTasks, saveTasks } from '../utils/storage';
import { TaskContext } from './TaskContext';
import type { TaskContextValue } from './TaskContext';

const FILTERS: TaskFilter[] = ['all', 'completed', 'active'];

function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter);
}

/** Початковий state: збережені завдання або стартовий список. */
function init(): TaskState {
  return createInitialState(loadTasks() ?? initialTasks);
}

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [{ tasks, pendingDelete }, dispatch] = useReducer(taskReducer, undefined, init);
  const [filter, setFilter] = useLocalStorage<TaskFilter>(STORAGE_KEYS.filter, 'all', isTaskFilter);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastCounter = useRef(0);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    toastCounter.current += 1;
    setToast({ id: toastCounter.current, message, variant });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // Effect: зберігаємо tasks у localStorage після кожної зміни.
  // Reducer лишається єдиним джерелом правди, сховище — лише копія.
  useEffect(() => {
    if (!saveTasks(tasks)) {
      showToast('Не вдалося зберегти дані в браузері', 'error');
    }
  }, [tasks, showToast]);

  // Effect: Toast зникає сам; cleanup скидає таймер при новому Toast або unmount.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  // Effect: таймер Undoable Delete. Це side effect, тому він живе тут, а не в reducer.
  useEffect(() => {
    if (!pendingDelete) return;

    const count = pendingDelete.ids.length;
    const timer = setTimeout(() => {
      dispatch({ type: 'confirmDelete' });
      showToast(count === 1 ? 'Завдання видалено' : `Видалено завдань: ${count}`);
    }, UNDO_DELAY_MS);

    // Cleanup: Undo, нове видалення або unmount скасовують попередній таймер.
    return () => clearTimeout(timer);
  }, [pendingDelete, showToast]);

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingId) ?? null,
    [tasks, editingId],
  );

  const addTask = useCallback(
    (task: NewTask) => {
      dispatch({ type: 'add', payload: task });
      showToast('Завдання створено');
    },
    [showToast],
  );

  const updateTask = useCallback(
    (id: number, changes: NewTask) => {
      if (!tasks.some((task) => task.id === id)) {
        showToast('Не вдалося зберегти: завдання не знайдено', 'error');
        return;
      }
      dispatch({ type: 'update', payload: { id, changes } });
      setEditingId(null);
      showToast('Завдання оновлено');
    },
    [tasks, showToast],
  );

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: { id } });
  }, []);

  const requestDelete = useCallback(
    (id: number) => {
      if (editingId === id) setEditingId(null);
      dispatch({ type: 'requestDelete', payload: { id } });
    },
    [editingId],
  );

  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' });
  }, []);

  const clearCompleted = useCallback(() => {
    if (!tasks.some((task) => task.completed)) {
      showToast('Немає виконаних завдань для очищення', 'error');
      return;
    }
    dispatch({ type: 'clearCompleted' });
  }, [tasks, showToast]);

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' });
    setFilter('all');
    setEditingId(null);
    showToast('Дані скинуто до початкових', 'info');
  }, [setFilter, showToast]);

  const startEdit = useCallback((id: number) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const cancelEdit = useCallback(() => setEditingId(null), []);

  // useMemo: новий об'єкт створюється лише тоді, коли змінилися дані.
  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      filter,
      setFilter,
      pendingDelete,
      editingTask,
      toast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      startEdit,
      cancelEdit,
      dismissToast,
    }),
    [
      tasks,
      filter,
      setFilter,
      pendingDelete,
      editingTask,
      toast,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      startEdit,
      cancelEdit,
      dismissToast,
    ],
  );

  return <TaskContext value={value}>{children}</TaskContext>;
}
