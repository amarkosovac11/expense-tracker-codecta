export type TransactionType = "income" | "expense";

export type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Transaction = {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  transactionType: TransactionType;
};

export type SavingGoal = {
  id: number;
  userId: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; 
};

export type SavingTransaction = {
  id: number;
  savingGoalId: number;
  amount: number;
  date: string;
};
