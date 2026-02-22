import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavingGoal } from "../types/models";

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddToGoalDialog({
  goal,
  onAdd,
}: {
  goal: SavingGoal;
  onAdd: (input: { savingGoalId: number; amount: number; date: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso());
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setErr("Enter a valid amount greater than 0.");
      return;
    }
    if (!date) {
      setErr("Please pick a date.");
      return;
    }

    onAdd({ savingGoalId: goal.id, amount: amt, date });

    setAmount("");
    setDate(todayIso());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add money
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add money to “{goal.title}”</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`amount-${goal.id}`}>Amount</Label>
            <Input
              id={`amount-${goal.id}`}
              type="number"
              inputMode="decimal"
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`date-${goal.id}`}>Date</Label>
            <Input
              id={`date-${goal.id}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}