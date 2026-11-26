import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

function TaskItem({ task }: TaskItemProps) {
  const { pendingDelete, toggleTask, requestDelete, startEdit } = useTaskContext();
  const { id, title, description, completed, priority, category } = task;
  const isPending = pendingDelete?.ids.includes(id) ?? false;

  const className = [
    'task-item',
    completed && 'task-item--completed',
    isPending && 'task-item--pending',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      <div className="task-item__body">
        <h3 className="task-item__title">{title}</h3>
        {description && <p className="task-item__description">{description}</p>}

        <div className="task-item__meta">
          <span className="task-item__tag">{category}</span>
          <span className={`task-item__tag task-item__tag--${priority}`}>
            {PRIORITY_LABELS[priority]}
          </span>
          <span className="task-item__status">
            {isPending ? 'Буде видалено' : completed ? 'Виконано' : 'Не виконано'}
          </span>
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button task-item__button--toggle"
          disabled={isPending}
          onClick={() => toggleTask(id)}
        >
          {completed ? 'Повернути' : 'Виконати'}
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--edit"
          disabled={isPending}
          onClick={() => startEdit(id)}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          disabled={isPending}
          onClick={() => requestDelete(id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
