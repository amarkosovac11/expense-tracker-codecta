import { useEffect, useMemo, useState } from "react";
import type { SavingGoal, SavingTransaction } from "../types/models";
import { createSavingGoal, getSavingGoals } from "../lib/savingGoals";
import api from "../api/axios"
export function useSavings(userId: number) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [savingTxs, setSavingTxs] = useState<SavingTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const goalsRes = await getSavingGoals();
      setGoals(goalsRes);

      const allTxs: SavingTransaction[] = [];

      for (const g of goalsRes) {
        const res = await api.get<SavingTransaction[]>(
          `/api/SavingTransactions/goal/${g.id}`
        );
        allTxs.push(...res.data);
      }

      setSavingTxs(allTxs);
    } catch (error) {
      console.error("Failed to fetch savings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const userGoals = useMemo(() => {
    return goals.filter((g) => g.userId === userId);
  }, [goals, userId]);

  const getGoalTransactions = (savingGoalId: number) =>
    savingTxs
      .filter((t) => t.savingGoalId === savingGoalId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

  const addGoal = async (
    goal: Omit<SavingGoal, "id" | "currentAmount">
  ) => {
    const createdGoal = await createSavingGoal({
      title: goal.title,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline ?? undefined,
      userId,
    });

    await fetchAll();
    return createdGoal;
  };

  const addToGoal = async (input: {
    savingGoalId: number;
    amount: number;
    date?: string;
  }) => {
    const amt = Number(input.amount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    await api.post("/api/SavingTransactions", {
      savingGoalId: input.savingGoalId,
      amount: amt,
      date: input.date,
    });

    await fetchAll();
  };

  const deleteSavingTransaction = async (txId: number) => {
    await api.delete(`/api/SavingTransactions/${txId}`);
    await fetchAll();
  };

  return {
    goals: userGoals,
    loading,
    getGoalTransactions,
    addGoal,
    addToGoal,
    deleteSavingTransaction,
  };
}