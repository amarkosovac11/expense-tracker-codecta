import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Category, TransactionType } from "../types/models";

export type TxSort =
  | "date_desc"
  | "date_asc"
  | "amount_desc"
  | "amount_asc";

export type TxFilters = {
  q: string;
  type: "all" | TransactionType;
  categoryId: "all" | number;
  from: string;
  to: string;
  sort: TxSort;
};

export const defaultTxFilters: TxFilters = {
  q: "",
  type: "all",
  categoryId: "all",
  from: "",
  to: "",
  sort: "date_desc",
};

export default function TransactionsFilters({
  categories,
  value,
  onChange,
  onClear,
}: {
  categories: Category[];
  value: TxFilters;
  onChange: (next: TxFilters) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-4">
          <Input
            placeholder="Search description..."
            value={value.q}
            onChange={(e) => onChange({ ...value, q: e.target.value })}
          />
        </div>
{}
        {/* Type */}
        <div className="md:col-span-2">
          <Select
            value={value.type}
            onValueChange={(v) =>
              onChange({ ...value, type: v as TxFilters["type"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kategorija */}
        <div className="md:col-span-3">
          <Select
            value={String(value.categoryId)}
            onValueChange={(v) =>
              onChange({
                ...value,
                categoryId: v === "all" ? "all" : Number(v),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From / To */}
        <div className="md:col-span-3 grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
            title="From"
          />
          <Input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
            title="To"
          />
        </div>

        {/* Sort i Clear */}
        <div className="md:col-span-12 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="w-full sm:w-[220px]">
            <Select
              value={value.sort}
              onValueChange={(v) =>
                onChange({ ...value, sort: v as TxSort })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (newest)</SelectItem>
                <SelectItem value="date_asc">Date (oldest)</SelectItem>
                <SelectItem value="amount_desc">Amount (high → low)</SelectItem>
                <SelectItem value="amount_asc">Amount (low → high)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}