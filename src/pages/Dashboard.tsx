import { useState } from "react";
import { motion } from "framer-motion";
import { Package, BarChart3, AlertTriangle, ArrowUpDown, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/dashboard/KPICard";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { TopMaterialsChart } from "@/components/dashboard/TopMaterialsChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MaterialFormDialog } from "@/components/materials/MaterialFormDialog";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { useDashboard } from "@/hooks/useDashboard";
import { formatNumber } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";


export default function Dashboard() {
  const { stats, charts, recentActivity, loading, error, refetch } = useDashboard();
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const handleAddMaterial = async () => {
    toast({ title: "Material created successfully" });
    setMaterialDialogOpen(false);
  };

  const handleAddTransaction = async () => {
    toast({ title: "Transaction created successfully" });
    setTransactionDialogOpen(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setMaterialDialogOpen(true)} className="gap-2 flex-1 sm:flex-initial text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add</span> Material
          </Button>
          <Button onClick={() => setTransactionDialogOpen(true)} className="gap-2 flex-1 sm:flex-initial text-xs sm:text-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New</span> Transaction
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Materials" value={stats.total_materials} icon={Package} change="+3 this month" color="blue" index={0} />
          <KPICard title="Total Stock" value={formatNumber(stats.total_stock)} icon={BarChart3} change="+12% vs last month" color="green" index={1} />
          <KPICard title="Low Stock Alerts" value={stats.low_stock_count} icon={AlertTriangle} change={`${stats.low_stock_count} items need attention`} color="amber" index={2} />
          <KPICard title="Transactions Today" value={stats.today_transactions} icon={ArrowUpDown} change="2 incoming, 1 outgoing" color="purple" index={3} />
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
      ) : charts ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockMovementChart data={charts.stock_movement} />
          <TopMaterialsChart data={charts.top_materials} />
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48 lg:col-span-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMaterialDialogOpen(true)}>
                <Package className="w-4 h-4" />
                Add New Material
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setTransactionDialogOpen(true)}>
                <ArrowUpDown className="w-4 h-4" />
                Record Transaction
              </Button>
            </div>
          </Card>
          <div className="lg:col-span-2">
            <RecentActivity data={recentActivity} />
          </div>
        </div>
      )}

      <MaterialFormDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        onSubmit={handleAddMaterial}
      />
      <TransactionFormDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        onSubmit={handleAddTransaction}
      />
    </motion.div>
  );
}
