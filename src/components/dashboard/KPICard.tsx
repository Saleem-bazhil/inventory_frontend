import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  color: "blue" | "green" | "amber" | "purple";
  index?: number;
}

const colorMap = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-600 dark:text-blue-400",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/50",
    text: "text-green-600 dark:text-green-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-600 dark:text-amber-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-600 dark:text-purple-400",
  },
};

export function KPICard({ title, value, icon: Icon, change, color, index = 0 }: KPICardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            {change && (
              <p className={cn("text-sm font-medium", c.text)}>{change}</p>
            )}
          </div>
          <div className={cn("flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0", c.bg)}>
            <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", c.text)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
