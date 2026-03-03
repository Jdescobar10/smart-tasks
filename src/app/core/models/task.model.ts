export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  categoryId: string | null;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  categoryId?: string | null;
}

