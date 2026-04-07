import { useState, useEffect, useCallback } from "react";
import type { DelayHeatmapCell } from "@/types";
import { getDelayHeatmap } from "@/api/dashboard";

export function useDelayHeatmap(period = "30d") {
  const [data, setData] = useState<DelayHeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDelayHeatmap(period);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch delay heatmap");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
