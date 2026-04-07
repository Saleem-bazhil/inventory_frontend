import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { transitionTicket } from "@/api/tickets";
import client from "@/api/client";
import { extractApiError } from "@/api/client";
import { toast } from "@/components/ui/use-toast";
import { UserCheck, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Engineer {
  id: number;
  full_name: string;
  role: string;
}

interface AssignEngineerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: number;
  onSuccess: () => void;
}

export function AssignEngineerDialog({
  open,
  onOpenChange,
  ticketId,
  onSuccess,
}: AssignEngineerDialogProps) {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loadingEngineers, setLoadingEngineers] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      return;
    }

    const fetchEngineers = async () => {
      setLoadingEngineers(true);
      try {
        const { data } = await client.get<Engineer[]>("/users/engineers/");
        setEngineers(data);
      } catch (err) {
        toast({
          title: "Failed to load engineers",
          description: extractApiError(err),
          variant: "destructive",
        });
      } finally {
        setLoadingEngineers(false);
      }
    };

    fetchEngineers();
  }, [open]);

  const handleAssign = async () => {
    if (!selectedId) {
      toast({ title: "Please select an engineer", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await transitionTicket(ticketId, {
        to_status: "assigned",
        assignee_id: selectedId,
      });
      toast({ title: "Engineer assigned successfully" });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast({ title: extractApiError(err), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEngineer = engineers.find((e) => e.id === selectedId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Assign Engineer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label>Select an engineer</Label>

          {loadingEngineers ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-xl" />
              ))}
            </div>
          ) : engineers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No engineers available</p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
              {engineers.map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => setSelectedId(eng.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    selectedId === eng.id
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-700"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <span>{eng.full_name}</span>
                  {selectedId === eng.id && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={submitting || !selectedId || loadingEngineers}
            className="gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {selectedEngineer ? `Assign to ${selectedEngineer.full_name}` : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
