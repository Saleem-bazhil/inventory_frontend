import { useState, useEffect, useCallback } from "react";
import type { EngineerPerformance } from "@/types";
import { getEngineerPerformance } from "@/api/dashboard";

export function useEngineerPerformance() {
  const [data, setData] = useState<EngineerPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEngineerPerformance();
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch engineer performance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
