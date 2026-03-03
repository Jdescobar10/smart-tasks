import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

export interface ITaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  getByCategory(categoryId: string): Promise<Task[]>;
  create(dto: CreateTaskDTO): Promise<Task>;
  update(id: string, dto: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}