import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function IncomeExpenseChart({
  income,
  expense,
}: {
  income: number;
  expense: number;
}) {
  const data = [{ label: "Total", income, expense }];

  return (
    <ChartContainer
      className="h-[260px] w-full"
      config={{
        income: { label: "Income", color: "hsl(142 71% 45%)" },
        expense: { label: "Expense", color: "hsl(0 84% 60%)" },
      }}
    >
      <BarChart data={data} barCategoryGap={24}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <Bar dataKey="income" fill="var(--color-income)" radius={8} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}