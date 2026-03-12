import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

type TransactionType = "income" | "expense";

type Transaction = {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  transactionType: TransactionType;
};

type Category = {
  id: number;
  name: string;
  color?: string;
};

type ReportsPageProps = {
  transactions: Transaction[];
  categories: Category[];
};

function getCurrentMonthValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BA", {
    style: "currency",
    currency: "BAM",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function getMonthDateRange(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return { start, end };
}

function getPreviousMonthValue(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 2, 1);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function isSameMonth(dateString: string, monthValue: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}` === monthValue;
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

export default function ReportsPage({
  transactions,
  categories,
}: ReportsPageProps) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const previousMonth = useMemo(
    () => getPreviousMonthValue(selectedMonth),
    [selectedMonth]
  );

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => isSameMonth(t.date, selectedMonth));
  }, [transactions, selectedMonth]);

  const previousMonthTransactions = useMemo(() => {
    return transactions.filter((t) => isSameMonth(t.date, previousMonth));
  }, [transactions, previousMonth]);

  const currentIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const currentExpenses = useMemo(() => {
    return monthTransactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const previousIncome = useMemo(() => {
    return previousMonthTransactions
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [previousMonthTransactions]);

  const previousExpenses = useMemo(() => {
    return previousMonthTransactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [previousMonthTransactions]);

  const netBalance = currentIncome - currentExpenses;

  const incomeChange = calculatePercentageChange(currentIncome, previousIncome);
  const expensesChange = calculatePercentageChange(
    currentExpenses,
    previousExpenses
  );

  const expenseTransactions = useMemo(() => {
    return monthTransactions.filter((t) => t.transactionType === "expense");
  }, [monthTransactions]);

  const incomeTransactions = useMemo(() => {
    return monthTransactions.filter((t) => t.transactionType === "income");
  }, [monthTransactions]);

  const biggestExpense = useMemo(() => {
    if (expenseTransactions.length === 0) return null;

    return expenseTransactions.reduce((max, current) =>
      current.amount > max.amount ? current : max
    );
  }, [expenseTransactions]);

  const topSpendingCategories = useMemo(() => {
    const expenseByCategory = new Map<number, number>();

    for (const transaction of expenseTransactions) {
      const currentAmount = expenseByCategory.get(transaction.categoryId) ?? 0;
      expenseByCategory.set(
        transaction.categoryId,
        currentAmount + transaction.amount
      );
    }

    return Array.from(expenseByCategory.entries())
      .map(([categoryId, total]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          name: category?.name ?? "Unknown",
          color: category?.color,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [expenseTransactions, categories]);

  const chartData = topSpendingCategories.slice(0, 6).map((item) => ({
    name: item.name,
    total: item.total,
    fill: item.color || "hsl(var(--primary))",
  }));

  const averageDailySpending = useMemo(() => {
    const { start, end } = getMonthDateRange(selectedMonth);
    const today = new Date();

    const isCurrentMonth =
      today.getFullYear() === start.getFullYear() &&
      today.getMonth() === start.getMonth();

    const daysSoFar = isCurrentMonth ? today.getDate() : end.getDate();

    if (daysSoFar === 0) return 0;
    return currentExpenses / daysSoFar;
  }, [selectedMonth, currentExpenses]);

  const biggestExpenseCategory = biggestExpense
    ? categories.find((c) => c.id === biggestExpense.categoryId)
    : null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Monthly financial overview and spending insights.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <label
            htmlFor="month"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Select month
          </label>
          <input
            id="month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary md:w-[220px]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">
              {formatCurrency(currentIncome)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                incomeChange >= 0
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-red-200 bg-red-100 text-red-700"
              }
            >
              {formatPercentage(incomeChange)} vs previous month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {formatCurrency(currentExpenses)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                expensesChange <= 0
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-red-200 bg-red-100 text-red-700"
              }
            >
              {formatPercentage(expensesChange)} vs previous month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Balance</CardDescription>
            <CardTitle
              className={`text-2xl ${
                netBalance >= 0 ? "text-primary" : "text-red-500"
              }`}
            >
              {formatCurrency(netBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Income minus expenses for selected month.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Daily Spending</CardDescription>
            <CardTitle className="text-2xl text-orange-500">
              {formatCurrency(averageDailySpending)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on total expenses in this month.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>
              Highest expense categories for the selected month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No expense data for this month.
              </div>
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biggest Expense</CardTitle>
            <CardDescription>
              Largest single expense transaction this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {biggestExpense ? (
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {formatCurrency(biggestExpense.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {biggestExpense.description || "No description"}
                  </p>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Category:</span>{" "}
                    {biggestExpenseCategory?.name ?? "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Date:</span>{" "}
                    {new Date(biggestExpense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No expense transactions for this month.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Transaction breakdown for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {monthTransactions.length}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Expense Transactions</p>
                <p className="mt-1 text-2xl font-bold text-red-500">
                  {expenseTransactions.length}
                </p>
              </div>

              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Income Transactions</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {incomeTransactions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Ranking</CardTitle>
            <CardDescription>Top categories by expense amount</CardDescription>
          </CardHeader>
          <CardContent>
            {topSpendingCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No category spending data for this month.
              </p>
            ) : (
              <div className="space-y-3">
                {topSpendingCategories.slice(0, 5).map((category, index) => (
                  <div
                    key={category.categoryId}
                    className="flex items-center justify-between rounded-xl border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor:
                            category.color || "hsl(var(--primary))",
                        }}
                      />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Top expense category
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-semibold text-foreground">
                      {formatCurrency(category.total)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}