import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

interface RecentActivityProps {
  data: Transaction[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">Date</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">Material</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">Type</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">Qty</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:table-cell">Customer</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap text-xs sm:text-sm">{formatDate(tx.date)}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-100 text-xs sm:text-sm">{tx.material_name}</td>
                  <td className="py-3 px-3">
                    <Badge variant={tx.type === "in" ? "success" : "destructive"}>
                      {tx.type === "in" ? "IN" : "OUT"}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{tx.quantity}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-xs sm:text-sm hidden sm:table-cell">{tx.customer_name}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No recent activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
