import { useState, useEffect, useCallback } from "react";
import type { Transaction, PaginationMeta, TransactionQueryParams } from "@/types";
import { mockTransactions } from "@/lib/mock-data";

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

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      let filtered = [...mockTransactions];

      if (params?.type) {
        filtered = filtered.filter((t) => t.type === params.type);
      }
      if (params?.date_from) {
        filtered = filtered.filter((t) => t.date >= params.date_from!);
      }
      if (params?.date_to) {
        filtered = filtered.filter((t) => t.date <= params.date_to!);
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
