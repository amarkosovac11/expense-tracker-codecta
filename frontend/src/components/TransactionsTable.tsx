import { Button } from "@/components/ui/button";
import { categoryName } from "@/lib/categories";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, Transaction } from "../types/models";

export default function TransactionsTable({
  transactions,
  categories,
  onDelete,
  onEdit,
}: {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: number) => void;
  onEdit: (tx: Transaction) => void;
}) {
  const list = transactions;

  return (
    <div className="rounded-md border overflow-x-auto">
      <div className="min-w-[700px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="w-[120px] text-center">Type</TableHead>
              <TableHead className="w-[140px] text-center">Amount</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="w-[110px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {list.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-xs text-muted-foreground md:text-sm">
                  {t.date}
                </TableCell>

                <TableCell className="text-center text-xs font-medium md:text-sm">
                  {t.description}
                </TableCell>

                <TableCell className="text-center text-xs capitalize md:text-sm">
                  {t.transactionType}
                </TableCell>

                <TableCell
                  className={`text-center text-xs font-semibold md:text-sm ${
                    t.transactionType === "expense"
                      ? "text-destructive"
                      : "text-emerald-600"
                  }`}
                >
                  {t.transactionType === "expense" ? "-" : "+"}
                  {t.amount}
                </TableCell>

                <TableCell className="text-center text-xs md:text-sm">
                  {categoryName(categories, t.categoryId)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(t)}>
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {list.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}