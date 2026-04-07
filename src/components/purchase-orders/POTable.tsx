import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ClipboardList, Send, PackageCheck } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { PurchaseOrder, PaginationMeta } from "@/types";
import { PO_STATUS_LABELS } from "@/types";

interface POTableProps {
  data: PurchaseOrder[];
  loading: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onSend: (id: number) => void;
  onReceive: (id: number) => void;
}

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  sent: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  confirmed: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  shipped: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  partial_received: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  received: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function POTable({
  data,
  loading,
  pagination,
  onPageChange,
  onSend,
  onReceive,
}: POTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <ClipboardList className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No purchase orders found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your filters or create a new purchase order.
        </p>
      </Card>
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
              <TableHead>PO #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Actual Delivery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((po, i) => (
              <motion.tr
                key={po.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="font-medium">{po.po_number}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{po.supplier_name}</p>
                    {po.supplier_contact && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{po.supplier_contact}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(po.total_amount)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      statusStyles[po.status]
                    )}
                  >
                    {PO_STATUS_LABELS[po.status]}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(po.expected_delivery)}
                </TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(po.actual_delivery)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {po.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSend(po.id)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                        title="Send to supplier"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    {(po.status === "shipped" || po.status === "confirmed" || po.status === "partial_received") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReceive(po.id)}
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                        title="Mark as received"
                      >
                        <PackageCheck className="w-4 h-4" />
                      </Button>
                    )}
                    {po.status !== "draft" &&
                      po.status !== "shipped" &&
                      po.status !== "confirmed" &&
                      po.status !== "partial_received" && (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{start}-{end}</span> of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{pagination.total}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
