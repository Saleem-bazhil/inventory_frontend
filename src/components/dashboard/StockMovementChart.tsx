import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StockMovementChartProps {
  data: { month: string; inflow: number; outflow: number }[];
}

export function StockMovementChart({ data }: StockMovementChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: "#94A3B8" }} />
              <YAxis className="text-xs" tick={{ fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="inflow"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: "#22C55E", r: 4 }}
                name="Inflow"
              />
              <Line
                type="monotone"
                dataKey="outflow"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: "#4F46E5", r: 4 }}
                name="Outflow"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
