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
  onEdit
}: {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: number) => void;
  onEdit: (tx: Transaction) => void;
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
            <TableHead className="w-[90px] text-center">Action</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-muted-foreground">{t.date}</TableCell>

              <TableCell className="font-medium">{t.description}</TableCell>

              <TableCell className="capitalize">{t.transactionType}</TableCell>

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

                {/*  */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(t.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>


              <TableCell>{categoryName(categories, t.categoryId)}</TableCell>
            </TableRow>
          ))}

          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No transactions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
