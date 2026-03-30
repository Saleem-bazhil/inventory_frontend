import client from "./client";
import type { Material, PaginatedResponse, MaterialQueryParams } from "@/types";

export async function getMaterials(params?: MaterialQueryParams): Promise<PaginatedResponse<Material>> {
  const { data } = await client.get<PaginatedResponse<Material>>("/materials", { params });
  return data;
}

export async function getMaterial(id: string): Promise<Material> {
  const { data } = await client.get<Material>(`/materials/${id}`);
  return data;
}

export async function createMaterial(payload: Partial<Material>): Promise<Material> {
  const { data } = await client.post<Material>("/materials", payload);
  return data;
}

export async function updateMaterial(id: string, payload: Partial<Material>): Promise<Material> {
  const { data } = await client.put<Material>(`/materials/${id}`, payload);
  return data;
}

export async function deleteMaterial(id: string): Promise<void> {
  await client.delete(`/materials/${id}`);
}
