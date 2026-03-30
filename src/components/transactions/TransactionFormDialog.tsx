import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { mockMaterials, mockCustomers } from "@/lib/mock-data";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  loading?: boolean;
}

export function TransactionFormDialog({ open, onOpenChange, onSubmit, loading }: TransactionFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "in", date: new Date().toISOString().split("T")[0] },
  });

  useEffect(() => {
    if (open) {
      reset({ type: "in", material_id: "", customer_id: "", quantity: 0, date: new Date().toISOString().split("T")[0], notes: "" });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={watch("type")} onValueChange={(v) => setValue("type", v as "in" | "out")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Inflow (IN)</SelectItem>
                <SelectItem value="out">Outflow (OUT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Material</Label>
            <Select value={watch("material_id")} onValueChange={(v) => setValue("material_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
              <SelectContent>
                {mockMaterials.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.material_id && <p className="text-xs text-red-500">{errors.material_id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={watch("customer_id")} onValueChange={(v) => setValue("customer_id", v)}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {mockCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer_id && <p className="text-xs text-red-500">{errors.customer_id.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" {...register("quantity")} />
              {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <textarea
              {...register("notes")}
              rows={3}
              className="flex w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
              placeholder="Optional notes..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
