import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import MonthlyIncomeExpenseChart from "@/components/MonthlyIncomeExpenseChart";
import ExpensesByCategoryChart from "@/components/ExpensesByCategoryChart";
import TransactionsTable from "@/components/TransactionsTable";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import EditTransactionDialog from "@/components/EditTransactionDialog";
import TransactionsFilters, {
  defaultTxFilters,
  type TxFilters,
} from "@/components/TransactionsFilters";
import AddCategoryDialog from "@/components/AddCategoryDialog";

import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { useSavings } from "../hooks/useSavings";
import SavingsGoalsSection from "../components/SavingsGoalsSection";

import type { Transaction } from "../types/models";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import ExpensesCalendar from "@/components/ExpensesCalendar";

type TabKey = "dashboard" | "transactions" | "savings";

function StatCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number;
  type: "income" | "expense" | "balance";
}) {
  const color =
    type === "income"
      ? "text-emerald-600"
      : type === "expense"
        ? "text-red-500"
        : "text-primary";

  return (
    <Card className="bg-card border shadow-sm transition hover:shadow-md">
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {title}
        </p>

        <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function HeaderNav({
  tab,
  setTab,
  onLogout,
  userId,
  categories,
  onAddTransaction,
  onAddCategory,
}: {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  onLogout: () => void;
  userId: number;
  categories: any[];
  onAddTransaction: (tx: Omit<Transaction, "id">) => void;
  onAddCategory: (name: string, color: string) => void;
}) {
  const linkBase =
    "text-sm font-medium transition-colors hover:text-primary";
  const active = "text-foreground";
  const idle = "text-muted-foreground";

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold tracking-tight">Expense Tracker</div>

        <button
          type="button"
          onClick={() => setTab("dashboard")}
          className={`${linkBase} ${tab === "dashboard" ? active : idle}`}
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => setTab("transactions")}
          className={`${linkBase} ${tab === "transactions" ? active : idle}`}
        >
          Transactions
        </button>

        <button
          type="button"
          onClick={() => setTab("savings")}
          className={`${linkBase} ${tab === "savings" ? active : idle}`}
        >
          Saving goals
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AddTransactionDialog
          userId={userId}
          categories={categories}
          onAdd={onAddTransaction}
        />
        <AddCategoryDialog onAdd={(name, color) => onAddCategory(name, color)} />
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage({
  userId,
  onLogout,
}: {
  userId: number;
  onLogout: () => void;
}) {
  const { categories, addCategory } = useCategories();



  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  } = useTransactions(userId);

  const {
    goals,
    addToGoal,
    addGoal,
    getGoalTransactions,
    deleteSavingTransaction,
  } = useSavings(userId);

  const [tab, setTab] = useState<TabKey>("dashboard");

  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [monthsRange, setMonthsRange] = useState<3 | 6 | 12>(6);
  const [filters, setFilters] = useState<TxFilters>(defaultTxFilters);

  const filteredTransactions = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let list = transactions.slice();

    if (q) {
      list = list.filter((t) =>
        (t.description ?? "").toLowerCase().includes(q)
      );
    }

    if (filters.type !== "all") {
      list = list.filter((t) => t.transactionType === filters.type);
    }

    if (filters.categoryId !== "all") {
      list = list.filter((t) => t.categoryId === filters.categoryId);
    }

    if (filters.from) list = list.filter((t) => t.date >= filters.from);
    if (filters.to) list = list.filter((t) => t.date <= filters.to);

    switch (filters.sort) {
      case "date_desc":
        list.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "date_asc":
        list.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "amount_desc":
        list.sort((a, b) => b.amount - a.amount);
        break;
      case "amount_asc":
        list.sort((a, b) => a.amount - b.amount);
        break;
    }

    return list;
  }, [transactions, filters]);

  const recent = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <EditTransactionDialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditingTx(null);
          }}
          tx={editingTx}
          categories={categories}
          onSave={(id, updated) => updateTransaction(id, updated)}
        />

        <HeaderNav
          tab={tab}
          setTab={setTab}
          onLogout={onLogout}
          userId={userId}
          categories={categories}
          onAddTransaction={addTransaction}
          onAddCategory={addCategory}
        />

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="rounded-xl bg-muted p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Income" value={totalIncome} type="income" />
                <StatCard title="Expense" value={totalExpense} type="expense" />
                <StatCard title="Balance" value={balance} type="balance" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="border bg-card shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle>Income vs Expense</CardTitle>
                </CardHeader>
                <CardContent>
                  <IncomeExpenseChart
                    income={totalIncome}
                    expense={totalExpense}
                  />
                </CardContent>
              </Card>

              <Card className="border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Recent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recent.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-start justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {t.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.date} • {t.transactionType}
                        </div>
                      </div>

                      <div
                        className={`text-sm font-semibold ${t.transactionType === "expense"
                          ? "text-destructive"
                          : "text-emerald-600"
                          }`}
                      >
                        {t.transactionType === "expense" ? "-" : "+"}
                        {t.amount}
                      </div>
                    </div>
                  ))}

                  {recent.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No transactions yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border bg-card shadow-sm lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Monthly Income vs Expense</CardTitle>

                  <div className="w-[160px]">
                    <Select
                      value={String(monthsRange)}
                      onValueChange={(v) =>
                        setMonthsRange(Number(v) as 3 | 6 | 12)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Months" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Last 3 months</SelectItem>
                        <SelectItem value="6">Last 6 months</SelectItem>
                        <SelectItem value="12">Last 12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent>
                  <MonthlyIncomeExpenseChart
                    transactions={transactions}
                    months={monthsRange}
                  />
                </CardContent>
              </Card>

              <Card className="border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpensesByCategoryChart
                    transactions={transactions}
                    categories={categories}
                  />
                </CardContent>
              </Card>

              <Card className="border bg-card shadow-sm lg:col-span-3">
                <CardHeader>
                  <CardTitle>Expenses Calendar</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ExpensesCalendar transactions={transactions} categories={categories} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab === "transactions" && (
          <Card className="border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TransactionsFilters
                categories={categories}
                value={filters}
                onChange={setFilters}
                onClear={() => setFilters(defaultTxFilters)}
              />

              <TransactionsTable
                transactions={filteredTransactions}
                categories={categories}
                onEdit={(tx) => {
                  setEditingTx(tx);
                  setEditOpen(true);
                }}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        )}

        {/* SAVINGS TAB */}
        {tab === "savings" && (
          <Card className="border bg-card shadow-sm">
            <CardHeader>
              <CardTitle>Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsGoalsSection
                userId={userId}
                goals={goals}
                onAddToGoal={addToGoal}
                onCreateGoal={addGoal}
                getGoalTransactions={getGoalTransactions}
                onDeleteTx={deleteSavingTransaction}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}