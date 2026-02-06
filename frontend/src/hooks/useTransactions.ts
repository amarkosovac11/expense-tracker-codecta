import { useMemo, useState } from "react";
import { mockTransactions } from "../services/mockDb";
import type { Transaction } from "../types/models";

export function useTransactions(userId: number) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const userTransactions = useMemo(
    () => transactions.filter((t) => t.userId === userId),
    [transactions, userId]
  );

  const totalIncome = useMemo(
    () =>
      userTransactions
        .filter((t) => t.transactionType === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [userTransactions]
  );

  const totalExpense = useMemo(
    () =>
      userTransactions
        .filter((t) => t.transactionType === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [userTransactions]
  );

  const balance = totalIncome - totalExpense;

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    setTransactions((prev) => [...prev, { ...tx, id: Date.now() }]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    transactions: userTransactions,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction,
  };
}
