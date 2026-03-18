import { useEffect, useMemo, useState } from "react";
import type { SavingGoal, SavingTransaction } from "../types/models";
import { mockSavingTransactions } from "../services/mockSavings";
import { createSavingGoal, getSavingGoals } from "../lib/savingGoals";

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useSavings(userId: number) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [savingTxs, setSavingTxs] = useState<SavingTransaction[]>(mockSavingTransactions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingGoals = async () => {
      try {
        const data = await getSavingGoals();
        setGoals(data);
      } catch (error) {
        console.error("Failed to fetch saving goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingGoals();
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
    try {
      const createdGoal = await createSavingGoal({
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline ?? undefined,
        userId,
      });

      setGoals((prev) => [createdGoal, ...prev]);
      return createdGoal;
    } catch (error) {
      console.error("Failed to create saving goal:", error);
      throw error;
    }
  };

  const addToGoal = (input: { savingGoalId: number; amount: number; date?: string }) => {
    const amt = Number(input.amount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    const newTx: SavingTransaction = {
      id: Date.now(),
      savingGoalId: input.savingGoalId,
      amount: amt,
      date: input.date ?? todayIso(),
    };

    setSavingTxs((prev) => [newTx, ...prev]);

    setGoals((prev) =>
      prev.map((g) =>
        g.id === input.savingGoalId
          ? { ...g, currentAmount: g.currentAmount + amt }
          : g
      )
    );
  };

  const deleteSavingTransaction = (txId: number) => {
    const tx = savingTxs.find((t) => t.id === txId);
    if (!tx) return;

    setSavingTxs((prev) => prev.filter((t) => t.id !== txId));

    setGoals((prev) =>
      prev.map((g) =>
        g.id === tx.savingGoalId
          ? { ...g, currentAmount: Math.max(0, g.currentAmount - tx.amount) }
          : g
      )
    );
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