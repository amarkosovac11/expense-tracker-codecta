import api from "../api/axios";
import type { SavingGoal } from "../types/models";

export async function getSavingGoals(): Promise<SavingGoal[]> {
  const response = await api.get<SavingGoal[]>("/api/SavingGoals");
  return response.data;
}

export async function createSavingGoal(data: {
  title: string;
  targetAmount: number;
  deadline?: string;
  userId: number;
}): Promise<SavingGoal> {
  const response = await api.post<SavingGoal>("/api/SavingGoals", data);
  return response.data;
}