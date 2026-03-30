import client from "./client";
import type { Transaction, PaginatedResponse, TransactionQueryParams } from "@/types";

export async function getTransactions(params?: TransactionQueryParams): Promise<PaginatedResponse<Transaction>> {
  const { data } = await client.get<PaginatedResponse<Transaction>>("/transactions", { params });
  return data;
}

export async function createTransaction(payload: {
  type: "in" | "out";
  material_id: string;
  customer_id: string;
  quantity: number;
  date: string;
  notes?: string;
}): Promise<Transaction> {
  const { data } = await client.post<Transaction>("/transactions", payload);
  return data;
}
