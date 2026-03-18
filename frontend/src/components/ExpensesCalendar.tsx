import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category, Transaction } from "../types/models";

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function txToDateKey(value: string) {
  return toDateKey(new Date(value));
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCellLevel(amount: number, maxAmount: number) {
  if (amount <= 0 || maxAmount <= 0) return 0;

  const ratio = amount / maxAmount;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function getCategoryName(categories: Category[], categoryId: number) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Unknown";
}

export default function ExpensesCalendar({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const today = new Date();

  const expenseMap = useMemo(() => {
    const map = new Map<string, number>();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    transactions
      .filter((t) => t.transactionType === "expense")
      .forEach((t) => {
        const txDate = new Date(t.date);

        if (txDate.getFullYear() === year && txDate.getMonth() === month) {
          const key = toDateKey(txDate);
          map.set(key, (map.get(key) ?? 0) + t.amount);
        }
      });

    return map;
  }, [transactions, currentMonth]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    const cells: Array<Date | null> = [];

    for (let i = 0; i < startWeekday; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [currentMonth]);

  const maxExpense = useMemo(() => {
    return Math.max(0, ...Array.from(expenseMap.values()));
  }, [expenseMap]);

  const totalMonthExpense = useMemo(() => {
    return Array.from(expenseMap.values()).reduce((sum, val) => sum + val, 0);
  }, [expenseMap]);

  const activeDays = useMemo(() => {
    return Array.from(expenseMap.values()).filter((v) => v > 0).length;
  }, [expenseMap]);

  const selectedDate = useMemo(() => {
    if (!selectedDateKey) return null;

    const [y, m, d] = selectedDateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateKey]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDateKey) return [];

    return transactions
      .filter((t) => txToDateKey(t.date) === selectedDateKey)
      .slice()
      .sort((a, b) => {
        if (a.transactionType === b.transactionType) {
          return b.amount - a.amount;
        }
        return a.transactionType === "income" ? -1 : 1;
      });
  }, [transactions, selectedDateKey]);

  const selectedDayIncome = useMemo(() => {
    return selectedDayTransactions
      .filter((t) => t.transactionType === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedDayTransactions]);

  const selectedDayExpense = useMemo(() => {
    return selectedDayTransactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedDayTransactions]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function getExpenseBg(level: number) {
    switch (level) {
      case 1:
        return "bg-red-100 dark:bg-red-950/40";
      case 2:
        return "bg-red-200 dark:bg-red-900/40";
      case 3:
        return "bg-red-300 dark:bg-red-800/50";
      case 4:
        return "bg-red-400 dark:bg-red-700/60";
      default:
        return "bg-muted/60";
    }
  }

  function prevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Click a day to view all transactions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-[140px] text-center text-sm font-medium">
              {monthLabel(currentMonth)}
            </div>

            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px] text-muted-foreground">Total spent</div>
            <div className="mt-0.5 text-sm font-bold text-red-500">
              {totalMonthExpense.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px] text-muted-foreground">Active days</div>
            <div className="mt-0.5 text-sm font-bold">{activeDays}</div>
          </div>

          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px] text-muted-foreground">Highest day</div>
            <div className="mt-0.5 text-sm font-bold">
              {maxExpense.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px] text-muted-foreground">Avg / active day</div>
            <div className="mt-0.5 text-sm font-bold">
              {activeDays > 0 ? (totalMonthExpense / activeDays).toFixed(2) : "0.00"}
            </div>
          </div>
        </div>

        <div className="w-full rounded-xl border bg-card p-3">
          <div className="mb-2 grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid w-full grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={index}
                    className="min-h-[52px] rounded-md bg-transparent"
                  />
                );
              }

              const key = toDateKey(date);
              const amount = expenseMap.get(key) ?? 0;
              const level = getCellLevel(amount, maxExpense);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDateKey(key)}
                  className={`min-h-[52px] rounded-md border px-1.5 py-1 text-left transition-all hover:shadow-sm hover:scale-[1.01] ${getExpenseBg(
                    level
                  )} ${isToday ? "ring-2 ring-primary" : ""}`}
                  title={
                    amount > 0
                      ? `${key} • ${amount.toFixed(2)} spent`
                      : `${key} • No expenses`
                  }
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="text-[11px] font-semibold">{date.getDate()}</div>

                    <div className="text-[10px] leading-tight text-muted-foreground">
                      {amount > 0 ? amount.toFixed(0) : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-sm border bg-muted" />
            <span className="h-2.5 w-2.5 rounded-sm border bg-red-100 dark:bg-red-950/40" />
            <span className="h-2.5 w-2.5 rounded-sm border bg-red-200 dark:bg-red-900/40" />
            <span className="h-2.5 w-2.5 rounded-sm border bg-red-300 dark:bg-red-800/50" />
            <span className="h-2.5 w-2.5 rounded-sm border bg-red-400 dark:bg-red-700/60" />
            <span>More</span>
          </div>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedDateKey)}
        onOpenChange={(open) => !open && setSelectedDateKey(null)}
      >
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? formatDisplayDate(selectedDate) : "Day details"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border bg-card px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Income</div>
                <div className="mt-0.5 text-sm font-bold text-emerald-600">
                  +{selectedDayIncome.toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg border bg-card px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Expense</div>
                <div className="mt-0.5 text-sm font-bold text-red-500">
                  -{selectedDayExpense.toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg border bg-card px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Net</div>
                <div
                  className={`mt-0.5 text-sm font-bold ${selectedDayIncome - selectedDayExpense >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                    }`}
                >
                  {(selectedDayIncome - selectedDayExpense >= 0 ? "+" : "") +
                    (selectedDayIncome - selectedDayExpense).toFixed(2)}
                </div>
              </div>
            </div>

            {selectedDayTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No transactions on this day.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDayTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {tx.description || "Untitled transaction"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{getCategoryName(categories, tx.categoryId)}</span>
                        <span>•</span>
                        <span className="capitalize">{tx.transactionType}</span>
                      </div>
                    </div>

                    <div
                      className={`ml-4 text-sm font-semibold ${tx.transactionType === "income"
                        ? "text-emerald-600"
                        : "text-red-500"
                        }`}
                    >
                      {tx.transactionType === "income" ? "+" : "-"}
                      {tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}