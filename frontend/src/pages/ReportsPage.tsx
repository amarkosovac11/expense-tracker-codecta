import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

function extractMonthKey(dateString: string) {
  return dateString.slice(0, 7);
}

function isSameMonth(dateString: string, monthValue: string) {
  return extractMonthKey(dateString) === monthValue;
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

function getMonthLabel(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-BA", {
    month: "long",
    year: "numeric",
  });
}

type ReportData = {
  selectedMonth: string;
  currentIncome: number;
  currentExpenses: number;
  netBalance: number;
  incomeChange: number;
  expensesChange: number;
  averageDailySpending: number;
  monthTransactions: Transaction[];
  expenseTransactions: Transaction[];
  incomeTransactions: Transaction[];
  biggestExpense: Transaction | null;
  biggestExpenseCategory?: Category;
  topSpendingCategories: {
    categoryId: number;
    name: string;
    color?: string;
    total: number;
  }[];
  chartData: {
    name: string;
    total: number;
    fill: string;
  }[];
};

function ReportContent({
  data,
  compact = false,
}: {
  data: ReportData;
  compact?: boolean;
}) {
  const {
    selectedMonth,
    currentIncome,
    currentExpenses,
    netBalance,
    incomeChange,
    expensesChange,
    averageDailySpending,
    monthTransactions,
    expenseTransactions,
    incomeTransactions,
    biggestExpense,
    biggestExpenseCategory,
    topSpendingCategories,
    chartData,
  } = data;

  const compactCardClass = compact
    ? "border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950"
    : "";

  return (
    <div className={compact ? "pdf-sheet" : "space-y-6"}>
      {compact ? (
        <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Monthly Financial Report
          </h1>
          <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
            {getMonthLabel(selectedMonth)}
          </p>
        </div>
      ) : null}

      <div
        className={
          compact ? "grid grid-cols-4 gap-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        }
      >
        <Card className={compactCardClass}>
          <CardHeader className={compact ? "space-y-1 p-3 pb-1" : "pb-2"}>
            {compact ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Income
              </p>
            ) : (
              <CardDescription>Total Income</CardDescription>
            )}
            <CardTitle
              className={compact ? "text-lg text-emerald-600" : "text-2xl text-emerald-600"}
            >
              {formatCurrency(currentIncome)}
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "px-3 pb-3 pt-0" : ""}>
            {compact ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatPercentage(incomeChange)} vs previous month
              </p>
            ) : (
              <Badge
                className={
                  incomeChange >= 0
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-red-200 bg-red-100 text-red-700"
                }
              >
                {formatPercentage(incomeChange)} vs previous month
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className={compactCardClass}>
          <CardHeader className={compact ? "space-y-1 p-3 pb-1" : "pb-2"}>
            {compact ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Expenses
              </p>
            ) : (
              <CardDescription>Total Expenses</CardDescription>
            )}
            <CardTitle
              className={compact ? "text-lg text-red-500" : "text-2xl text-red-500"}
            >
              {formatCurrency(currentExpenses)}
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "px-3 pb-3 pt-0" : ""}>
            {compact ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatPercentage(expensesChange)} vs previous month
              </p>
            ) : (
              <Badge
                className={
                  expensesChange <= 0
                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                    : "border-red-200 bg-red-100 text-red-700"
                }
              >
                {formatPercentage(expensesChange)} vs previous month
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className={compactCardClass}>
          <CardHeader className={compact ? "space-y-1 p-3 pb-1" : "pb-2"}>
            {compact ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Net Balance
              </p>
            ) : (
              <CardDescription>Net Balance</CardDescription>
            )}
            <CardTitle
              className={
                compact
                  ? `text-lg ${netBalance >= 0 ? "text-slate-900 dark:text-slate-100" : "text-red-500"}`
                  : `text-2xl ${netBalance >= 0 ? "text-primary" : "text-red-500"}`
              }
            >
              {formatCurrency(netBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "px-3 pb-3 pt-0" : ""}>
            <p
              className={
                compact
                  ? "text-xs text-slate-500 dark:text-slate-400"
                  : "text-sm text-muted-foreground"
              }
            >
              Income minus expenses
            </p>
          </CardContent>
        </Card>

        <Card className={compactCardClass}>
          <CardHeader className={compact ? "space-y-1 p-3 pb-1" : "pb-2"}>
            {compact ? (
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Avg / Day
              </p>
            ) : (
              <CardDescription>Average Daily Spending</CardDescription>
            )}
            <CardTitle
              className={compact ? "text-lg text-orange-500" : "text-2xl text-orange-500"}
            >
              {formatCurrency(averageDailySpending)}
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "px-3 pb-3 pt-0" : ""}>
            <p
              className={
                compact
                  ? "text-xs text-slate-500 dark:text-slate-400"
                  : "text-sm text-muted-foreground"
              }
            >
              Based on total expenses in this month.
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        className={compact ? "grid grid-cols-3 gap-3" : "grid gap-6 xl:grid-cols-3"}
      >
        <Card
          className={
            compact
              ? `col-span-2 ${compactCardClass}`
              : "xl:col-span-2"
          }
        >
          <CardHeader className={compact ? "p-3 pb-1" : ""}>
            <CardTitle
              className={compact ? "text-base text-slate-900 dark:text-slate-100" : ""}
            >
              Top Spending Categories
            </CardTitle>
            {!compact ? (
              <CardDescription>
                Highest expense categories for the selected month
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={compact ? "p-3 pt-1" : ""}>
            {chartData.length === 0 ? (
              <div
                className={
                  compact
                    ? "flex h-[180px] items-center justify-center text-sm text-slate-500 dark:text-slate-400"
                    : "flex h-[300px] items-center justify-center text-sm text-muted-foreground"
                }
              >
                No expense data for this month.
              </div>
            ) : (
              <div className={compact ? "h-[180px] w-full" : "h-[320px] w-full"}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compact ? chartData.slice(0, 4) : chartData}>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke={compact ? "currentColor" : undefined}
                      className={compact ? "text-slate-200 dark:text-slate-800" : ""}
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={compact ? 11 : 12}
                      tick={compact ? { fill: "currentColor" } : undefined}
                      className={compact ? "text-slate-500 dark:text-slate-400" : ""}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={compact ? 11 : 12}
                      tick={compact ? { fill: "currentColor" } : undefined}
                      className={compact ? "text-slate-500 dark:text-slate-400" : ""}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={
                        compact
                          ? {
                              backgroundColor: "rgb(15 23 42)",
                              border: "1px solid rgb(51 65 85)",
                              color: "rgb(248 250 252)",
                            }
                          : undefined
                      }
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {(compact ? chartData.slice(0, 4) : chartData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={compactCardClass}>
          <CardHeader className={compact ? "p-3 pb-1" : ""}>
            <CardTitle
              className={compact ? "text-base text-slate-900 dark:text-slate-100" : ""}
            >
              Biggest Expense
            </CardTitle>
            {!compact ? (
              <CardDescription>
                Largest single expense transaction this month
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={compact ? "space-y-2 p-3 pt-1" : ""}>
            {biggestExpense ? (
              <div className={compact ? "space-y-2" : "space-y-3"}>
                <div>
                  <p
                    className={
                      compact ? "text-xl font-bold text-red-500" : "text-2xl font-bold text-red-500"
                    }
                  >
                    {formatCurrency(biggestExpense.amount)}
                  </p>
                  <p
                    className={
                      compact
                        ? "text-xs text-slate-500 dark:text-slate-400"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {biggestExpense.description || "No description"}
                  </p>
                </div>

                <div
                  className={
                    compact
                      ? "space-y-1 text-xs text-slate-600 dark:text-slate-400"
                      : "space-y-1 text-sm text-muted-foreground"
                  }
                >
                  <p>
                    <span
                      className={
                        compact
                          ? "font-semibold text-slate-900 dark:text-slate-100"
                          : "font-medium text-foreground"
                      }
                    >
                      Category:
                    </span>{" "}
                    {biggestExpenseCategory?.name ?? "Unknown"}
                  </p>
                  <p>
                    <span
                      className={
                        compact
                          ? "font-semibold text-slate-900 dark:text-slate-100"
                          : "font-medium text-foreground"
                      }
                    >
                      Date:
                    </span>{" "}
                    {new Date(biggestExpense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p
                className={
                  compact
                    ? "text-sm text-slate-500 dark:text-slate-400"
                    : "text-sm text-muted-foreground"
                }
              >
                No expense transactions for this month.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div
        className={compact ? "grid grid-cols-2 gap-3" : "grid gap-6 lg:grid-cols-2"}
      >
        <Card className={compactCardClass}>
          <CardHeader className={compact ? "p-3 pb-1" : ""}>
            <CardTitle
              className={compact ? "text-base text-slate-900 dark:text-slate-100" : ""}
            >
              Statistics
            </CardTitle>
            {!compact ? (
              <CardDescription>Transaction breakdown for this month</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={compact ? "p-3 pt-1" : ""}>
            <div className={compact ? "grid grid-cols-3 gap-2" : "grid gap-3 sm:grid-cols-3"}>
              <div
                className={
                  compact
                    ? "rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                    : "rounded-xl border p-4"
                }
              >
                <p
                  className={
                    compact
                      ? "text-[11px] text-slate-500 dark:text-slate-400"
                      : "text-sm text-muted-foreground"
                  }
                >
                  Total Transactions
                </p>
                <p
                  className={
                    compact
                      ? "mt-1 text-lg font-bold text-slate-900 dark:text-slate-100"
                      : "mt-1 text-2xl font-bold text-foreground"
                  }
                >
                  {monthTransactions.length}
                </p>
              </div>

              <div
                className={
                  compact
                    ? "rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                    : "rounded-xl border p-4"
                }
              >
                <p
                  className={
                    compact
                      ? "text-[11px] text-slate-500 dark:text-slate-400"
                      : "text-sm text-muted-foreground"
                  }
                >
                  Expense Transactions
                </p>
                <p
                  className={
                    compact ? "mt-1 text-lg font-bold text-red-500" : "mt-1 text-2xl font-bold text-red-500"
                  }
                >
                  {expenseTransactions.length}
                </p>
              </div>

              <div
                className={
                  compact
                    ? "rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                    : "rounded-xl border p-4"
                }
              >
                <p
                  className={
                    compact
                      ? "text-[11px] text-slate-500 dark:text-slate-400"
                      : "text-sm text-muted-foreground"
                  }
                >
                  Income Transactions
                </p>
                <p
                  className={
                    compact
                      ? "mt-1 text-lg font-bold text-emerald-600"
                      : "mt-1 text-2xl font-bold text-emerald-600"
                  }
                >
                  {incomeTransactions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={compactCardClass}>
          <CardHeader className={compact ? "p-3 pb-1" : ""}>
            <CardTitle
              className={compact ? "text-base text-slate-900 dark:text-slate-100" : ""}
            >
              Category Ranking
            </CardTitle>
            {!compact ? (
              <CardDescription>Top categories by expense amount</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className={compact ? "p-3 pt-1" : ""}>
            {topSpendingCategories.length === 0 ? (
              <p
                className={
                  compact
                    ? "text-sm text-slate-500 dark:text-slate-400"
                    : "text-sm text-muted-foreground"
                }
              >
                No category spending data for this month.
              </p>
            ) : (
              <div className={compact ? "space-y-2" : "space-y-3"}>
                {(compact ? topSpendingCategories.slice(0, 3) : topSpendingCategories.slice(0, 5)).map(
                  (category, index) => (
                    <div
                      key={category.categoryId}
                      className={
                        compact
                          ? "flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
                          : "flex items-center justify-between rounded-xl border p-3"
                      }
                    >
                      <div className={compact ? "flex items-center gap-2" : "flex items-center gap-3"}>
                        <div
                          className={compact ? "h-2.5 w-2.5 rounded-full" : "h-3 w-3 rounded-full"}
                          style={{
                            backgroundColor: category.color || "hsl(var(--primary))",
                          }}
                        />
                        {compact ? (
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {index + 1}. {category.name}
                          </span>
                        ) : (
                          <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Top expense category
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      <div
                        className={
                          compact
                            ? "text-sm font-semibold text-slate-900 dark:text-slate-100"
                            : "text-right font-semibold text-foreground"
                        }
                      >
                        {formatCurrency(category.total)}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ReportsPage({
  transactions,
  categories,
}: ReportsPageProps) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
  const expensesChange = calculatePercentageChange(currentExpenses, previousExpenses);

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
      expenseByCategory.set(transaction.categoryId, currentAmount + transaction.amount);
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

  const isDarkMode = document.documentElement.classList.contains("dark");

  const chartData = topSpendingCategories.slice(0, 6).map((item) => ({
    name: item.name.length > 12 ? `${item.name.slice(0, 12)}...` : item.name,
    total: item.total,
    fill: item.color || (isDarkMode ? "#94a3b8" : "#0f172a"),
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
    : undefined;

  const reportData: ReportData = {
    selectedMonth,
    currentIncome,
    currentExpenses,
    netBalance,
    incomeChange,
    expensesChange,
    averageDailySpending,
    monthTransactions,
    expenseTransactions,
    incomeTransactions,
    biggestExpense,
    biggestExpenseCategory,
    topSpendingCategories,
    chartData,
  };

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? "#020817" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = 297;
      const pdfHeight = 210;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`financial-report-${selectedMonth}.pdf`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Reports
            </h1>
            <p className="text-sm text-muted-foreground">
              Monthly financial overview and spending insights.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-end">
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

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </div>

        <ReportContent data={reportData} />
      </div>

      <div className="pointer-events-none fixed left-[-99999px] top-0 z-[-1]">
        <div
          ref={pdfRef}
          className="pdf-export-wrapper bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
        >
          <ReportContent data={reportData} compact />
        </div>
      </div>
    </>
  );
}