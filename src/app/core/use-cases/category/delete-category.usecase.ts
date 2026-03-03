import { Injectable, Inject } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ICategoryRepository } from '../../interfaces/category-repository.interface';

@Injectable({ providedIn: 'root' })
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Category id is required');
    }
    return this.categoryRepository.delete(id);
  }
}