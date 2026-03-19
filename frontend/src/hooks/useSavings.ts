import { useEffect, useMemo, useState } from "react";
import type { SavingGoal, SavingTransaction } from "../types/models";
import { createSavingGoal, getSavingGoals } from "../lib/savingGoals";
import api from "../api/axios";

export function useSavings(userId: number) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [savingTxs, setSavingTxs] = useState<SavingTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const goalsRes = await getSavingGoals();
      const safeGoals = Array.isArray(goalsRes) ? goalsRes : [];

      setGoals(safeGoals);

      const allTxs: SavingTransaction[] = [];

      for (const g of safeGoals) {
        if (g?.id == null) continue;

        const res = await api.get<SavingTransaction[]>(
          `/api/SavingTransactions/goal/${g.id}`
        );

        const txs = Array.isArray(res.data) ? res.data : [];
        allTxs.push(...txs);
      }

      setSavingTxs(allTxs);
    } catch (error) {
      console.error("Failed to fetch savings:", error);
      setGoals([]);
      setSavingTxs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const userGoals = useMemo(() => {
    const safeGoals = Array.isArray(goals) ? goals : [];
    return safeGoals.filter((g) => g?.userId === userId);
  }, [goals, userId]);

  const getGoalTransactions = (savingGoalId: number) =>
    savingTxs
      .filter((t) => t?.savingGoalId === savingGoalId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

  const addGoal = async (goal: {
    userId: number;
    title: string;
    targetAmount: number;
    deadline: string;
  }): Promise<void> => {
    await createSavingGoal({
      title: goal.title,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline || undefined,
      userId: goal.userId,
    });

    await fetchAll();
  };

  const addToGoal = async (input: {
    savingGoalId: number;
    amount: number;
    date: string;
  }): Promise<void> => {
    const amt = Number(input.amount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    if (input.savingGoalId == null) return;

    await api.post("/api/SavingTransactions", {
      savingGoalId: input.savingGoalId,
      amount: amt,
      date: input.date,
    });

    await fetchAll();
  };

  const deleteSavingTransaction = async (txId: number): Promise<void> => {
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