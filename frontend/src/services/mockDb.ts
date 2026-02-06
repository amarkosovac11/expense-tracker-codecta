import type {
  User,
  Category,
  Transaction,
  SavingGoal,
  SavingTransaction,
} from "../types/models";

export const mockUsers: User[] = [
  { id: 1, name: "Amar", email: "amar@test.com", passwordHash: "1234" },
  { id: 2, name: "Faris", email: "faris@test.com", passwordHash: "1234" },
];

export const mockCategories: Category[] = [
  { id: 1, name: "Salary" },
  { id: 2, name: "Food" },
  { id: 3, name: "Transport" },
  { id: 4, name: "Rent" },
  { id: 5, name: "Gym" },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    amount: 1500,
    date: "2026-02-01",
    description: "January salary",
    transactionType: "income",
  },
  {
    id: 2,
    userId: 1,
    categoryId: 2,
    amount: 180,
    date: "2026-02-02",
    description: "Lunch",
    transactionType: "expense",
  },
  {
    id: 3,
    userId: 1,
    categoryId: 3,
    amount: 6,
    date: "2026-02-02",
    description: "Bus ticket",
    transactionType: "expense",
  },
];

export const mockSavingGoals: SavingGoal[] = [
  {
    id: 1,
    userId: 1,
    title: "New Laptop",
    targetAmount: 2000,
    currentAmount: 350,
    deadline: "2026-06-01",
  },
];

export const mockSavingTransactions: SavingTransaction[] = [
  { id: 1, savingGoalId: 1, amount: 150, date: "2026-02-01" },
  { id: 2, savingGoalId: 1, amount: 200, date: "2026-02-03" },
];
