import { motion, AnimatePresence } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowDownLeft, ArrowUpRight } from "lucide-react"; // Icons for flair
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
      <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl bg-slate-200/50 dark:bg-slate-800/50" />
        ))}
      </div>
    );
  }

  const start = (pagination.page - 1) * pagination.per_page + 1;
  const end = Math.min(pagination.page * pagination.per_page, pagination.total);

  return (
    <div className="group">
      {/* Container with Glassmorphism & Soft Shadow */}
      <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <TableHead className="font-semibold text-slate-900 dark:text-zinc-200 py-4">Date</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-zinc-200">Type</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-zinc-200">Material</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-zinc-200">Customer</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-zinc-200">Quantity</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode='popLayout'>
              {data.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group/row border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <TableCell className="py-4 text-sm font-medium text-slate-500 dark:text-zinc-400">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === "in" ? (
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                           <ArrowDownLeft size={14} />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                           <ArrowUpRight size={14} />
                        </div>
                      )}
                      <span className={`text-xs font-bold uppercase tracking-wider ${tx.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white">
                    {tx.material_name}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {tx.customer_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium">{tx.quantity}</span>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Modern Pagination UI */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-slate-500 dark:text-zinc-500">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{start}-{end}</span> of <span className="font-semibold text-slate-900 dark:text-white">{pagination.total}</span>
          </p>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(pagination.page - 1)} 
              disabled={pagination.page <= 1}
              className="rounded-xl border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 shadow-sm"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange(pagination.page + 1)} 
              disabled={pagination.page >= pagination.pages}
              className="rounded-xl border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 shadow-sm"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}