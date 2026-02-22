import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SavingGoal, SavingTransaction } from "../types/models";

function daysUntil(deadlineIso: string) {
  const [y, m, d] = deadlineIso.split("-").map(Number);
  const deadline = new Date(y, m - 1, d);
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffMs = deadline.getTime() - todayMid.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function fmt(n: number) {
  return new Intl.NumberFormat().format(n);
}

export default function SavingGoalDetailsDialog({
  goal,
  transactions,
  onDeleteTx,
}: {
  goal: SavingGoal;
  transactions: SavingTransaction[];
  onDeleteTx: (txId: number) => void;
}) {
  const saved = goal.currentAmount;
  const target = goal.targetAmount;
  const pct = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;
  const completed = saved >= target;

  const daysLeft = goal.deadline ? daysUntil(goal.deadline) : null;
  const countdownText =
    daysLeft == null
      ? null
      : daysLeft > 0
      ? `${daysLeft} days left`
      : daysLeft === 0
      ? "Due today"
      : `Overdue by ${Math.abs(daysLeft)} days`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>{goal.title}</span>
            {completed ? <Badge>Completed</Badge> : null}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Saved {fmt(saved)} / {fmt(target)}
              </span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>

            <Progress value={pct} />

            {countdownText ? (
              <div className="text-xs">
                <span
                  className={
                    daysLeft != null && daysLeft < 0
                      ? "text-destructive font-medium"
                      : daysLeft != null && daysLeft <= 7
                      ? "font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {countdownText}
                </span>
                <span className="text-muted-foreground"> • Deadline {goal.deadline}</span>
              </div>
            ) : null}
          </Card>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Contributions</h4>
              <span className="text-xs text-muted-foreground">
                {transactions.length} total
              </span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contributions yet.</p>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-auto pr-1">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 border rounded-md p-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">+ {fmt(t.amount)}</div>
                      <div className="text-xs text-muted-foreground">{t.date}</div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteTx(t.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}