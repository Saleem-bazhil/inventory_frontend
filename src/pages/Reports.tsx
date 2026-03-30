import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportKPIs } from "@/components/reports/ReportKPIs";
import { StockByCategoryChart } from "@/components/reports/StockByCategoryChart";
import { CategoryPieChart } from "@/components/reports/CategoryPieChart";
import { useReports } from "@/hooks/useReports";

export default function Reports() {
  const { summary, categories, loading, error, refetch } = useReports();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">Failed to load reports</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze your inventory data.</p>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[380px]" />
            <Skeleton className="h-[380px]" />
          </div>
        </>
      ) : (
        <>
          {summary && <ReportKPIs data={summary} />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockByCategoryChart data={categories} />
            <CategoryPieChart data={categories} />
          </div>
        </>
      )}
    </motion.div>
  );
}
