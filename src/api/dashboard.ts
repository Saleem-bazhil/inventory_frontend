import client from "./client";

export interface RegionStats {
  region: string | null;
  total_materials: number;
  total_qty: number;
  pending: number;
  closed: number;
  taken_for_service: number;
}

export interface DashboardResponse {
  overall: RegionStats;
  regions: RegionStats[];
}

export async function getDashboardStats(): Promise<DashboardResponse> {
  const { data } = await client.get<DashboardResponse>("/dashboard/stats/");
  return data;
}
