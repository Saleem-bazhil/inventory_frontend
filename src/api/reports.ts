import client from "./client";
import type { ReportSummary, CategoryBreakdown } from "@/types";

export async function getSummary(): Promise<ReportSummary> {
  const { data } = await client.get<ReportSummary>("/reports/summary");
  return data;
}

export async function getByCategory(): Promise<CategoryBreakdown[]> {
  const { data } = await client.get<CategoryBreakdown[]>("/reports/by-category");
  return data;
}
