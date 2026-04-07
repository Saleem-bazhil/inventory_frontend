import client from "./client";
import { buildParams } from "@/lib/utils";
import type { Invoice, InvoiceFilters, PaginatedResponse } from "@/types";

export async function getInvoices(filters?: InvoiceFilters): Promise<PaginatedResponse<Invoice>> {
  const params = buildParams(filters ?? {});
  const { data } = await client.get<PaginatedResponse<Invoice>>("/invoices/", { params });
  return data;
}

export async function getInvoice(id: number | string): Promise<Invoice> {
  const { data } = await client.get<Invoice>(`/invoices/${id}/`);
  return data;
}

export async function createInvoice(payload: Record<string, unknown>): Promise<Invoice> {
  const { data } = await client.post<Invoice>("/invoices/", payload);
  return data;
}

export async function sendInvoice(id: number | string): Promise<Invoice> {
  const { data } = await client.post<Invoice>(`/invoices/${id}/send/`);
  return data;
}

export async function markInvoicePaid(
  id: number | string,
  payload: { payment_method: string; paid_amount: number },
): Promise<Invoice> {
  const { data } = await client.post<Invoice>(`/invoices/${id}/mark-paid/`, payload);
  return data;
}
