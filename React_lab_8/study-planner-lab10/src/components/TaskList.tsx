import type { Task } from '../types/task';
import TaskItem from './TaskItem';
import type { TaskItemActions } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[];
  selectedId: number | null;
  busyId: number | null;
  deleteCandidateId: number | null;
  actions: TaskItemActions;
}

function TaskList({ tasks, selectedId, busyId, deleteCandidateId, actions }: TaskListProps) {
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
        <TaskItem
          key={task.id}
          task={task}
          busy={busyId === task.id}
          selected={selectedId === task.id}
          confirmingDelete={deleteCandidateId === task.id}
          {...actions}
        />
      ))}
    </ul>
  );
}

export default TaskList;
