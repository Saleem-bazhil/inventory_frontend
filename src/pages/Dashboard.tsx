import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  CalendarDays,
  UserCheck,
  UserX,
  Wrench,
  Package,
  FileText,
  Truck,
  Clock,
  CheckCircle2,
  Plus,
  MapPin,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SLABreachFeed } from "@/components/dashboard/SLABreachFeed";
import { useAuthStore } from "@/store/authStore";
import { useWorkflowStore } from "@/store/workflowStore";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/hooks/useDashboard";
import { useSLABreaches } from "@/hooks/useSLABreaches";
import { REGION_LABELS } from "@/types";
import type { Region } from "@/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// KPI Card (inline, tailored for dashboard grid)
// ---------------------------------------------------------------------------
interface KPIProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
  delay?: number;
}

function KPI({ title, value, icon: Icon, color, bgColor, iconColor, onClick, delay = 0 }: KPIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
    >
      <Card
        className={cn(
          "p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4",
          color,
          onClick && "hover:scale-[1.01] active:scale-[0.99]"
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bgColor)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------
function KPIGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const dismissAlert = useWorkflowStore((s) => s.dismissAlert);
  const [selectedRegion, setSelectedRegion] = useState("");

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const { data: dashData, loading: dashLoading, error: dashError, refetch } = useDashboard(
    isAdmin && selectedRegion ? selectedRegion : undefined
  );
  const { data: breaches = [] } = useSLABreaches();

  const o = dashData?.overview;
  const regions = dashData?.regions ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? selectedRegion
                ? `Region: ${REGION_LABELS[selectedRegion as Region] || selectedRegion}`
                : "Overview of all regions"
              : user?.region
                ? `Region: ${REGION_LABELS[user.region as Region] || user.region}`
                : "Welcome back"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Region selector for super admin */}
          {isAdmin && (
            <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
              <button
                onClick={() => setSelectedRegion("")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  !selectedRegion
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {Object.entries(REGION_LABELS).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setSelectedRegion(code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedRegion === code
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={refetch} disabled={dashLoading} className="gap-1.5">
            <RefreshCw className={cn("w-3.5 h-3.5", dashLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={() => navigate("/cso-entry")} className="gap-2">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
        </div>
      </div>

      {/* Error */}
      {dashError && (
        <Card className="border-red-200 dark:border-red-900/50">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300 flex-1">{dashError}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── KPI Cards Grid (your 10 requested KPIs) ────────────────────── */}
      {dashLoading ? (
        <KPIGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <KPI
            title="Total Services"
            value={o?.total_tickets ?? 0}
            icon={Ticket}
            color="border-indigo-500"
            bgColor="bg-indigo-100 dark:bg-indigo-950/50"
            iconColor="text-indigo-600 dark:text-indigo-400"
            onClick={() => navigate("/cso-entry")}
            delay={0}
          />
          <KPI
            title="Today Services"
            value={o?.tickets_today ?? 0}
            icon={CalendarDays}
            color="border-blue-500"
            bgColor="bg-blue-100 dark:bg-blue-950/50"
            iconColor="text-blue-600 dark:text-blue-400"
            delay={1}
          />
          <KPI
            title="Assigned"
            value={o?.assigned_count ?? 0}
            icon={UserCheck}
            color="border-green-500"
            bgColor="bg-green-100 dark:bg-green-950/50"
            iconColor="text-green-600 dark:text-green-400"
            delay={2}
          />
          <KPI
            title="Unassigned"
            value={o?.unassigned_count ?? 0}
            icon={UserX}
            color="border-red-500"
            bgColor="bg-red-100 dark:bg-red-950/50"
            iconColor="text-red-600 dark:text-red-400"
            delay={3}
          />
          <KPI
            title="In Progress"
            value={o?.in_progress_count ?? 0}
            icon={Wrench}
            color="border-cyan-500"
            bgColor="bg-cyan-100 dark:bg-cyan-950/50"
            iconColor="text-cyan-600 dark:text-cyan-400"
            delay={4}
          />
          <KPI
            title="Part Pending"
            value={o?.part_pending_count ?? 0}
            icon={Package}
            color="border-amber-500"
            bgColor="bg-amber-100 dark:bg-amber-950/50"
            iconColor="text-amber-600 dark:text-amber-400"
            onClick={() => navigate("/part-request")}
            delay={5}
          />
          <KPI
            title="Part Order Pending"
            value={o?.part_order_pending_count ?? 0}
            icon={TrendingUp}
            color="border-purple-500"
            bgColor="bg-purple-100 dark:bg-purple-950/50"
            iconColor="text-purple-600 dark:text-purple-400"
            onClick={() => navigate("/purchase-order")}
            delay={6}
          />
          <KPI
            title="Part Quote Pending"
            value={o?.part_quote_pending_count ?? 0}
            icon={FileText}
            color="border-orange-500"
            bgColor="bg-orange-100 dark:bg-orange-950/50"
            iconColor="text-orange-600 dark:text-orange-400"
            onClick={() => navigate("/quotation")}
            delay={7}
          />
          <KPI
            title="Ready to Dispatch"
            value={o?.ready_to_dispatch_count ?? 0}
            icon={Truck}
            color="border-lime-500"
            bgColor="bg-lime-100 dark:bg-lime-950/50"
            iconColor="text-lime-600 dark:text-lime-400"
            delay={8}
          />
          <KPI
            title="CX Pending"
            value={o?.cx_pending_count ?? 0}
            icon={Clock}
            color="border-rose-500"
            bgColor="bg-rose-100 dark:bg-rose-950/50"
            iconColor="text-rose-600 dark:text-rose-400"
            delay={9}
          />
        </div>
      )}

      {/* Completed - standalone highlight card */}
      {!dashLoading && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardContent className="flex items-center justify-between py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{o?.completed_count ?? 0}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Closed today</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{o?.closed_today ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* SLA Breaches + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SLABreachFeed alerts={breaches} onDismiss={dismissAlert} />
        </div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/cso-entry")}>
              <Ticket className="w-4 h-4" /> Create CSO Entry
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/part-request")}>
              <Package className="w-4 h-4" /> Review Part Requests
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/quotation")}>
              <FileText className="w-4 h-4" /> Manage Quotations
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/stock")}>
              <TrendingUp className="w-4 h-4" /> Check Stock
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/reports")}>
              <BarChart3 className="w-4 h-4" /> View Reports
            </Button>
          </div>
        </Card>
      </div>

      {/* Region Breakdown (admin only) */}
      {isAdmin && !dashLoading && regions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Region Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map((r, i) => (
              <motion.div
                key={r.region}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">
                      {REGION_LABELS[r.region as Region] || r.region}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">{r.total_tickets}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">{r.open_tickets} open</Badge>
                    {r.breached > 0 && (
                      <Badge variant="destructive" className="text-xs gap-1">
                        <AlertTriangle className="w-3 h-3" /> {r.breached} breached
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
