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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_COLORS = [
  { value: "#2563eb", label: "Blue" },
  { value: "#16a34a", label: "Green" },
  { value: "#dc2626", label: "Red" },
  { value: "#ca8a04", label: "Yellow" },
  { value: "#9333ea", label: "Purple" },
  { value: "#0891b2", label: "Cyan" },
  { value: "#f97316", label: "Orange" },
  { value: "#ec4899", label: "Pink" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#64748b", label: "Slate" },
];

export default function AddCategoryDialog({
  onAdd,
}: {
  onAdd: (name: string, color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(CATEGORY_COLORS[0].value);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setColor(CATEGORY_COLORS[0].value);
    setError(null);
  };

  const submit = () => {
    setError(null);
    const trimmed = name.trim();

    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    onAdd(trimmed, color);
    setOpen(false);
    reset();
  };

  const selectedColor =
    CATEGORY_COLORS.find((c) => c.value === color) ?? CATEGORY_COLORS[0];

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

          <div className="space-y-2">
            <Label>Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select category color" />
              </SelectTrigger>

              <SelectContent>
                {CATEGORY_COLORS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 rounded-full border"
                        style={{ backgroundColor: item.value }}
                      />
                      <span>{item.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-muted-foreground">Preview:</span>
              <span
                className="inline-block h-5 w-5 rounded-full border"
                style={{ backgroundColor: selectedColor.value }}
              />
              <span className="text-sm">{selectedColor.label}</span>
            </div> */}
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