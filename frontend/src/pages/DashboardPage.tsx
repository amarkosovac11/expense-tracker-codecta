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


  const [editOpen, setEditOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);




  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Overview of your finances
            </p>
          </div>
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
              <TransactionsTable
                transactions={transactions}
                categories={categories}
                onEdit={(tx) => {
                  setEditingTx(tx);
                  setEditOpen(true);
                }}
                onDelete={deleteTransaction}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

}
