import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage, isAbortError } from '../api/errors';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

export type TaskDetailsState =
  | { status: 'loading' }
  | { status: 'success'; task: Task }
  | { status: 'error'; message: string };

/** Локальний state деталей: окремий Context для цього не потрібен. */
export function useTask(id: number, version: number) {
  const [state, setState] = useState<TaskDetailsState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    taskRepository
      .getById(id, controller.signal)
      .then((task) => setState({ status: 'success', task }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState({ status: 'error', message: getErrorMessage(error) });
      });

    return () => controller.abort();
  }, [id, version, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return { state, retry };
}
