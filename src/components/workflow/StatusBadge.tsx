import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "@/lib/workflow";
import type { TicketStatus } from "@/types";

interface StatusBadgeProps {
  status: TicketStatus;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = "sm", showDot = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
        config.bgClass,
        config.textClass,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className,
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotClass)} />}
      {config.label}
    </span>
  );
}
