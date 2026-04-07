import { useState, useEffect, useCallback } from "react";
import type { Ticket, TimelineEntry, AvailableTransition } from "@/types";
import { getTicket, getTicketTimeline, getAvailableTransitions } from "@/api/tickets";

interface UseTicketReturn {
  ticket: Ticket | null;
  timeline: TimelineEntry[];
  transitions: AvailableTransition[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTicket(id: number | string | undefined): UseTicketReturn {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [transitions, setTransitions] = useState<AvailableTransition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [t, tl, tr] = await Promise.all([
        getTicket(id),
        getTicketTimeline(id),
        getAvailableTransitions(id),
      ]);
      setTicket(t);
      setTimeline(tl);
      setTransitions(tr);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ticket, timeline, transitions, loading, error, refetch: fetch };
}
