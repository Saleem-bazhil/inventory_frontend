import { useState, useEffect, useCallback } from "react";
import type { DashboardStats, ChartData, Transaction } from "@/types";
import { mockChartData, mockTransactions } from "@/lib/mock-data";
import { getMaterials } from "@/api/materials";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [recentActivity, setRecentActivity] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const materials = await getMaterials();
      
      const totalMaterials = materials.length;
      const totalStock = materials.reduce((sum, m) => sum + (Number(m.qty) || 0), 0);
      const lowStockCount = materials.filter(m => (Number(m.qty) || 0) < 5).length;
      
      setStats({
        total_materials: totalMaterials,
        total_stock: totalStock,
        low_stock_count: lowStockCount,
        today_transactions: mockChartData.stock_movement[mockChartData.stock_movement.length - 1]?.inflow || 0,
      });
      
      const sorted = [...materials].sort((a, b) => (Number(b.qty) || 0) - (Number(a.qty) || 0)).slice(0, 5);
      const topMaterials = sorted.map((m) => ({
        name: m.part_number || `Item ${m.id}`,
        stock: Number(m.qty) || 0,
      }));
      
      setCharts({
        stock_movement: mockChartData.stock_movement,
        top_materials: topMaterials
      });
      
      setRecentActivity(mockTransactions.slice(0, 5));
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, charts, recentActivity, loading, error, refetch: fetch };
}
