import { Injectable, Inject } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ICategoryRepository } from '../../interfaces/category-repository.interface';
import { Category, UpdateCategoryDTO } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    if (!id) {
      throw new Error('Category id is required');
    }
    return this.categoryRepository.update(id, dto);
  }
}