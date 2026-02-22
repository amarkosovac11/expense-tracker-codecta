import type { SavingGoal, SavingTransaction } from "../types/models";

export const mockSavingGoals: SavingGoal[] = [
  {
    id: 1,
    userId: 1,
    title: "New Laptop",
    targetAmount: 2500,
    currentAmount: 400,
    deadline: "2026-05-01",
  },
  {
    id: 2,
    userId: 1,
    title: "Summer Trip",
    targetAmount: 1200,
    currentAmount: 900,
    deadline: "2026-07-15",
  },
];

export const mockSavingTransactions: SavingTransaction[] = [
  { id: 11, savingGoalId: 1, amount: 200, date: "2026-02-01" },
  { id: 12, savingGoalId: 1, amount: 200, date: "2026-02-10" },
  { id: 21, savingGoalId: 2, amount: 500, date: "2026-01-20" },
  { id: 22, savingGoalId: 2, amount: 400, date: "2026-02-05" },
];