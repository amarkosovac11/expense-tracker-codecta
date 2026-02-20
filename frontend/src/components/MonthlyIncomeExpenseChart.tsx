import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Transaction } from "../types/models";

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}

function niceMonthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}

export default function MonthlyIncomeExpenseChart({
  transactions,
  months = 6,
}: {
  transactions: Transaction[];
  months?: number;
}) {
  const data = useMemo(() => {
    const map = new Map<string, { month: string; income: number; expense: number }>();

    for (const t of transactions) {
      const key = monthKey(t.date);
      const existing = map.get(key) ?? { month: key, income: 0, expense: 0 };

      if (t.transactionType === "income") existing.income += t.amount;
      else existing.expense += t.amount;

      map.set(key, existing);
    }

    const sorted = Array.from(map.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const sliced = sorted.slice(Math.max(0, sorted.length - months));

    return sliced.map((x) => ({
      ...x,
      label: niceMonthLabel(x.month),
    }));
  }, [transactions, months]);

  if (data.length === 0) return <p className="text-sm text-muted-foreground">No data yet.</p>;

  return (
    <ChartContainer
      className="h-[320px] w-full"
      config={{
        income: { label: "Income", color: "hsl(142 71% 45%)" },
        expense: { label: "Expense", color: "hsl(0 84% 60%)" },
      }}
    >
      <BarChart data={data} barCategoryGap={18}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={42} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <Bar dataKey="income" fill="var(--color-income)" radius={6} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}