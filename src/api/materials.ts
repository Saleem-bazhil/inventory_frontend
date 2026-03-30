import client from "./client";
import type { Material } from "@/types";

export async function getMaterials(): Promise<Material[]> {
  const { data } = await client.get<Material[]>("/material-tracks/");
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
