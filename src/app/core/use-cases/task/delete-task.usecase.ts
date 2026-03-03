import { Injectable, Inject } from '@angular/core';
import { TASK_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ITaskRepository } from '../../interfaces/task-repository.interface';

@Injectable({ providedIn: 'root' })
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN) private taskRepository: ITaskRepository
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Task id is required');
    }
    return this.taskRepository.delete(id);
  }
}