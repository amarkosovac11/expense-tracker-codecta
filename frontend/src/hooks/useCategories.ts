import { useMemo, useState } from "react";
import { mockCategories } from "../services/mockDb";
import type { Category } from "../types/models";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: trimmed },
    ]);
  };

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return {
    categories: sortedCategories,
    addCategory,
  };
}