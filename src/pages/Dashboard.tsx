import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Wrench, Plus, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/dashboard/KPICard";
import { MaterialFormDialog } from "@/components/materials/MaterialFormDialog";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { REGION_LABELS } from "@/types";
import type { Region } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { createMaterial } from "@/api/materials";

export default function Dashboard() {
  const { data, loading, error, refetch } = useDashboard();
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === "super_admin";
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);

  const handleAddMaterial = async (formData: any) => {
    try {
      await createMaterial(formData);
      toast({ title: "Material created successfully" });
      setMaterialDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast({ title: "Error creating material", description: err.response?.data?.detail || "Unexpected error", variant: "destructive" });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">Something went wrong</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    );
  }

  const overall = data?.overall;
  const regions = data?.regions || [];

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
            {isSuperAdmin
              ? "Overview of all regions"
              : user?.region
                ? `Region: ${REGION_LABELS[user.region]}`
                : "Welcome back"}
          </p>
        </div>
        <Button onClick={() => setMaterialDialogOpen(true)} className="gap-2 sm:w-auto w-full">
          <Plus className="w-4 h-4" /> Add Material
        </Button>
      </div>

      {/* Overall KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : overall ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title={isSuperAdmin ? "Total Records (All Regions)" : "Total Records"}
            value={overall.total_materials}
            icon={Package}
            change={`${overall.total_qty} total qty`}
            color="blue"
            index={0}
          />
          <KPICard
            title="Pending"
            value={overall.pending}
            icon={Clock}
            change="Awaiting action"
            color="amber"
            index={1}
          />
          <KPICard
            title="Closed"
            value={overall.closed}
            icon={CheckCircle2}
            change="Completed"
            color="green"
            index={2}
          />
          <KPICard
            title="Taken for Service"
            value={overall.taken_for_service}
            icon={Wrench}
            change="In progress"
            color="purple"
            index={3}
          />
        </div>
      ) : null}

      {/* Super Admin: Per-region breakdown */}
      {isSuperAdmin && !loading && regions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Region Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map((r, i) => (
              <motion.div
                key={r.region}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100 capitalize">
                      {REGION_LABELS[r.region as Region] || r.region}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">{r.total_materials}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" /> {r.pending} pending
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {r.closed} closed
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Wrench className="w-3 h-3 mr-1" /> {r.taken_for_service} service
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMaterialDialogOpen(true)}>
                <Package className="w-4 h-4" />
                Add New Service Record
              </Button>
            </div>
          </Card>
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Status Summary</h3>
            {overall ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total Quantity</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{overall.total_qty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Pending Cases</span>
                  <span className="font-semibold text-amber-600">{overall.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Closed Cases</span>
                  <span className="font-semibold text-green-600">{overall.closed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">In Service</span>
                  <span className="font-semibold text-purple-600">{overall.taken_for_service}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No data yet</p>
            )}
          </Card>
        </div>
      )}

      <MaterialFormDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        onSubmit={handleAddMaterial}
      />
    </motion.div>
  );
}
