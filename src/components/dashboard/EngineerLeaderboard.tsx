import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDuration } from "@/lib/workflow";
import type { EngineerPerformance } from "@/types";

interface EngineerLeaderboardProps {
  data: EngineerPerformance[];
}

function getComplianceColor(pct: number) {
  if (pct >= 90) {
    return {
      bar: "bg-green-500 dark:bg-green-400",
      track: "bg-green-100 dark:bg-green-950/50",
      text: "text-green-700 dark:text-green-300",
    };
  }
  if (pct >= 70) {
    return {
      bar: "bg-amber-500 dark:bg-amber-400",
      track: "bg-amber-100 dark:bg-amber-950/50",
      text: "text-amber-700 dark:text-amber-300",
    };
  }
  return {
    bar: "bg-red-500 dark:bg-red-400",
    track: "bg-red-100 dark:bg-red-950/50",
    text: "text-red-700 dark:text-red-300",
  };
}

function getRankBadge(rank: number) {
  if (rank === 1) {
    return "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  }
  if (rank === 2) {
    return "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600";
  }
  if (rank === 3) {
    return "bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  }
  return "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";
}

export function EngineerLeaderboard({ data }: EngineerLeaderboardProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.sla_compliance_pct - a.sla_compliance_pct),
    [data],
  );

  const isEmpty = !data || data.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Engineer Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500">
              <p className="text-sm">No data</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Engineer Name</TableHead>
                  <TableHead className="text-center">Assigned</TableHead>
                  <TableHead className="text-center">Completed</TableHead>
                  <TableHead className="text-center">Avg Resolution</TableHead>
                  <TableHead className="w-48">SLA Compliance</TableHead>
                  <TableHead className="text-center">Total Delays</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((engineer, index) => {
                  const rank = index + 1;
                  const compliance = getComplianceColor(engineer.sla_compliance_pct);
                  const clampedPct = Math.min(100, Math.max(0, engineer.sla_compliance_pct));

                  return (
                    <TableRow key={engineer.engineer_id}>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-bold",
                            getRankBadge(rank),
                          )}
                        >
                          {rank}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{engineer.name}</TableCell>
                      <TableCell className="text-center">{engineer.assigned}</TableCell>
                      <TableCell className="text-center">{engineer.completed}</TableCell>
                      <TableCell className="text-center">
                        {engineer.avg_resolution_hrs.toFixed(1)}h
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn("flex-1 h-2 rounded-full overflow-hidden", compliance.track)}>
                            <div
                              className={cn("h-full rounded-full transition-all", compliance.bar)}
                              style={{ width: `${clampedPct}%` }}
                            />
                          </div>
                          <span className={cn("text-xs font-semibold min-w-[3rem] text-right", compliance.text)}>
                            {engineer.sla_compliance_pct.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-slate-500 dark:text-slate-400">
                        {formatDuration(engineer.total_delay_mins)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
