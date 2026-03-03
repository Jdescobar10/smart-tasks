import { Injectable, Inject } from '@angular/core';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ITaskRepository } from '../../interfaces/task-repository.interface';
import { Task, UpdateTaskDTO } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: ITaskRepository
  ) {}

  async execute(id: string, dto: UpdateTaskDTO): Promise<Task> {
    if (!id) {
      throw new Error('Task id is required');
    }
    return this.taskRepository.update(id, dto);
  }
}