import { useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  type CreateTransactionPayload,
} from "../lib/transactions";
import type { Transaction } from "../types/models";

export function useTransactions(_userId: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === "income")
        .reduce((sum, t) => sum + Number(t.amount ?? 0), 0),
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.transactionType === "expense")
        .reduce((sum, t) => sum + Number(t.amount ?? 0), 0),
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const addTransaction = async (payload: CreateTransactionPayload) => {
    await createTransaction(payload);
    await fetchTransactions();
  };

  const updateTransaction = async (
    id: number,
    payload: Partial<CreateTransactionPayload>
  ) => {
    await updateTransactionRequest(id, payload);
    await fetchTransactions();
  };

  const deleteTransaction = async (id: number) => {
    await deleteTransactionRequest(id);
    await fetchTransactions();
  };

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}