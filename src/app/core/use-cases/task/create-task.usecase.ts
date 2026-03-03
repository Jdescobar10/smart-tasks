import { Injectable, Inject } from '@angular/core';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ITaskRepository } from '../../interfaces/task-repository.interface';
import { Task, CreateTaskDTO } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: ITaskRepository
  ) {}

  async execute(dto: CreateTaskDTO): Promise<Task> {
    if (!dto.title?.trim()) {
      throw new Error('Task title is required');
    }
    return this.taskRepository.create(dto);
  }
}