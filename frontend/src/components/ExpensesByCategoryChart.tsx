import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Category, Transaction } from "../types/models";
import { categoryName } from "@/lib/categories";

const FALLBACK_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
  "#0891b2",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#64748b",
];

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

  const data = Array.from(totals.entries()).map(([categoryId, value], index) => {
    const category = categories.find((c) => c.id === categoryId);

    return {
      name: categoryName(categories, categoryId),
      value,
      fill: category?.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    };
  });

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
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.fill}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}