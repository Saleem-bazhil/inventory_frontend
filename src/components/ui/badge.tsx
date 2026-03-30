import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
        success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
        warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        destructive: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        secondary: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
