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

export default function AddCategoryDialog({
  onAdd,
}: {
  onAdd: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setError(null);
  };

  const submit = () => {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    onAdd(trimmed);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (setOpen(v), !v && reset())}>
      <DialogTrigger asChild>
        <Button>Add category</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Food, Rent, Salary..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}