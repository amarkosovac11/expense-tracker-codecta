import type { Category } from "../types/models";

export function categoryName(categories: Category[], categoryId: number) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
}
