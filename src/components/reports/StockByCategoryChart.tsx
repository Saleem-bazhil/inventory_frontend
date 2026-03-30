import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryBreakdown } from "@/types";

const COLORS = ["#4F46E5", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444"];

interface StockByCategoryChartProps {
  data: CategoryBreakdown[];
}

export function StockByCategoryChart({ data }: StockByCategoryChartProps) {
  const chartData = data.map((d, i) => ({ ...d, fill: COLORS[i % COLORS.length] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="category" className="text-xs" tick={{ fill: "#94A3B8" }} />
              <YAxis className="text-xs" tick={{ fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="total_stock" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
