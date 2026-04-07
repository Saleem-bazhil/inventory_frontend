import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, Send, MessageSquare } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Quotation, PaginationMeta } from "@/types";
import { QUOTATION_STATUS_LABELS } from "@/types";

interface QuotationsTableProps {
  data: Quotation[];
  loading: boolean;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onSend: (id: number) => void;
  onRecordResponse: (id: number) => void;
}

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  sent: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  customer_approved: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  customer_rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  negotiating: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  expired: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
};

export function QuotationsTable({
  data,
  loading,
  pagination,
  onPageChange,
  onSend,
  onRecordResponse,
}: QuotationsTableProps) {
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
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No quotations found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your filters or create a new quotation.
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
              <TableHead>Quotation #</TableHead>
              <TableHead>Ticket #</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prepared By</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Customer Response</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((q, i) => (
              <motion.tr
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="font-medium">{q.quotation_number}</TableCell>
                <TableCell>{q.ticket_number}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(q.total_amount)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      statusStyles[q.status]
                    )}
                  >
                    {QUOTATION_STATUS_LABELS[q.status]}
                  </span>
                </TableCell>
                <TableCell>{q.prepared_by.full_name}</TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(q.sent_at)}
                </TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {q.customer_response_at ? formatDate(q.customer_response_at) : "--"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {q.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSend(q.id)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                        title="Send to customer"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    {q.status === "sent" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRecordResponse(q.id)}
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                        title="Record customer response"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    )}
                    {q.status !== "draft" && q.status !== "sent" && (
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
