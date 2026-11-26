import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NewTask, Priority } from '../types/task';
import './TaskForm.scss';

interface TaskFormProps {
  onAdd: (task: NewTask) => void;
}

const DEFAULT_CATEGORY = 'Загальне';

function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Вкажіть назву завдання');
      return;
    }

    onAdd({
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || DEFAULT_CATEGORY,
      priority,
    });

    // Після успішного додавання очищаємо форму.
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setError('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">Нове завдання</h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          Назва *
        </label>
        <input
          id="task-title"
          className={`task-form__input${error ? ' task-form__input--invalid' : ''}`}
          type="text"
          value={title}
          placeholder="Наприклад, Вивчити useState"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'task-title-error' : undefined}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) setError('');
          }}
        />
        {error && (
          <p id="task-title-error" className="task-form__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-description">
          Опис
        </label>
        <textarea
          id="task-description"
          className="task-form__input task-form__input--textarea"
          rows={2}
          value={description}
          placeholder="Короткий опис завдання"
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-category">
            Категорія
          </label>
          <input
            id="task-category"
            className="task-form__input"
            type="text"
            value={category}
            placeholder={DEFAULT_CATEGORY}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
            className="task-form__input"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
      </div>

      <button className="task-form__submit" type="submit">
        Додати
      </button>
    </form>
  );
}

export default TaskForm;
