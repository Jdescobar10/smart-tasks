export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  color: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
}

