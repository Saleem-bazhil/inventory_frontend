import client from "./client";
import type { Material } from "@/types";

export interface MaterialFilters {
  search?: string;
  service_type?: string;
  call_status?: string;
  region?: string;
  ordering?: string;
}

export async function getMaterials(filters?: MaterialFilters): Promise<Material[]> {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.service_type) params.service_type = filters.service_type;
  if (filters?.call_status) params.call_status = filters.call_status;
  if (filters?.region) params.region = filters.region;
  if (filters?.ordering) params.ordering = filters.ordering;

  const { data } = await client.get<Material[]>("/material-tracks/", { params });
  return data;
}

export async function getMaterial(id: number | string): Promise<Material> {
  const { data } = await client.get<Material>(`/material-tracks/${id}/`);
  return data;
}

export async function createMaterial(payload: Partial<Material>): Promise<Material> {
  const { data } = await client.post<Material>("/material-tracks/", payload);
  return data;
}

export async function updateMaterial(id: number | string, payload: Partial<Material>): Promise<Material> {
  const { data } = await client.put<Material>(`/material-tracks/${id}/`, payload);
  return data;
}

export async function deleteMaterial(id: number | string): Promise<void> {
  await client.delete(`/material-tracks/${id}/`);
}

// --- OTP endpoints ---

export async function sendOTP(phone: string): Promise<void> {
  await client.post("/material-tracks/send-otp/", { phone });
}

export async function verifyOTPAndSubmit(
  phone: string,
  otp: string,
  formData: Record<string, unknown>,
): Promise<Material> {
  const { data } = await client.post<Material>("/material-tracks/verify-and-submit/", {
    phone,
    otp,
    form_data: formData,
  });
  return data;
}
