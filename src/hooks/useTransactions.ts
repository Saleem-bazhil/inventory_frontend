import { useState, useEffect, useCallback } from "react";
import type { Transaction, PaginationMeta, TransactionQueryParams } from "@/types";
import { getTransactions } from "@/api/transactions";

export function useTransactions(params?: TransactionQueryParams) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    per_page: 8,
    pages: 0,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions(params);
      setData(res.items);
      setPagination({ total: res.total, page: res.page, per_page: res.per_page, pages: res.pages });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } }).response?.data;
      const msg = typeof data === "object" && data !== null
        ? ((data as Record<string, unknown>).detail as string) ?? "Failed to fetch transactions"
        : "Failed to fetch transactions";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, pagination, refetch: fetch };
}
