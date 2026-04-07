import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Ticket,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/KPICard";
import { DelayHeatmap } from "@/components/dashboard/DelayHeatmap";
import { EngineerLeaderboard } from "@/components/dashboard/EngineerLeaderboard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useAuthStore } from "@/store/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import { useDelayHeatmap } from "@/hooks/useDelayHeatmap";
import { useEngineerPerformance } from "@/hooks/useEngineerPerformance";
import { REGION_LABELS } from "@/types";
import type { Region } from "@/types";

// ---------------------------------------------------------------------------
// Period options
// ---------------------------------------------------------------------------
type Period = "7d" | "30d" | "90d";

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
];

// ---------------------------------------------------------------------------
// Reusable loading skeleton for KPI cards row
// ---------------------------------------------------------------------------
function KPISkeletonRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error card with retry action
// ---------------------------------------------------------------------------
function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <CardContent className="flex items-center gap-4 py-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Failed to load data
          </p>
          <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5 truncate">
            {message}
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-1.5 flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Section skeleton (generic tall card placeholder)
// ---------------------------------------------------------------------------
function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`w-full ${height}`} />
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Reports Page
// ---------------------------------------------------------------------------
export default function Reports() {
  const [period, setPeriod] = useState<Period>("30d");

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Independent data fetches -- each can fail without crashing the page
  const {
    data: dashData,
    loading: dashLoading,
    error: dashError,
    refetch: dashRefetch,
  } = useDashboard();
  const {
    data: heatmap = [],
    loading: heatmapLoading,
    error: heatmapError,
    refetch: heatmapRefetch,
  } = useDelayHeatmap(period);
  const {
    data: engineers = [],
    loading: engineersLoading,
    error: engineersError,
    refetch: engineersRefetch,
  } = useEngineerPerformance();

  const overview = dashData?.overview;
  const regions = dashData?.regions ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header + Period Selector                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analytics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period toggle */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  period === opt.value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dashRefetch();
              heatmapRefetch();
              engineersRefetch();
            }}
            disabled={dashLoading && heatmapLoading && engineersLoading}
            className="gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                dashLoading || heatmapLoading || engineersLoading
                  ? "animate-spin"
                  : ""
              }`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Dashboard error (non-blocking)                                     */}
      {/* ------------------------------------------------------------------ */}
      {dashError && <ErrorCard message={dashError} onRetry={dashRefetch} />}

      {/* ------------------------------------------------------------------ */}
      {/* KPI Cards                                                          */}
      {/* ------------------------------------------------------------------ */}
      {dashLoading ? (
        <KPISkeletonRow />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Tickets"
            value={overview?.total_tickets ?? 0}
            icon={Ticket}
            change={
              overview?.tickets_today != null
                ? `${overview.tickets_today} created today`
                : undefined
            }
            color="blue"
            index={0}
          />
          <KPICard
            title="Avg Resolution"
            value={
              overview?.avg_resolution_hrs != null
                ? `${overview.avg_resolution_hrs.toFixed(1)}h`
                : "--"
            }
            icon={TrendingUp}
            change="hours per ticket"
            color="purple"
            index={1}
          />
          <KPICard
            title="SLA Breaches"
            value={overview?.breached_count ?? 0}
            icon={AlertTriangle}
            change={
              overview?.warning_count != null
                ? `${overview.warning_count} warnings`
                : undefined
            }
            color="amber"
            index={2}
          />
          <KPICard
            title="Closed Today"
            value={overview?.closed_today ?? 0}
            icon={CheckCircle2}
            change={
              overview
                ? `of ${overview.total_tickets} total`
                : undefined
            }
            color="green"
            index={3}
          />
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Delay Heatmap (full width)                                         */}
      {/* ------------------------------------------------------------------ */}
      {heatmapError && (
        <ErrorCard message={heatmapError} onRetry={heatmapRefetch} />
      )}
      {heatmapLoading ? (
        <SectionSkeleton height="h-64" />
      ) : (
        <DelayHeatmap data={heatmap} />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Engineer Leaderboard (full width)                                  */}
      {/* ------------------------------------------------------------------ */}
      {engineersError && (
        <ErrorCard message={engineersError} onRetry={engineersRefetch} />
      )}
      {engineersLoading ? (
        <SectionSkeleton height="h-48" />
      ) : (
        <EngineerLeaderboard data={engineers} />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Region Comparison Table (admin only)                               */}
      {/* ------------------------------------------------------------------ */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  Region Comparison
                </CardTitle>
                {regions.length > 0 && (
                  <Badge variant="secondary">{regions.length} regions</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {dashLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : regions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No region data available
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Region stats will appear as tickets flow through the system
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-center">
                          Total Tickets
                        </TableHead>
                        <TableHead className="text-center">Open</TableHead>
                        <TableHead className="text-center">Breached</TableHead>
                        <TableHead className="text-center">
                          Breach Rate
                        </TableHead>
                        <TableHead className="text-center">
                          Avg Resolution
                        </TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regions.map((r) => {
                        const label =
                          REGION_LABELS[r.region as Region] || r.region;
                        const breachPct =
                          r.total_tickets > 0
                            ? (r.breached / r.total_tickets) * 100
                            : 0;

                        return (
                          <TableRow key={r.region}>
                            <TableCell className="font-medium">
                              {label}
                            </TableCell>
                            <TableCell className="text-center">
                              {r.total_tickets}
                            </TableCell>
                            <TableCell className="text-center">
                              {r.open_tickets}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={
                                  r.breached > 0
                                    ? "text-red-600 dark:text-red-400 font-semibold"
                                    : ""
                                }
                              >
                                {r.breached}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`font-semibold ${
                                  breachPct > 20
                                    ? "text-red-600 dark:text-red-400"
                                    : breachPct > 10
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                {breachPct.toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {r.avg_resolution_hrs.toFixed(1)}h
                            </TableCell>
                            <TableCell className="text-center">
                              {r.breached > 0 ? (
                                <Badge variant="destructive">
                                  {r.breached} breached
                                </Badge>
                              ) : (
                                <Badge variant="success">On track</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
