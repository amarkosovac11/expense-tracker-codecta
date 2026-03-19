import api from "../api/axios";
import type { Transaction } from "../types/models";

/**
 * Payload koji backend očekuje (CreateTransactionDto)
 */
export type CreateTransactionPayload = {
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  transactionType: "income" | "expense";
};

/**
 * GET all transactions
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await api.get("/api/Transaction");
  return Array.isArray(res.data) ? res.data : [];
};

/**
 * CREATE transaction
 */
export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  console.log("API SEND:", payload);

  const res = await api.post("/api/Transaction", payload);
  return res.data;
};

/**
 * UPDATE transaction
 */
export const updateTransaction = async (
  id: number,
  payload: Partial<CreateTransactionPayload>
): Promise<void> => {
  await api.put(`/api/Transaction/${id}`, payload);
};

/**
 * DELETE transaction
 */
export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/api/Transaction/${id}`);
};