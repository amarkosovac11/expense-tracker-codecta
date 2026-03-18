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
  return res.data;
};

/**
 * CREATE transaction
 */
export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  console.log("API SEND:", payload); // 🔥 debug da vidiš šta stvarno ide

  const res = await api.post("/api/Transaction", payload);
  return res.data;
};