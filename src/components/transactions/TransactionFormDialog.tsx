import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { motion } from "framer-motion";
import { Package, User, Calendar, FileText, ArrowUpRight, ArrowDownLeft } from "lucide-react";

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

  const currentType = watch("type");

  useEffect(() => {
    if (open) {
      reset({ type: "in", material_id: "", customer_id: "", quantity: 0, date: new Date().toISOString().split("T")[0], notes: "" });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-slate-50 dark:bg-slate-950 shadow-2xl">
        <div className="bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">New Transaction</DialogTitle>
            <DialogDescription>Add a new inflow or outflow record to your inventory.</DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setValue("type", "in")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                currentType === "in"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" /> Inflow
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "out")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                currentType === "out"
                  ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" /> Outflow
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Package className="w-3 h-3" /> Material ID
              </Label>
              <Input
                {...register("material_id")}
                placeholder="Enter material ID"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-11"
              />
              {errors.material_id && <p className="text-[11px] text-red-500 font-medium pl-1">{errors.material_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <User className="w-3 h-3" /> Customer / Party ID
              </Label>
              <Input
                {...register("customer_id")}
                placeholder="Enter customer ID"
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-11"
              />
              {errors.customer_id && <p className="text-[11px] text-red-500 font-medium pl-1">{errors.customer_id.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</Label>
                <Input
                  type="number"
                  {...register("quantity")}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-11"
                />
                {errors.quantity && <p className="text-[11px] text-red-500 font-medium pl-1">{errors.quantity.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Date
                </Label>
                <Input
                  type="date"
                  {...register("date")}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="w-3 h-3" /> Notes
              </Label>
              <textarea
                {...register("notes")}
                rows={2}
                className="flex w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                placeholder="Add any internal remarks..."
              />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Processing..." : "Create Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
