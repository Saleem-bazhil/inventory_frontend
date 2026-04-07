import { cn } from "@/lib/utils";
import { formatDuration, SLA_HEALTH_CONFIG } from "@/lib/workflow";
import { Check, AlertTriangle, AlertCircle } from "lucide-react";
import type { SLAHealth } from "@/types";

interface DelayIndicatorProps {
  health: SLAHealth;
  remainingMins?: number | null;
  elapsedMins?: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const ICONS = {
  check: Check,
  "alert-triangle": AlertTriangle,
  "alert-circle": AlertCircle,
} as const;

export function DelayIndicator({
  health,
  remainingMins,
  elapsedMins,
  showLabel = true,
  size = "sm",
  className,
}: DelayIndicatorProps) {
  const config = SLA_HEALTH_CONFIG[health];
  const Icon = ICONS[config.icon];

  const timeText =
    health === "breached" && elapsedMins != null
      ? formatDuration(elapsedMins) + " overdue"
      : remainingMins != null
        ? formatDuration(remainingMins) + " left"
        : null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
        config.bgClass,
        config.textClass,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {showLabel && <span>{config.label}</span>}
      {timeText && <span className="opacity-75">({timeText})</span>}
    </span>
  );
}
