import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG } from "@/lib/workflow";
import { formatDuration } from "@/lib/workflow";
import { ROLE_LABELS } from "@/types";
import type { DelayHeatmapCell, UserRole, TicketStatus } from "@/types";
import { Clock, AlertTriangle } from "lucide-react";

interface DelayHeatmapProps {
  data: DelayHeatmapCell[];
}

function getCellColor(avgDelay: number) {
  if (avgDelay < 10) {
    return {
      bg: "bg-green-100 dark:bg-green-950/50",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    };
  }
  if (avgDelay <= 60) {
    return {
      bg: "bg-amber-100 dark:bg-amber-950/50",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
    };
  }
  return {
    bg: "bg-red-100 dark:bg-red-950/50",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
  };
}

export function DelayHeatmap({ data }: DelayHeatmapProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Delay Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
            <p className="text-sm">No data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract unique roles and statuses preserving order
  const roles = Array.from(new Set(data.map((d) => d.role))) as UserRole[];
  const statusSet = new Set(data.map((d) => d.status));
  // Sort statuses by their configured order
  const statuses = (Object.keys(STATUS_CONFIG) as TicketStatus[])
    .filter((s) => statusSet.has(s))
    .sort((a, b) => STATUS_CONFIG[a].order - STATUS_CONFIG[b].order);

  // Build lookup map: role-status -> cell
  const cellMap = new Map<string, DelayHeatmapCell>();
  for (const cell of data) {
    cellMap.set(`${cell.role}-${cell.status}`, cell);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Delay Heatmap
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Average delay by role and status
          </p>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-green-400 dark:bg-green-500" />
              {"< 10m"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 dark:bg-amber-500" />
              10m - 60m
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400 dark:bg-red-500" />
              {"> 60m"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    Role
                  </th>
                  {statuses.map((status) => (
                    <th
                      key={status}
                      className="px-2 py-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap"
                    >
                      {STATUS_CONFIG[status].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role}>
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 px-3 py-2 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {ROLE_LABELS[role]}
                    </td>
                    {statuses.map((status) => {
                      const cell = cellMap.get(`${role}-${status}`);
                      if (!cell) {
                        return (
                          <td key={status} className="px-2 py-2">
                            <div className="flex items-center justify-center">
                              <span className="text-xs text-slate-300 dark:text-slate-600">
                                --
                              </span>
                            </div>
                          </td>
                        );
                      }

                      const color = getCellColor(cell.avg_delay_mins);
                      return (
                        <td key={status} className="px-1 py-1">
                          <div
                            className={cn(
                              "rounded-lg border p-2 text-center min-w-[80px]",
                              color.bg,
                              color.border,
                            )}
                          >
                            <p className={cn("text-sm font-semibold", color.text)}>
                              {formatDuration(cell.avg_delay_mins)}
                            </p>
                            {cell.breach_count > 0 && (
                              <p className="flex items-center justify-center gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
                                <AlertTriangle className="w-3 h-3" />
                                {cell.breach_count} breach{cell.breach_count !== 1 ? "es" : ""}
                              </p>
                            )}
                            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                              {cell.total_tickets} ticket{cell.total_tickets !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
