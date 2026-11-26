import { useTaskContext } from '../hooks/useTaskContext';
import type { TaskFilter } from '../types/task';
import './TaskFilters.scss';

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
];

function TaskFilters() {
  const { tasks, filter, setFilter, clearCompleted, resetTasks } = useTaskContext();

  const completedCount = tasks.filter((task) => task.completed).length;
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: completedCount,
    active: tasks.length - completedCount,
  };

  return (
    <div className="task-filters">
      <div className="task-filters__group" role="group" aria-label="Фільтр завдань">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`task-filters__button${
              filter === value ? ' task-filters__button--active' : ''
            }`}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label} ({counts[value]})
          </button>
        ))}
      </div>

      <div className="task-filters__tools">
        {completedCount > 0 && (
          <button type="button" className="task-filters__link" onClick={clearCompleted}>
            Очистити виконані
          </button>
        )}
        <button
          type="button"
          className="task-filters__link task-filters__link--muted"
          onClick={resetTasks}
        >
          Скинути дані
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;
