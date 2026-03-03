import { InjectionToken } from '@angular/core';
import { ITaskRepository } from '../interfaces/task-repository.interface';
import { ICategoryRepository } from '../interfaces/category-repository.interface';

export const TASK_REPOSITORY_TOKEN = new InjectionToken<ITaskRepository>(
  'ITaskRepository'
);

export const CATEGORY_REPOSITORY_TOKEN = new InjectionToken<ICategoryRepository>(
  'ICategoryRepository'
);