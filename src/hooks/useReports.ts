import { useState, useEffect, useCallback } from "react";
import type { ReportSummary, CategoryBreakdown } from "@/types";
import { mockReportSummary, mockCategories } from "@/lib/mock-data";

export function useReports() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setSummary(mockReportSummary);
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { summary, categories, loading, error, refetch: fetch };
}
