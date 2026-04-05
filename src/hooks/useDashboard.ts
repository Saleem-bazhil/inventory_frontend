import { useState, useEffect, useCallback } from "react";
import { getDashboardStats } from "@/api/dashboard";
import type { DashboardResponse } from "@/api/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardStats();
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
