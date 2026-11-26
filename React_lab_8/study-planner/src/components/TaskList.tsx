import type { Task } from '../types/task';
import TaskItem from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  /** Завдання, вже відфільтровані за поточним фільтром. */
  tasks: Task[];
  /** true, якщо в застосунку взагалі немає завдань (а не лише у фільтрі). */
  isEmpty: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskList({ tasks, isEmpty, onToggle, onDelete }: TaskListProps) {
  if (isEmpty) {
    return (
      <div className="task-list__empty">
        <p>Завдань поки немає.</p>
        <p>Додайте перше навчальне завдання.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>За цим фільтром завдань немає.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TaskList;
