import { Injectable, Inject } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ICategoryRepository } from '../../interfaces/category-repository.interface';
import { Category, CreateCategoryDTO } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository
  ) {}

  async execute(dto: CreateCategoryDTO): Promise<Category> {
    if (!dto.name?.trim()) {
      throw new Error('Category name is required');
    }
    return this.categoryRepository.create(dto);
  }
}