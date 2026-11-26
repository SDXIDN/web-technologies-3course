import { useEffect } from 'react';
import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import ToastRegion from './components/ToastRegion';
import { useTaskContext } from './hooks/useTaskContext';
import './App.scss';

function App() {
  const { tasks, editingTask } = useTaskContext();

  // Derived value: рахуємо під час render, окремий state або Effect не потрібні.
  const activeCount = tasks.filter((task) => !task.completed).length;

  // Effect: синхронізація React state із зовнішнім API браузера (document.title).
  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [activeCount]);

  return (
    <div className="app">
      <Header />
      <main className="app__content">
        {/* key скидає внутрішній state форми при переході між додаванням і редагуванням */}
        <TaskForm key={editingTask?.id ?? 'new'} />
        <TaskStats />
        <TaskFilters />
        <TaskList />
      </main>
      <ToastRegion />
    </div>
  );
}

export default App;
