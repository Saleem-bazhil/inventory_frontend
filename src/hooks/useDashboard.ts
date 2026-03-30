import { useState, useEffect, useCallback } from "react";
import type { DashboardStats, ChartData, Transaction } from "@/types";
import { mockDashboardStats, mockChartData, mockTransactions } from "@/lib/mock-data";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    // Mock delay
    setTimeout(() => {
      setStats(mockDashboardStats);
      setCharts(mockChartData);
      setRecentActivity(mockTransactions.slice(0, 5));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, charts, recentActivity, loading, error, refetch: fetch };
}
