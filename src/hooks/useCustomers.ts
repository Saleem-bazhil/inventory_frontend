import { useState, useEffect, useCallback } from "react";
import type { Customer, PaginationMeta, CustomerQueryParams } from "@/types";
import { getCustomers } from "@/api/customers";

export function useCustomers(params?: CustomerQueryParams) {
  const [data, setData] = useState<Customer[]>([]);
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
      const res = await getCustomers(params);
      setData(res.items);
      setPagination({ total: res.total, page: res.page, per_page: res.per_page, pages: res.pages });
    } catch (err: unknown) {
      const data = (err as { response?: { data?: unknown } }).response?.data;
      const msg = typeof data === "object" && data !== null
        ? ((data as Record<string, unknown>).detail as string) ?? "Failed to fetch customers"
        : "Failed to fetch customers";
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
