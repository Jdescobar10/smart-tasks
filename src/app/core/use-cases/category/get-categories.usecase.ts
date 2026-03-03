import { Injectable, Inject } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from '../../tokens/repository.tokens';
import { ICategoryRepository } from '../../interfaces/category-repository.interface';
import { Category } from '../../models/category.model';

@Injectable({ providedIn: 'root' })
export class GetCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY_TOKEN) private categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }
}