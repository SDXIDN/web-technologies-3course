import { PRIORITY_LABELS } from '../constants';
import type { Task } from '../types/task';
import './TaskItem.scss';

export interface TaskItemActions {
  onToggle: (task: Task) => void;
  onEdit: (id: number) => void;
  onSelect: (id: number) => void;
  onAskDelete: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
}

interface TaskItemProps extends TaskItemActions {
  task: Task;
  /** Для цього завдання зараз виконується запит. */
  busy: boolean;
  selected: boolean;
  confirmingDelete: boolean;
}

function TaskItem({
  task,
  busy,
  selected,
  confirmingDelete,
  onToggle,
  onEdit,
  onSelect,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
}: TaskItemProps) {
  const { id, title, description, completed, priority, category } = task;

  const className = [
    'task-item',
    completed && 'task-item--completed',
    selected && 'task-item--selected',
    busy && 'task-item--busy',
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
          <span className="task-item__status">{completed ? 'Виконано' : 'Не виконано'}</span>
        </div>

        {confirmingDelete && (
          <div className="task-item__confirm" role="alertdialog" aria-label="Підтвердження видалення">
            <span>Видалити це завдання?</span>
            <button
              type="button"
              className="task-item__button task-item__button--delete"
              disabled={busy}
              onClick={() => onConfirmDelete(id)}
            >
              {busy ? 'Видалення...' : 'Так, видалити'}
            </button>
            <button type="button" className="task-item__button" disabled={busy} onClick={onCancelDelete}>
              Ні
            </button>
          </div>
        )}
      </div>

      <div className="task-item__actions">
        <button type="button" className="task-item__button" onClick={() => onSelect(id)}>
          Деталі
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--toggle"
          disabled={busy}
          onClick={() => onToggle(task)}
        >
          {completed ? 'Повернути' : 'Виконати'}
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--edit"
          disabled={busy}
          onClick={() => onEdit(id)}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="task-item__button task-item__button--delete"
          disabled={busy || confirmingDelete}
          onClick={() => onAskDelete(id)}
        >
          Видалити
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
