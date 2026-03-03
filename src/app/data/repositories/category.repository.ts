import { Injectable } from '@angular/core';
import { ICategoryRepository } from '../../core/interfaces/category-repository.interface';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../core/models/category.model';
import { StorageService } from '../services/storage.service';

const CATEGORIES_KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoryRepository implements ICategoryRepository {

  constructor(private storageService: StorageService) {}

  async getAll(): Promise<Category[]> {
    const categories = await this.storageService.get<Category[]>(CATEGORIES_KEY);
    return categories ?? [];
  }

  async getById(id: string): Promise<Category | null> {
    const categories = await this.getAll();
    return categories.find(c => c.id === id) ?? null;
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const categories = await this.getAll();
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: dto.name,
      color: dto.color,
      createdAt: new Date()
    };
    categories.push(newCategory);
    await this.storageService.set(CATEGORIES_KEY, categories);
    return newCategory;
  }

  async update(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    const categories = await this.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Category ${id} not found`);
    categories[index] = {
      ...categories[index],
      ...dto
    };
    await this.storageService.set(CATEGORIES_KEY, categories);
    return categories[index];
  }

  async delete(id: string): Promise<void> {
    const categories = await this.getAll();
    const filtered = categories.filter(c => c.id !== id);
    await this.storageService.set(CATEGORIES_KEY, filtered);
  }
}