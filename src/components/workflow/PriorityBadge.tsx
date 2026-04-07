import { cn } from "@/lib/utils";
import { PRIORITY_CONFIG } from "@/lib/workflow";
import type { TicketPriority } from "@/types";

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: "sm" | "md";
  className?: string;
}

export function PriorityBadge({ priority, size = "sm", className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
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
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotClass)} />
      {config.label}
    </span>
  );
}
