import { PRIORITY_LABELS } from '../constants';
import { useTask } from '../hooks/useTask';
import StatusMessage from './StatusMessage';
import './TaskDetails.scss';

interface TaskDetailsProps {
  taskId: number;
  /** Збільшується після змін, щоб деталі перезавантажилися. */
  version: number;
  onClose: () => void;
}

function TaskDetails({ taskId, version, onClose }: TaskDetailsProps) {
  const { state, retry } = useTask(taskId, version);

  return (
    <section className="task-details" aria-label="Деталі завдання">
      <header className="task-details__header">
        <h2 className="task-details__title">Деталі завдання #{taskId}</h2>
        <button type="button" className="task-details__close" onClick={onClose}>
          Закрити
        </button>
      </header>

      {state.status === 'loading' && <StatusMessage variant="loading">Loading...</StatusMessage>}

      {state.status === 'error' && (
        <StatusMessage
          variant="error"
          actionLabel="Спробувати ще"
          onAction={retry}
        >{`Помилка завантаження. ${state.message}`}</StatusMessage>
      )}

      {state.status === 'success' && (
        <dl className="task-details__list">
          <dt>Назва</dt>
          <dd>{state.task.title}</dd>
          <dt>Опис</dt>
          <dd>{state.task.description || '—'}</dd>
          <dt>Категорія</dt>
          <dd>{state.task.category}</dd>
          <dt>Пріоритет</dt>
          <dd>{PRIORITY_LABELS[state.task.priority]}</dd>
          <dt>Статус</dt>
          <dd>{state.task.completed ? 'Виконано' : 'Не виконано'}</dd>
        </dl>
      )}
    </section>
  );
}

export default TaskDetails;
