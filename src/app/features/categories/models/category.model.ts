export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  sortOrder: number;
  noteCount: number;
  childCount: number;
  createdAtUtc: string;
}

export interface CategoryTreeResponse {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  noteCount: number;
  children: CategoryTreeResponse[];
}

export interface CategoryRequest {
  name: string;
  description: string | null;
  parentCategoryId: string | null;
  sortOrder: number;
}
