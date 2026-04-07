import { useState, useEffect, useCallback } from "react";
import type { BufferEntry } from "@/types";
import { getBufferEntries } from "@/api/buffer";

export function useBuffer() {
  const [data, setData] = useState<BufferEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBufferEntries();
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch buffer entries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
