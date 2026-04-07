import { useState, useEffect, useCallback } from "react";
import type { SLABreachAlert } from "@/types";
import { getSLABreaches } from "@/api/dashboard";
import { useWorkflowStore } from "@/store/workflowStore";

export function useSLABreaches() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setBreachAlerts = useWorkflowStore((s) => s.setBreachAlerts);
  const breachAlerts = useWorkflowStore((s) => s.breachAlerts);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSLABreaches();
      setBreachAlerts(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch SLA breaches");
    } finally {
      setLoading(false);
    }
  }, [setBreachAlerts]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data: breachAlerts, loading, error, refetch: fetch };
}
