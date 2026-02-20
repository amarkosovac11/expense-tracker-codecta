import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IncomeExpenseChart from "@/components/IncomeExpenseChart";
import { useTransactions } from "../hooks/useTransactions";
import TransactionsTable from "@/components/TransactionsTable";
import AddTransactionDialog from "@/components/AddTransactionDialog";
import { useCategories } from "@/hooks/useCategories";
import ExpensesByCategoryChart from "@/components/ExpensesByCategoryChart";
import EditTransactionDialog from "@/components/EditTransactionDialog";
import { useState } from "react";
import type { Transaction } from "../types/models";
import MonthlyIncomeExpenseChart from "@/components/MonthlyIncomeExpenseChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionsFilters, { defaultTxFilters, type TxFilters } from "@/components/TransactionsFilters";
import { useMemo } from "react";




function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage({
  userId,
  onLogout,
}: {
  userId: number;
  onLogout: () => void;
}) {
  const { categories } = useCategories();

  const {
    transactions,
    totalIncome,
    totalExpense,
    balance,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  } = useTransactions(userId);



  // STATES
  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [monthsRange, setMonthsRange] = useState<3 | 6 | 12>(6);
  const [filters, setFilters] = useState<TxFilters>(defaultTxFilters);


  const filteredTransactions = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    let list = transactions.slice();

    // search
    if (q) {
      list = list.filter((t) => (t.description ?? "").toLowerCase().includes(q));
    }

    // tip
    if (filters.type !== "all") {
      list = list.filter((t) => t.transactionType === filters.type);
    }

    // category
    if (filters.categoryId !== "all") {
      list = list.filter((t) => t.categoryId === filters.categoryId);
    }

    // range date
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


  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <EditTransactionDialog
          open={editOpen}
          onOpenChange={(v) => {
            setEditOpen(v);
            if (!v) setEditingTx(null);
          }}
          tx={editingTx}
          categories={categories}
          onSave={(id, updated) => {
            updateTransaction(id, updated);
          }}
        />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Overview of your finances
            </p>
          </div>


          <div className="flex items-center gap-2">
            <AddTransactionDialog
              userId={userId}
              categories={categories}
              onAdd={addTransaction}
            />
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Income" value={totalIncome} />
          <StatCard title="Expense" value={totalExpense} />
          <StatCard title="Balance" value={balance} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Income vs Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart income={totalIncome} expense={totalExpense} />
            </CardContent>
          </Card>

          {/* Novi chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Income vs Expense</CardTitle>

              <div className="w-[140px]">
                <Select
                  value={String(monthsRange)}
                  onValueChange={(v) => setMonthsRange(Number(v) as 3 | 6 | 12)}
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
              <MonthlyIncomeExpenseChart transactions={transactions} months={monthsRange} />
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Recent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions
                .slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-3 border-b last:border-b-0 pb-2 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
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

              {transactions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
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



          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsFilters
                categories={categories}
                value={filters}
                onChange={setFilters}
                onClear={() => setFilters(defaultTxFilters)}
              />
              <TransactionsTable
                transactions={filteredTransactions}
                categories={categories}
                onEdit={(tx) => { setEditingTx(tx); setEditOpen(true); }}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
