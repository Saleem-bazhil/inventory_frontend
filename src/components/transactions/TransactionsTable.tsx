import { motion } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { Transaction, PaginationMeta } from "@/types";

interface TransactionsTableProps {
  data: Transaction[];
  loading: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TransactionsTable({ data, loading, pagination, onPageChange }: TransactionsTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  const start = (pagination.page - 1) * pagination.per_page + 1;
  const end = Math.min(pagination.page * pagination.per_page, pagination.total);

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tx, i) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="text-sm">{formatDate(tx.date)}</TableCell>
                <TableCell>
                  <Badge variant={tx.type === "in" ? "success" : "destructive"}>
                    {tx.type === "in" ? "IN" : "OUT"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{tx.material_name}</TableCell>
                <TableCell className="text-slate-500">{tx.customer_name}</TableCell>
                <TableCell>{tx.quantity}</TableCell>
                <TableCell className="text-slate-500 max-w-[200px] truncate">{tx.notes}</TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>Showing {start}-{end} of {pagination.total}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.pages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
