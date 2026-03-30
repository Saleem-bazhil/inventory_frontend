import { DollarSign, ArrowDownToLine, ArrowUpFromLine, Layers } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { ReportSummary } from "@/types";

interface ReportKPIsProps {
  data: ReportSummary;
}

export function ReportKPIs({ data }: ReportKPIsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Inventory Value" value={formatCurrency(data.inventory_value)} icon={DollarSign} color="blue" index={0} />
      <KPICard title="Total Inflow" value={formatNumber(data.total_inflow)} icon={ArrowDownToLine} color="green" index={1} />
      <KPICard title="Total Outflow" value={formatNumber(data.total_outflow)} icon={ArrowUpFromLine} color="amber" index={2} />
      <KPICard title="Categories" value={data.category_count} icon={Layers} color="purple" index={3} />
    </div>
  );
}
