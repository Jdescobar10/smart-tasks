import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category | null>;
  create(dto: CreateCategoryDTO): Promise<Category>;
  update(id: string, dto: UpdateCategoryDTO): Promise<Category>;
  delete(id: string): Promise<void>;
}

