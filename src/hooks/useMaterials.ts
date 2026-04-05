import { useState, useEffect, useCallback } from "react";
import type { Material, PaginationMeta } from "@/types";
import { getMaterials } from "@/api/materials";
import type { MaterialFilters } from "@/api/materials";

export function useMaterials(filters?: MaterialFilters) {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    per_page: 100,
    pages: 1,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const responseData = await getMaterials(filters);
      setData(responseData);
      setPagination({
        total: responseData.length,
        page: 1,
        per_page: responseData.length || 1,
        pages: 1,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, pagination, refetch: fetch };
}
