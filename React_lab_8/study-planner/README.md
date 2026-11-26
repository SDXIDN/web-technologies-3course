# Study Planner (Лабораторна робота №8)

Планувальник навчальних завдань на **React 19 + TypeScript + Vite**, стилі — **SCSS + BEM**.

## Запуск

Потрібен Node.js ≥ 22.22.

```bash
npm install
npm run dev      # режим розробки
npm run lint     # ESLint
npm run build    # перевірка типів + збірка
```

## Можливості

- список завдань, додавання (назва обов'язкова), видалення;
- позначення виконаним / повернення у «не виконано»;
- фільтри «Всі / Виконані / Не виконані» з лічильниками (додаткове завдання);
- статистика (всього / виконано / не виконано), що обчислюється з масиву без окремого state;
- кнопка «Очистити виконані» (додаткове завдання);
- повідомлення для порожнього списку та для порожнього результату фільтра.

## Структура

```
src/
├── components/   # Header, TaskForm, TaskList, TaskItem, TaskFilters, TaskStats (+ .scss поруч)
├── data/         # initialTasks.ts
├── types/        # task.ts (Task, Priority, TaskFilter, NewTask)
├── App.tsx       # state: tasks, filter + callback-и
└── main.tsx
```

State (`tasks`, `filter`) зберігається в `App`; дочірні компоненти отримують дані через props
і змінюють їх через callback-функції. Усі оновлення масиву — імутабельні (`map`, `filter`, spread).
