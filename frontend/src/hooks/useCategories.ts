import { useMemo } from "react";
import { mockCategories } from "../services/mockDb";
import type { Category } from "../types/models";

export function useCategories() {
  const categories = useMemo<Category[]>(() => mockCategories, []);
  return { categories };
}
