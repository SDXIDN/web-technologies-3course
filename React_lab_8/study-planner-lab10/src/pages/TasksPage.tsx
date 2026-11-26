import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getErrorMessage } from '../api/errors';
import Pagination from '../components/Pagination';
import StatusMessage from '../components/StatusMessage';
import TaskDetails from '../components/TaskDetails';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import type { TaskItemActions } from '../components/TaskItem';
import TaskStats from '../components/TaskStats';
import Toast from '../components/Toast';
import { PAGE_SIZE, STORAGE_KEYS } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTaskList } from '../hooks/useTaskList';
import { useToast } from '../hooks/useToast';
import { taskRepository } from '../repositories/taskRepository';
import type { NewTask, TaskFilter } from '../types/task';
import './TasksPage.scss';

const FILTERS: TaskFilter[] = ['all', 'completed', 'active'];

function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter);
}

function TasksPage() {
  // --- client/UI state ---
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useLocalStorage<TaskFilter>(STORAGE_KEYS.filter, 'all', isTaskFilter);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsVersion, setDetailsVersion] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  // --- server state ---
  const { state, retry, applyCreated, applyUpdated, applyDeleted } = useTaskList(page);
  const { toast, showToast, dismissToast } = useToast();

  const { tasks } = state;
  const editingTask = tasks.find((task) => task.id === editingId) ?? null;

  // Derived state: рахується під час render.
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const totalPages = Math.max(1, Math.ceil(state.total / PAGE_SIZE));
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [activeCount]);

  const refreshDetails = (id: number) => {
    if (selectedId === id) setDetailsVersion((version) => version + 1);
  };

  /** Виконує операцію над одним завданням: блокує його кнопки та показує помилку в Toast. */
  const runMutation = async (id: number, action: () => Promise<void>): Promise<boolean> => {
    setBusyId(id);
    try {
      await action();
      return true;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handlePageChange = (nextPage: number) => {
    setDeleteCandidateId(null);
    setPage(nextPage);
  };

  const handleSubmit = async (values: NewTask): Promise<boolean> => {
    try {
      if (editingTask) {
        const updated = await taskRepository.update(editingTask.id, { ...editingTask, ...values });
        applyUpdated(updated);
        refreshDetails(updated.id);
        setEditingId(null);
        showToast('Завдання оновлено');
      } else {
        const created = await taskRepository.create(values);
        applyCreated(created);
        showToast('Завдання створено');
      }
      return true;
    } catch (error) {
      showToast(getErrorMessage(error), 'error');
      return false;
    }
  };

  const actions: TaskItemActions = {
    onToggle: (task) => {
      void runMutation(task.id, async () => {
        const updated = await taskRepository.update(task.id, { ...task, completed: !task.completed });
        applyUpdated(updated);
        refreshDetails(task.id);
      });
    },
    onEdit: (id) => {
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onSelect: setSelectedId,
    onAskDelete: setDeleteCandidateId,
    onCancelDelete: () => setDeleteCandidateId(null),
    onConfirmDelete: (id) => {
      void runMutation(id, async () => {
        await taskRepository.delete(id);
        applyDeleted(id);
        setDeleteCandidateId(null);
        if (selectedId === id) setSelectedId(null);
        if (editingId === id) setEditingId(null);
        // Якщо видалили останній елемент не першої сторінки — повертаємось назад.
        if (tasks.length === 1 && page > 1) setPage(page - 1);
        showToast('Завдання видалено');
      });
    },
  };

  let content: ReactNode;
  if (state.status === 'loading') {
    content = <StatusMessage variant="loading">Loading...</StatusMessage>;
  } else if (state.status === 'error') {
    content = (
      <StatusMessage variant="error" actionLabel="Спробувати ще" onAction={retry}>
        {`Помилка завантаження. ${state.error}`}
      </StatusMessage>
    );
  } else if (tasks.length === 0) {
    content = <StatusMessage variant="empty">Завдань не знайдено.</StatusMessage>;
  } else {
    content = (
      <TaskList
        tasks={visibleTasks}
        selectedId={selectedId}
        busyId={busyId}
        deleteCandidateId={deleteCandidateId}
        actions={actions}
      />
    );
  }

  return (
    <>
      <main className="tasks-page">
        {/* key скидає внутрішній state форми при переході між додаванням і редагуванням */}
        <TaskForm
          key={editingTask?.id ?? 'new'}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setEditingId(null)}
        />

        {selectedId !== null && (
          <TaskDetails
            taskId={selectedId}
            version={detailsVersion}
            onClose={() => setSelectedId(null)}
          />
        )}

        <TaskStats total={state.total} completed={completedCount} active={activeCount} />
        <TaskFilters
          current={filter}
          counts={{ all: tasks.length, completed: completedCount, active: activeCount }}
          onChange={setFilter}
        />

        {content}

        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

        <p className="tasks-page__note">
          Навчальне API DummyJSON не зберігає зміни: створення, редагування та видалення
          підтверджуються сервером, але після перезавантаження сторінки дані повертаються до початкових.
        </p>
      </main>

      <div className="toast-region">
        {toast && <Toast key={toast.id} message={toast.message} variant={toast.variant} onClose={dismissToast} />}
      </div>
    </>
  );
}

export default TasksPage;
