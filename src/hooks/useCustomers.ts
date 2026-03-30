import { useState, useEffect, useCallback } from "react";
import type { Customer, PaginationMeta, CustomerQueryParams } from "@/types";
import { mockCustomers } from "@/lib/mock-data";

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

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let filtered = [...mockCustomers];

      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q)
        );
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
