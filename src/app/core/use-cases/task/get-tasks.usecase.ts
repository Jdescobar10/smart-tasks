import { Injectable, Inject } from '@angular/core';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ITaskRepository } from '../../interfaces/task-repository.interface';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class GetTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: ITaskRepository
  ) {}

  async execute(categoryId?: string): Promise<Task[]> {
    if (categoryId) {
      return this.taskRepository.getByCategory(categoryId);
    }
    return this.taskRepository.getAll();
  }
}