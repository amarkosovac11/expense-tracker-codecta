import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Category, Transaction } from "../types/models";
import { categoryName } from "@/lib/categories";

export default function ExpensesByCategoryChart({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const expenseOnly = transactions.filter((t) => t.transactionType === "expense");

  const totals = new Map<number, number>();
  for (const t of expenseOnly) {
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount);
  }

  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
  ];

  const data = Array.from(totals.entries()).map(([categoryId, value]) => ({
    name: categoryName(categories, categoryId),
    value,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No expenses yet.</p>;
  }

  return (
    <ChartContainer
      className="h-[260px] w-full"
      config={{
        value: { label: "Amount" },
      }}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
        >
          {data.map((_, index) => (
            <Cell
              key={'cell-${index}'}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
