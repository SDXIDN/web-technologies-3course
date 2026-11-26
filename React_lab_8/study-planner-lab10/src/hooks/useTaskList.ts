import { useCallback, useEffect, useReducer, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/errors';
import { PAGE_SIZE } from '../constants';
import { initialTaskListState, taskListReducer } from '../reducers/taskListReducer';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export function useTaskList(page: number) {
  const [state, dispatch] = useReducer(taskListReducer, initialTaskListState);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'fetch' });

    taskRepository
      .getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, signal: controller.signal })
      .then(({ tasks, total }) => dispatch({ type: 'success', payload: { tasks, total } }))
      .catch((error: unknown) => {
        // Скасований запит не показуємо як помилку завантаження.
        if (isAbortError(error)) return;
        dispatch({ type: 'failure', payload: getErrorMessage(error) });
      });

    // Cleanup: перехід на іншу сторінку або unmount скасовує запит, що ще виконується.
    return () => controller.abort();
  }, [page, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);
  const applyCreated = useCallback((task: Task) => dispatch({ type: 'created', payload: task }), []);
  const applyUpdated = useCallback((task: Task) => dispatch({ type: 'updated', payload: task }), []);
  const applyDeleted = useCallback((id: number) => dispatch({ type: 'deleted', payload: id }), []);

  return { state, retry, applyCreated, applyUpdated, applyDeleted };
}
