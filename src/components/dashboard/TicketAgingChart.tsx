import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";
import type { TicketAgingBucket } from "@/types";

interface TicketAgingChartProps {
  data: TicketAgingBucket[];
}

// Color buckets: earlier ranges are green, middle are amber, later are red
const BUCKET_COLORS: Record<string, string> = {
  "0-4h": "#22c55e",
  "4-8h": "#84cc16",
  "8-24h": "#f59e0b",
  "1-2d": "#f97316",
  "2-5d": "#ef4444",
  "5d+": "#dc2626",
};

function getBucketColor(range: string, index: number, total: number): string {
  // Use explicit mapping first, fall back to position-based
  if (BUCKET_COLORS[range]) return BUCKET_COLORS[range];
  const ratio = total > 1 ? index / (total - 1) : 0;
  if (ratio < 0.33) return "#22c55e";
  if (ratio < 0.66) return "#f59e0b";
  return "#ef4444";
}

interface CustomTooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-3 text-sm">
      <p className="font-medium text-slate-800 dark:text-slate-100 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-slate-600 dark:text-slate-400">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function TicketAgingChart({ data }: TicketAgingChartProps) {
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
            <Timer className="w-5 h-5 text-slate-400" />
            Ticket Aging
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="flex items-center justify-center h-[300px] text-slate-400 dark:text-slate-500">
              <p className="text-sm">No data</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barCategoryGap="20%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis
                    dataKey="range"
                    className="text-xs"
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "#94A3B8" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" name="Total" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.range}
                        fill={getBucketColor(entry.range, index, data.length)}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="breached"
                    name="Breached"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                    fillOpacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
