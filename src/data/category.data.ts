export interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon: string;
  isActive?: boolean;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}
