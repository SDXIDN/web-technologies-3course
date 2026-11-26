import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { id, title, description, completed, priority, category } = task;

  return (
    <li className={`task-item${completed ? ' task-item--completed' : ''}`}>
      <div className="task-item__body">
        <h3 className="task-item__title">{title}</h3>
        {description && <p className="task-item__description">{description}</p>}

        <div className="task-item__meta">
          <span className="task-item__tag">{category}</span>
          <span className={`task-item__tag task-item__tag--${priority}`}>
            {PRIORITY_LABELS[priority]}
          </span>
          <span className="task-item__status">{completed ? 'Виконано' : 'Не виконано'}</span>
        </div>
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__button task-item__button--toggle"
          onClick={() => onToggle(id)}
        >
          {completed ? 'Повернути' : 'Виконати'}
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          onClick={() => onDelete(id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
