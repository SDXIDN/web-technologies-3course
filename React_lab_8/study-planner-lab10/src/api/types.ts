/** DTO — формат, який повертає DummyJSON. Живе лише в API-шарі та repository. */
export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}
