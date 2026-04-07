import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketDetailPanel } from "@/components/tickets/TicketDetailPanel";
import { useTicket } from "@/hooks/useTicket";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ticket, timeline, transitions, loading, error, refetch } = useTicket(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">
            {error || "Ticket not found"}
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={() => navigate("/cso-entry")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tickets
            </Button>
            {error && <Button onClick={refetch}>Try Again</Button>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/cso-entry")} className="mb-2 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tickets
        </Button>
      </div>

      <TicketDetailPanel
        ticket={ticket}
        timeline={timeline}
        transitions={transitions}
        onTransitioned={refetch}
      />
    </motion.div>
  );
}
