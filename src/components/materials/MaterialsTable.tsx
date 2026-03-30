import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { Material, PaginationMeta } from "@/types";

interface MaterialsTableProps {
  data: Material[];
  loading: boolean;
  pagination: PaginationMeta;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onPageChange: (page: number) => void;
}

export function MaterialsTable({
  data, loading, pagination, sortBy, sortOrder, onSort, onEdit, onDelete, onPageChange,
}: MaterialsTableProps) {
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
              <TableHead>
                <button onClick={() => onSort("name")} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                  Name <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <button onClick={() => onSort("stock")} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                  Stock <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>
                <button onClick={() => onSort("unit_price")} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                  Unit Price <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((m, i) => (
              <motion.tr
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-slate-500">{m.sku}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{m.category}</Badge>
                </TableCell>
                <TableCell>
                  {m.stock} {m.unit}
                </TableCell>
                <TableCell className="text-slate-500">{m.min_stock}</TableCell>
                <TableCell>{formatCurrency(m.unit_price)}</TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getStatusColor(m.status))}>
                    {getStatusLabel(m.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(m)} className="h-8 w-8">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(m)} className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
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
