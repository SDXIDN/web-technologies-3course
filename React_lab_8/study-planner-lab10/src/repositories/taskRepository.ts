import { httpClient } from '../api/httpClient';
import type { ApiTodo, TodosResponse } from '../api/types';
import { DEFAULT_CATEGORY } from '../constants';
import type { NewTask, Task } from '../types/task';

export interface TaskPage {
  tasks: Task[];
  total: number;
  skip: number;
  limit: number;
}

interface GetAllParams {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

const USER_ID = 1;

/**
 * Client-only metadata: DummyJSON не знає про description, priority та category.
 * Зберігаємо їх у пам'яті на час сесії й додаємо при мапінгу DTO → Task.
 */
type ClientMeta = Pick<Task, 'description' | 'priority' | 'category'>;

const DEFAULT_META: ClientMeta = { description: '', priority: 'medium', category: DEFAULT_CATEGORY };
const clientMeta = new Map<number, ClientMeta>();

/**
 * DummyJSON не зберігає створені записи: POST повертає id, але GET/PUT/DELETE за цим id
 * дадуть 404. Тому створені в цій сесії завдання repository тримає у себе.
 */
const createdTasks = new Map<number, Task>();
let lastLocalId = 0;

function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    completed: todo.completed,
    ...(clientMeta.get(todo.id) ?? DEFAULT_META),
  };
}

function pickMeta({ description, priority, category }: Task): ClientMeta {
  return { description, priority, category };
}

/**
 * Repository ховає від UI endpoint-и, DTO та деталі HTTP.
 * Компоненти знають лише про domain-модель Task.
 */
export const taskRepository = {
  async getAll({ limit, skip, signal }: GetAllParams): Promise<TaskPage> {
    const data = await httpClient.get<TodosResponse>('/todos', { query: { limit, skip }, signal });
    return {
      tasks: data.todos.map(toTask),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const local = createdTasks.get(id);
    if (local) return local;

    return toTask(await httpClient.get<ApiTodo>(`/todos/${id}`, { signal }));
  },

  async create(values: NewTask): Promise<Task> {
    const todo = await httpClient.post<ApiTodo>('/todos/add', {
      todo: values.title,
      completed: false,
      userId: USER_ID,
    });

    // Навчальний API щоразу повертає один і той самий id, тому гарантуємо унікальність.
    lastLocalId = Math.max(todo.id, lastLocalId + 1);
    const task: Task = { ...values, id: lastLocalId, completed: false };
    createdTasks.set(task.id, task);
    return task;
  },

  /** Повна заміна (PUT): надсилаємо поточну назву й completed, щоб відповідь була узгодженою. */
  async update(id: number, task: Task): Promise<Task> {
    if (createdTasks.has(id)) {
      const next: Task = { ...task, id };
      createdTasks.set(id, next);
      return next;
    }

    const todo = await httpClient.put<ApiTodo>(`/todos/${id}`, {
      todo: task.title,
      completed: task.completed,
    });
    clientMeta.set(id, pickMeta(task));
    return toTask(todo);
  },

  async delete(id: number): Promise<void> {
    if (createdTasks.delete(id)) {
      clientMeta.delete(id);
      return;
    }

    await httpClient.delete<unknown>(`/todos/${id}`);
    clientMeta.delete(id);
  },
};
