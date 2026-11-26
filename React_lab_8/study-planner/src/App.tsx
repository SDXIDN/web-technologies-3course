import { useState } from 'react';
import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import { initialTasks } from './data/initialTasks';
import type { NewTask, Task, TaskFilter } from './types/task';
import './App.scss';

function App() {
  // Єдине джерело правди: масив завдань і активний фільтр живуть у App,
  // а дочірні компоненти отримують дані через props та змінюють їх через callback-и.
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const handleAdd = (newTask: NewTask) => {
    setTasks((prev) => {
      const nextId = prev.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      return [...prev, { ...newTask, id: nextId, completed: false }];
    });
  };

  const handleToggle = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  // Похідні дані обчислюємо з поточного масиву — окремий state для них не потрібен.
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="app">
      <Header />
      <main className="app__content">
        <TaskForm onAdd={handleAdd} />
        <TaskStats total={tasks.length} completed={completedCount} active={activeCount} />
        <TaskFilters
          current={filter}
          counts={{ all: tasks.length, completed: completedCount, active: activeCount }}
          onChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
        <TaskList
          tasks={visibleTasks}
          isEmpty={tasks.length === 0}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
