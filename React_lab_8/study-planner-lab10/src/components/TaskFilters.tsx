import type { TaskFilter } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
  current: TaskFilter;
  counts: Record<TaskFilter, number>;
  onChange: (filter: TaskFilter) => void;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
];

function TaskFilters({ current, counts, onChange }: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <div className="task-filters__group" role="group" aria-label="Фільтр завдань">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`task-filters__button${
              current === value ? ' task-filters__button--active' : ''
            }`}
            aria-pressed={current === value}
            onClick={() => onChange(value)}
          >
            {label} ({counts[value]})
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskFilters;
