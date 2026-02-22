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

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CreateSavingGoalDialog({
  userId,
  onCreate,
}: {
  userId: number;
  onCreate: (goal: { userId: number; title: string; targetAmount: number; deadline: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState(todayIso());
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");

    const t = title.trim();
    if (!t) {
      setErr("Title is required.");
      return;
    }

    const target = Number(targetAmount);
    if (!Number.isFinite(target) || target <= 0) {
      setErr("Target amount must be greater than 0.");
      return;
    }

    if (!deadline) {
      setErr("Deadline is required.");
      return;
    }

    onCreate({ userId, title: t, targetAmount: target, deadline });

    setTitle("");
    setTargetAmount("");
    setDeadline(todayIso());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ New Goal</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create savings goal</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input
              id="goal-title"
              placeholder="e.g. New Laptop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-target">Target Amount</Label>
            <Input
              id="goal-target"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 2500"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-deadline">Deadline</Label>
            <Input
              id="goal-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}