import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { transactionSchema, type TransactionFormData } from "@/lib/validations";
import { mockMaterials, mockCustomers } from "@/lib/mock-data";
import { Plus, ArrowDownLeft, ArrowUpRight, Calendar, Package, User } from "lucide-react";

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
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-zinc-950 shadow-2xl">
        <div className="bg-gradient-to-br from-zinc-900 to-black p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              New Transaction
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Custom Type Selector (Visual Segmented Control) */}
            <div className="p-1 bg-zinc-800/50 rounded-xl flex gap-1 border border-white/5">
              <button
                type="button"
                onClick={() => setValue("type", "in")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  currentType === "in" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-400 hover:text-white"
                }`}
              >
                <ArrowDownLeft size={16} /> Stock IN
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "out")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  currentType === "out" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-zinc-400 hover:text-white"
                }`}
              >
                <ArrowUpRight size={16} /> Stock OUT
              </button>
            </div>

            <div className="grid gap-4">
              {/* Material Selection */}
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2"><Package size={14}/> Material</Label>
                <Select value={watch("material_id")} onValueChange={(v) => setValue("material_id", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-11 focus:ring-emerald-500/50">
                    <SelectValue placeholder="Select inventory item" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {mockMaterials.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="focus:bg-zinc-800">
                        {m.name} <span className="ml-2 text-xs text-zinc-500">({m.stock} {m.unit})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.material_id && <p className="text-[11px] text-rose-500 mt-1 ml-1">{errors.material_id.message}</p>}
              </div>

              {/* Customer Selection */}
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2"><User size={14}/> Customer / Client</Label>
                <Select value={watch("customer_id")} onValueChange={(v) => setValue("customer_id", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-11">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {mockCustomers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grid for Quantity & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400 font-medium">Quantity</Label>
                  <Input 
                    type="number" 
                    {...register("quantity", { valueAsNumber: true })} 
                    className="bg-white/5 border-white/10 rounded-xl h-11 focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 flex items-center gap-2"><Calendar size={14}/> Date</Label>
                  <Input 
                    type="date" 
                    {...register("date")} 
                    className="bg-white/5 border-white/10 rounded-xl h-11 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400">Notes</Label>
              <textarea
                {...register("notes")}
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                placeholder="Any specific details..."
              />
            </div>

            <DialogFooter className="pt-4 flex gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="flex-1 hover:bg-white/5 rounded-xl text-zinc-400"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className={`flex-[2] rounded-xl font-bold transition-all active:scale-95 ${
                    currentType === 'in' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {loading ? "Processing..." : (
                    <span className="flex items-center gap-2">
                        <Plus size={18} /> Add Entry
                    </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}