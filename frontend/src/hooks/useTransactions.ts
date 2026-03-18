import { useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  createTransaction,
  type CreateTransactionPayload,
} from "../lib/transactions";
import type { Transaction } from "../types/models";

export function useTransactions(userId: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const userTransactions = useMemo(() => transactions, [transactions]);

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

  const addTransaction = async (payload: CreateTransactionPayload) => {
    const created = await createTransaction(payload);
    setTransactions((prev) => [...prev, created]);
  };

  return {
    transactions: userTransactions,
    totalIncome,
    totalExpense,
    balance,
    loading,
    addTransaction,
  };
}