import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/workflow/StatusBadge";
import { formatDuration } from "@/lib/workflow";
import { ROLE_LABELS } from "@/types";
import type { SLABreachAlert } from "@/types";

interface SLABreachFeedProps {
  alerts: SLABreachAlert[];
  onDismiss?: (id: string) => void;
}

export function SLABreachFeed({ alerts, onDismiss }: SLABreachFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              SLA Breaches
            </CardTitle>
            {alerts.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                {alerts.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/50 mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                All tickets on track
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                No SLA breaches detected
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence initial={false}>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50",
                      "bg-red-50 dark:bg-red-950/30 p-3",
                    )}
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {alert.ticket_number}
                        </span>
                        <StatusBadge status={alert.current_status} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span>
                          {ROLE_LABELS[alert.responsible_role]}
                          {alert.responsible_user && (
                            <span className="text-slate-400 dark:text-slate-500">
                              {" "}({alert.responsible_user})
                            </span>
                          )}
                        </span>
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          +{formatDuration(alert.delay_minutes)} overdue
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Entered {formatTimeAgo(alert.entered_at)}
                      </p>
                    </div>
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
                        aria-label="Dismiss alert"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
