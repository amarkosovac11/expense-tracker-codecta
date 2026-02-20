import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "../types/models";

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}

function niceMonthLabel(key: string) {
  // 2026-02 -> Feb 2026
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

    // sorting months ascending
    const sorted = Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));

    // keep last N months
    const sliced = sorted.slice(Math.max(0, sorted.length - months));

    return sliced.map((x) => ({
      ...x,
      label: niceMonthLabel(x.month),
    }));
  }, [transactions, months]);

  if (data.length === 0) return <p className="text-sm text-muted-foreground">No data yet.</p>;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" />
          <Bar dataKey="expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
