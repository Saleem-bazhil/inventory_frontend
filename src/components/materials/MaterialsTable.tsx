import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Material, PaginationMeta } from "@/types";
import { useAuthStore } from "@/store/authStore";

interface MaterialsTableProps {
  data: Material[];
  loading: boolean;
  pagination: PaginationMeta;
  onSort: (field: string) => void;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onPageChange: (page: number) => void;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  closed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  taken_for_service: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export function MaterialsTable({
  data, loading, pagination, onSort, onEdit, onDelete, onPageChange,
}: MaterialsTableProps) {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === "super_admin";

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
                <button onClick={() => onSort("case_id")} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                  Case ID <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Part No.</TableHead>
              <TableHead>
                <button onClick={() => onSort("qty")} className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200">
                  Qty <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              {isSuperAdmin && <TableHead>Region</TableHead>}
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
                <TableCell className="font-medium">{m.case_id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{m.cust_name}</p>
                    {m.cust_contact && <p className="text-xs text-slate-500">{m.cust_contact}</p>}
                  </div>
                </TableCell>
                <TableCell>{m.product_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{m.service_type_display}</Badge>
                </TableCell>
                <TableCell>{m.part_number || "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{m.qty}</Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[m.call_status] || ""}`}>
                    {m.call_status_display}
                  </span>
                </TableCell>
                {isSuperAdmin && (
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{m.region_display || "-"}</Badge>
                  </TableCell>
                )}
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
