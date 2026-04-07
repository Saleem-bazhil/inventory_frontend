import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatDuration, computeSLAHealth, SLA_HEALTH_CONFIG } from "@/lib/workflow";
import { Clock } from "lucide-react";

interface SLACountdownProps {
  enteredAt: string;
  slaMinutes: number | null;
  className?: string;
}

export function SLACountdown({ enteredAt, slaMinutes, className }: SLACountdownProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => {
      const ms = Date.now() - new Date(enteredAt).getTime();
      setElapsed(Math.max(0, ms / 60000));
    };
    update();
    const interval = setInterval(update, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [enteredAt]);

  if (slaMinutes == null) return null;

  const health = computeSLAHealth(elapsed, slaMinutes);
  const config = SLA_HEALTH_CONFIG[health];
  const remaining = slaMinutes - elapsed;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className={cn("w-4 h-4", config.textClass)} />
      <div className="flex flex-col">
        <span className={cn("text-sm font-medium", config.textClass)}>
          {health === "breached"
            ? `${formatDuration(Math.abs(remaining))} overdue`
            : `${formatDuration(remaining)} remaining`}
        </span>
        <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              health === "on_track" ? "bg-green-500" : health === "warning" ? "bg-amber-500" : "bg-red-500",
            )}
            style={{ width: `${Math.min(100, (elapsed / slaMinutes) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
