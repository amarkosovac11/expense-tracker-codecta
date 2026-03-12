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
const list = transactions;
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="w-[120px] text-center">Type</TableHead>
            <TableHead className="w-[140px] text-center">Amount</TableHead>
            
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="w-[90px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {list.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-muted-foreground">{t.date}</TableCell>

              <TableCell className="font-medium text-center">{t.description}</TableCell>

              <TableCell className="capitalize text-center">{t.transactionType}</TableCell>

              <TableCell
                className={`text-center font-semibold ${t.transactionType === "expense"
                    ? "text-destructive"
                    : "text-emerald-600"
                  }`}
              >
                {t.transactionType === "expense" ? "-" : "+"}
                {t.amount}
              </TableCell>

                  
              <TableCell className="text-center">{categoryName(categories, t.categoryId)}</TableCell>

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


              
            </TableRow>
          ))}

          {list.length === 0 && (
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
