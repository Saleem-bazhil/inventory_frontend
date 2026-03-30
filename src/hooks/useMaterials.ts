import { useState, useEffect, useCallback } from "react";
import type { Material, PaginationMeta, MaterialQueryParams } from "@/types";
import { mockMaterials } from "@/lib/mock-data";

export function useMaterials(params?: MaterialQueryParams) {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    per_page: 8,
    pages: 0,
  });

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let filtered = [...mockMaterials];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (m) => m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q)
        );
      }
      if (params?.category) {
        filtered = filtered.filter((m) => m.category === params.category);
      }
      if (params?.sort_by) {
        filtered.sort((a, b) => {
          const aVal = a[params.sort_by as keyof Material];
          const bVal = b[params.sort_by as keyof Material];
          if (typeof aVal === "number" && typeof bVal === "number") {
            return params.sort_order === "desc" ? bVal - aVal : aVal - bVal;
          }
          return params.sort_order === "desc"
            ? String(bVal).localeCompare(String(aVal))
            : String(aVal).localeCompare(String(bVal));
        });
      }

      const page = params?.page || 1;
      const perPage = params?.per_page || 8;
      const total = filtered.length;
      const pages = Math.ceil(total / perPage);
      const start = (page - 1) * perPage;
      const paged = filtered.slice(start, start + perPage);

      setData(paged);
      setPagination({ total, page, per_page: perPage, pages });
      setLoading(false);
    }, 300);
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, pagination, refetch: fetch };
}
