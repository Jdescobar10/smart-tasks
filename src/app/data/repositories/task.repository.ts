import { Injectable } from '@angular/core';
import { ITaskRepository } from '../../core/interfaces/task-repository.interface';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../../core/models/task.model';
import { StorageService } from '../services/storage.service';

const TASKS_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskRepository implements ITaskRepository {

  constructor(private storageService: StorageService) {}

  async getAll(): Promise<Task[]> {
    const tasks = await this.storageService.get<Task[]>(TASKS_KEY);
    return tasks ?? [];
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.getAll();
    return tasks.find(t => t.id === id) ?? null;
  }

  async getByCategory(categoryId: string): Promise<Task[]> {
    const tasks = await this.getAll();
    return tasks.filter(t => t.categoryId === categoryId);
  }

  async create(dto: CreateTaskDTO): Promise<Task> {
    const tasks = await this.getAll();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      completed: false,
      categoryId: dto.categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    await this.storageService.set(TASKS_KEY, tasks);
    return newTask;
  }

  async update(id: string, dto: UpdateTaskDTO): Promise<Task> {
    const tasks = await this.getAll();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Task ${id} not found`);
    tasks[index] = {
      ...tasks[index],
      ...dto,
      updatedAt: new Date()
    };
    await this.storageService.set(TASKS_KEY, tasks);
    return tasks[index];
  }

  async delete(id: string): Promise<void> {
    const tasks = await this.getAll();
    const filtered = tasks.filter(t => t.id !== id);
    await this.storageService.set(TASKS_KEY, filtered);
  }
}