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
}: {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: number) => void;
}) {

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead className="w-[140px] text-right">Amount</TableHead>
            <TableHead className="w-[90px] text-right">Action</TableHead>
            <TableHead>Category</TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-muted-foreground">
                {categoryName(categories, t.categoryId)}
              </TableCell>

              <TableCell className="font-medium">
                {categoryName(categories, t.categoryId)}
              </TableCell>
              <TableCell className="capitalize">{categoryName(categories, t.categoryId)}</TableCell>

              <TableCell
                className={`text-right font-semibold ${t.transactionType === "expense"
                    ? "text-destructive"
                    : "text-emerald-600"
                  }`}
              >
                {t.transactionType === "expense" ? "-" : "+"}
                {t.amount}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => onDelete(t.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No transactions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
