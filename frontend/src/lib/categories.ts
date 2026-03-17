import api from "../api/axios";
import type { Category } from "../types/models";

export function categoryName(categories: Category[], categoryId: number) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(name: string): Promise<Category> {
  const response = await api.post<Category>("/categories", { name });
  return response.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}