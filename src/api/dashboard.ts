import client from "./client";
import type {
  DashboardOverview,
  RegionStats,
  DelayHeatmapCell,
  EngineerPerformance,
  ManagerApprovalMetrics,
  TicketAgingBucket,
  SLABreachAlert,
} from "@/types";

export interface DashboardResponse {
  overview: DashboardOverview;
  regions: RegionStats[];
}

export async function getDashboardStats(region?: string): Promise<DashboardResponse> {
  const params: Record<string, string> = {};
  if (region) params.region = region;
  const { data } = await client.get<DashboardResponse>("/dashboard/overview/", { params });
  return data;
}

export async function getSLABreaches(): Promise<SLABreachAlert[]> {
  const { data } = await client.get<SLABreachAlert[]>("/dashboard/sla-breaches/");
  return data;
}

export async function getDelayHeatmap(period = "30d"): Promise<DelayHeatmapCell[]> {
  const { data } = await client.get<DelayHeatmapCell[]>("/dashboard/delay-heatmap/", { params: { period } });
  return data;
}

export async function getEngineerPerformance(): Promise<EngineerPerformance[]> {
  const { data } = await client.get<EngineerPerformance[]>("/dashboard/engineer-performance/");
  return data;
}

export async function getManagerApprovals(): Promise<ManagerApprovalMetrics[]> {
  const { data } = await client.get<ManagerApprovalMetrics[]>("/dashboard/manager-approvals/");
  return data;
}

export async function getTicketAging(): Promise<TicketAgingBucket[]> {
  const { data } = await client.get<TicketAgingBucket[]>("/dashboard/ticket-aging/");
  return data;
}

export async function getRegionComparison(): Promise<RegionStats[]> {
  const { data } = await client.get<RegionStats[]>("/dashboard/region-comparison/");
  return data;
}
