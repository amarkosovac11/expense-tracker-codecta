import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { SavingGoal, SavingTransaction } from "../types/models";

import AddToGoalDialog from "./AddToGoalDialog";
import CreateSavingGoalDialog from "./CreateSavingGoalDialog";
import SavingGoalDetailsDialog from "./SavingGoalDetailsDialog";

function daysUntil(deadlineIso: string) {
  const [y, m, d] = deadlineIso.split("-").map(Number);
  const deadline = new Date(y, m - 1, d);

  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffMs = deadline.getTime() - todayMid.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function countdownMeta(deadlineIso: string) {
  const d = daysUntil(deadlineIso);

  if (d < 0) return { text: `Overdue by ${Math.abs(d)} days`, cls: "text-destructive font-medium" };
  if (d === 0) return { text: "Due today", cls: "text-destructive font-medium" };
  if (d <= 7) return { text: `${d} days left`, cls: "text-amber-600 font-medium" };
  if (d <= 30) return { text: `${d} days left`, cls: "font-medium" };
  return { text: `${d} days left`, cls: "text-muted-foreground" };
}

function formatKM(amount: number) {
  return new Intl.NumberFormat().format(amount);
}

function GoalCard({
  goal,
  onAddToGoal,
  getGoalTransactions,
  onDeleteTx,
}: {
  goal: SavingGoal;
  onAddToGoal: (input: { savingGoalId: number; amount: number; date: string }) => void;
  getGoalTransactions: (savingGoalId: number) => SavingTransaction[];
  onDeleteTx: (txId: number) => void;
}) {
  const saved = goal.currentAmount;
  const target = goal.targetAmount;

  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  const completed = saved >= target;
  const left = Math.max(0, target - saved);

  const meta = goal.deadline ? countdownMeta(goal.deadline) : null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-base font-semibold leading-none truncate">{goal.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Saved {formatKM(saved)} / {formatKM(target)}
            </p>
          </div>
          {completed ? <Badge>Completed</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Progress value={pct} />

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{pct}%</span>
          {!completed ? (
            <span className="text-muted-foreground">Remaining: {formatKM(left)}</span>
          ) : (
            <span className="text-muted-foreground">Goal reached 🎉</span>
          )}
        </div>

        {meta ? (
          <div className="text-xs">
            <span className={meta.cls}>{meta.text}</span>
            <span className="text-muted-foreground"> • Deadline {goal.deadline}</span>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <SavingGoalDetailsDialog
            goal={goal}
            transactions={getGoalTransactions(goal.id)}
            onDeleteTx={onDeleteTx}
          />
          {!completed ? <AddToGoalDialog goal={goal} onAdd={onAddToGoal} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SavingsGoalsSection({
  userId,
  goals,
  onAddToGoal,
  onCreateGoal,
  getGoalTransactions,
  onDeleteTx,
}: {
  userId: number;
  goals: SavingGoal[];
  onAddToGoal: (input: { savingGoalId: number; amount: number; date: string }) => void;
  onCreateGoal: (goal: { userId: number; title: string; targetAmount: number; deadline: string }) => void;
  getGoalTransactions: (savingGoalId: number) => SavingTransaction[];
  onDeleteTx: (txId: number) => void;
}) {
  const activeGoals = goals
    .filter((g) => g.currentAmount < g.targetAmount)
    .slice()
    .sort((a, b) => {
      const ad = a.deadline ? daysUntil(a.deadline) : 999999;
      const bd = b.deadline ? daysUntil(b.deadline) : 999999;
      return ad - bd; // closer ones first
    }); 

  const completedGoals = goals
    .filter((g) => g.currentAmount >= g.targetAmount)
    .slice()
    .sort((a, b) => {
      return b.id - a.id;
    });

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Savings Goals</CardTitle>
        <CreateSavingGoalDialog userId={userId} onCreate={onCreateGoal} />
      </CardHeader>

      <CardContent>
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No savings goals yet. Create one to start tracking progress.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Active Goals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Active Goals</h3>
                <span className="text-xs text-muted-foreground">{activeGoals.length}</span>
              </div>

              {activeGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active goals.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeGoals.map((g) => (
                    <GoalCard
                      key={g.id}
                      goal={g}
                      onAddToGoal={onAddToGoal}
                      getGoalTransactions={getGoalTransactions}
                      onDeleteTx={onDeleteTx}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Goals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Completed Goals</h3>
                <span className="text-xs text-muted-foreground">{completedGoals.length}</span>
              </div>

              {completedGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No completed goals yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedGoals.map((g) => (
                    <GoalCard
                      key={g.id}
                      goal={g}
                      onAddToGoal={onAddToGoal}
                      getGoalTransactions={getGoalTransactions}
                      onDeleteTx={onDeleteTx}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}