# Study Planner (Лабораторні роботи №8–9)

Планувальник навчальних завдань на **React 19 + TypeScript + Vite**, стилі — **SCSS + BEM**.

- Лаб. №8: компоненти, props, `useState`, списки, фільтри.
- Лаб. №9: `useReducer`, Context API, `useEffect`, `localStorage`, custom hooks, Toast, Undoable Delete.

## Запуск

Потрібен Node.js ≥ 22.22.

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Архітектура стану

```
TaskProvider ── useReducer(taskReducer)  → tasks, pendingDelete   (єдине джерело правди)
             ├─ useLocalStorage          → filter
             ├─ useState                 → editingId, toast        (UI-стан)
             └─ useEffect × 3            → запис tasks у localStorage,
                                           автозникнення Toast,
                                           таймер Undoable Delete (clearTimeout у cleanup)
```

- `src/reducers/taskReducer.ts` — чиста функція (`add`, `toggle`, `update`, `requestDelete`,
  `confirmDelete`, `undoDelete`, `clearCompleted`, `reset`), без таймерів і `localStorage`.
- `src/context/` — `TaskContext` та `TaskProvider`.
- `src/hooks/` — `useTaskContext()` (кидає помилку поза провайдером) та `useLocalStorage<T>()`.
- `src/utils/storage.ts` — читання/запис `tasks` з обробкою пошкоджених даних.
- Відфільтрований список і статистика — derived state, обчислюються під час render.
- `document.title` синхронізується з кількістю невиконаних завдань (`App.tsx`).

## Undoable Delete

«Видалити» → завдання отримує стан «Буде видалено» → Toast із кнопкою «Скасувати» та
смужкою прогресу на 5 секунд → після завершення таймера `confirmDelete` видаляє остаточно.
Одночасно діє одне видалення (нове видалення завершує попереднє одразу).
«Очистити виконані» працює через той самий механізм з Undo.
