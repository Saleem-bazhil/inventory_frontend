import { useState, useEffect, useCallback } from "react";
import type { PartRequest, PaginationMeta, PartRequestFilters } from "@/types";
import { getPartRequests } from "@/api/partRequests";

export function usePartRequests(filters?: PartRequestFilters) {
  const [data, setData] = useState<PartRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0, page: 1, per_page: 20, pages: 1,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPartRequests(filters);
      setData(res.items);
      setPagination({ total: res.total, page: res.page, per_page: res.per_page, pages: res.pages });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch part requests");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, pagination, refetch: fetch };
}
