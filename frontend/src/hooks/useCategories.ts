import { useEffect, useMemo, useState } from "react";
import type { Category } from "../types/models";
import { createCategory, getCategories } from "../lib/categories";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    try {
      const created = await createCategory(trimmed);
      setCategories((prev) => [...prev, created]);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  return {
    categories: sortedCategories,
    loading,
    addCategory,
  };
}