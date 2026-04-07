import client from "./client";
import { buildParams } from "@/lib/utils";
import type { PurchaseOrder, POFilters, PaginatedResponse } from "@/types";

export async function getPurchaseOrders(filters?: POFilters): Promise<PaginatedResponse<PurchaseOrder>> {
  const params = buildParams(filters ?? {});
  const { data } = await client.get<PaginatedResponse<PurchaseOrder>>("/purchase-orders/", { params });
  return data;
}

export async function getPurchaseOrder(id: number | string): Promise<PurchaseOrder> {
  const { data } = await client.get<PurchaseOrder>(`/purchase-orders/${id}/`);
  return data;
}

export async function createPurchaseOrder(payload: Record<string, unknown>): Promise<PurchaseOrder> {
  const { data } = await client.post<PurchaseOrder>("/purchase-orders/", payload);
  return data;
}

export async function updatePurchaseOrder(id: number | string, payload: Record<string, unknown>): Promise<PurchaseOrder> {
  const { data } = await client.put<PurchaseOrder>(`/purchase-orders/${id}/`, payload);
  return data;
}

export async function sendPurchaseOrder(id: number | string): Promise<PurchaseOrder> {
  const { data } = await client.post<PurchaseOrder>(`/purchase-orders/${id}/send/`);
  return data;
}

export async function receivePurchaseOrder(
  id: number | string,
  items: { po_item_id: number; received_qty: number }[],
): Promise<PurchaseOrder> {
  const { data } = await client.post<PurchaseOrder>(`/purchase-orders/${id}/receive/`, { items });
  return data;
}
