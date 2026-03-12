import type { User, Category, Transaction } from "../types/models";

/* USERS */

export const mockUsers: User[] = [
  { id: 1, name: "Amar", email: "amar@test.com", passwordHash: "1234" },
  { id: 2, name: "Faris", email: "faris@test.com", passwordHash: "1234" },
];

/* CATEGORIES */

export const mockCategories: Category[] = [
  { id: 1, name: "Salary", color: "#22c55e" },
  { id: 2, name: "Food", color: "#ef4444" },
  { id: 3, name: "Transport", color: "#3b82f6" },
  { id: 4, name: "Rent", color: "#a855f7" },
  { id: 5, name: "Gym", color: "#f59e0b" },
];

/* TRANSACTIONS */

export const mockTransactions: Transaction[] = [
  // SALARIES
  {
    id: 1,
    userId: 1,
    categoryId: 1,
    amount: 1600,
    date: "2026-01-01",
    description: "Salary January",
    transactionType: "income",
  },
  {
    id: 2,
    userId: 1,
    categoryId: 1,
    amount: 1600,
    date: "2026-02-01",
    description: "Salary February",
    transactionType: "income",
  },
  {
    id: 3,
    userId: 1,
    categoryId: 1,
    amount: 1650,
    date: "2026-03-01",
    description: "Salary March",
    transactionType: "income",
  },

  // RENT
  {
    id: 4,
    userId: 1,
    categoryId: 4,
    amount: 600,
    date: "2026-01-05",
    description: "Apartment rent",
    transactionType: "expense",
  },
  {
    id: 5,
    userId: 1,
    categoryId: 4,
    amount: 600,
    date: "2026-02-05",
    description: "Apartment rent",
    transactionType: "expense",
  },
  {
    id: 6,
    userId: 1,
    categoryId: 4,
    amount: 600,
    date: "2026-03-05",
    description: "Apartment rent",
    transactionType: "expense",
  },

  // FOOD
  {
    id: 7,
    userId: 1,
    categoryId: 2,
    amount: 18,
    date: "2026-03-02",
    description: "Lunch",
    transactionType: "expense",
  },
  {
    id: 8,
    userId: 1,
    categoryId: 2,
    amount: 24,
    date: "2026-03-03",
    description: "Dinner",
    transactionType: "expense",
  },
  {
    id: 9,
    userId: 1,
    categoryId: 2,
    amount: 12,
    date: "2026-03-03",
    description: "Coffee",
    transactionType: "expense",
  },
  {
    id: 10,
    userId: 1,
    categoryId: 2,
    amount: 45,
    date: "2026-03-04",
    description: "Groceries",
    transactionType: "expense",
  },
  {
    id: 11,
    userId: 1,
    categoryId: 2,
    amount: 16,
    date: "2026-03-06",
    description: "Lunch",
    transactionType: "expense",
  },

  // TRANSPORT
  {
    id: 12,
    userId: 1,
    categoryId: 3,
    amount: 6,
    date: "2026-03-02",
    description: "Bus ticket",
    transactionType: "expense",
  },
  {
    id: 13,
    userId: 1,
    categoryId: 3,
    amount: 12,
    date: "2026-03-04",
    description: "Taxi",
    transactionType: "expense",
  },
  {
    id: 14,
    userId: 1,
    categoryId: 3,
    amount: 6,
    date: "2026-03-07",
    description: "Bus",
    transactionType: "expense",
  },

  // GYM
  {
    id: 15,
    userId: 1,
    categoryId: 5,
    amount: 40,
    date: "2026-01-10",
    description: "Gym membership",
    transactionType: "expense",
  },
  {
    id: 16,
    userId: 1,
    categoryId: 5,
    amount: 40,
    date: "2026-02-10",
    description: "Gym membership",
    transactionType: "expense",
  },
  {
    id: 17,
    userId: 1,
    categoryId: 5,
    amount: 40,
    date: "2026-03-10",
    description: "Gym membership",
    transactionType: "expense",
  },

  // EXTRA
  {
    id: 18,
    userId: 1,
    categoryId: 2,
    amount: 22,
    date: "2026-03-11",
    description: "Pizza",
    transactionType: "expense",
  },
  {
    id: 19,
    userId: 1,
    categoryId: 3,
    amount: 8,
    date: "2026-03-12",
    description: "Bus",
    transactionType: "expense",
  },
  {
    id: 20,
    userId: 1,
    categoryId: 2,
    amount: 35,
    date: "2026-03-12",
    description: "Groceries",
    transactionType: "expense",
  },
];