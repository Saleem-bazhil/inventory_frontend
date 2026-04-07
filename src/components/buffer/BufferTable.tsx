import { motion } from "framer-motion";
import { BoxesIcon, Unlock } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { BufferEntry } from "@/types";

interface BufferTableProps {
  data: BufferEntry[];
  loading: boolean;
  onRelease: (id: number) => void;
}

export function BufferTable({ data, loading, onRelease }: BufferTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <BoxesIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No buffer entries found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No stock is currently reserved in the buffer.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead>Part Number</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Reserved By</TableHead>
              <TableHead>Reserved For</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, i) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="font-mono text-sm font-medium">
                  {entry.stock_item.part_number}
                </TableCell>
                <TableCell>{entry.stock_item.part_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{entry.quantity}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-slate-600 dark:text-slate-300">
                  {entry.reason || "--"}
                </TableCell>
                <TableCell>{entry.reserved_by.full_name}</TableCell>
                <TableCell>
                  {entry.reserved_for_ticket_number ? (
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {entry.reserved_for_ticket_number}
                    </span>
                  ) : (
                    <span className="text-slate-400">--</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(entry.expires_at)}
                </TableCell>
                <TableCell>
                  {entry.is_active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {entry.is_active ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRelease(entry.id)}
                      className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                      title="Release buffer stock"
                    >
                      <Unlock className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-xs text-slate-400">--</span>
                  )}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
