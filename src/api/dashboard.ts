import client from "./client";
import type { DashboardStats, ChartData, Transaction } from "@/types";

export async function getStats(): Promise<DashboardStats> {
  const { data } = await client.get<DashboardStats>("/dashboard/stats");
  return data;
}

export async function getCharts(): Promise<ChartData> {
  const { data } = await client.get<ChartData>("/dashboard/charts");
  return data;
}

export async function getRecentActivity(): Promise<Transaction[]> {
  const { data } = await client.get<Transaction[]>("/dashboard/recent-activity");
  return data;
}
