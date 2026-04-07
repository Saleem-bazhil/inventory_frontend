import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./StatusBadge";
import { transitionTicket } from "@/api/tickets";
import { toast } from "@/components/ui/use-toast";
import { extractApiError } from "@/api/client";
import { ArrowRight, Loader2 } from "lucide-react";
import type { AvailableTransition, TicketStatus } from "@/types";

interface TransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: number;
  transition: AvailableTransition;
  onSuccess: () => void;
}

export function TransitionDialog({
  open,
  onOpenChange,
  ticketId,
  transition,
  onSuccess,
}: TransitionDialogProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (transition.requires_comment && !comment.trim()) {
      toast({ title: "Comment is required for this transition", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await transitionTicket(ticketId, {
        to_status: transition.to_status,
        comment: comment || undefined,
      });
      toast({ title: `Ticket moved to ${transition.label}` });
      setComment("");
      onSuccess();
    } catch (err) {
      toast({ title: extractApiError(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Transition Ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-sm text-slate-500 dark:text-slate-400">Moving to</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <StatusBadge status={transition.to_status as TicketStatus} size="md" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              Comment {transition.requires_comment ? "(required)" : "(optional)"}
            </Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a note about this transition..."
              rows={3}
              className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Transition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
