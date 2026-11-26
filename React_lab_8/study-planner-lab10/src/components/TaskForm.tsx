import { useState } from 'react';
import type { FormEvent } from 'react';
import { DEFAULT_CATEGORY } from '../constants';
import type { NewTask, Priority, Task } from '../types/task';
import './TaskForm.scss';

interface TaskFormProps {
  editingTask: Task | null;
  /** Повертає true, якщо операція успішна (тоді форма очищується). */
  onSubmit: (values: NewTask) => Promise<boolean>;
  onCancel: () => void;
}

function TaskForm({ editingTask, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = editingTask !== null;

  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Вкажіть назву завдання');
      return;
    }

    setSubmitting(true);
    const success = await onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || DEFAULT_CATEGORY,
      priority,
    });
    setSubmitting(false);

    if (success && !isEditing) {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
      setError('');
    }
  };

  return (
    <form
      className={`task-form${isEditing ? ' task-form--editing' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="task-form__title">{isEditing ? 'Редагування завдання' : 'Нове завдання'}</h2>

      <div className="task-form__field">
        <label className="task-form__label" htmlFor="task-title">
          Назва *
        </label>
        <input
          id="task-title"
          className={`task-form__input${error ? ' task-form__input--invalid' : ''}`}
          type="text"
          value={title}
          placeholder="Наприклад, Вивчити fetch"
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

      <div className="task-form__actions">
        <button className="task-form__submit" type="submit" disabled={submitting}>
          {submitting ? 'Збереження...' : isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {isEditing && (
          <button className="task-form__cancel" type="button" onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
