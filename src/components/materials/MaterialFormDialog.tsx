import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { materialSchema, type MaterialFormData } from "@/lib/validations";
import type { Material } from "@/types";

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material | null;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  loading?: boolean;
}

export function MaterialFormDialog({ open, onOpenChange, material, onSubmit, loading }: MaterialFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        sku: material.sku,
        category: material.category,
        stock: material.stock,
        min_stock: material.min_stock,
        unit: material.unit,
        unit_price: material.unit_price,
      });
    } else {
      reset({ name: "", sku: "", category: "Raw Material", stock: 0, min_stock: 0, unit: "pcs", unit_price: 0 });
    }
  }, [material, open, reset]);

  const onFormSubmit = async (data: MaterialFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{material ? "Edit Material" : "Add Material"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Material name" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input {...register("sku")} placeholder="SKU-001" />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={watch("category")} onValueChange={(v) => setValue("category", v as MaterialFormData["category"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                  <SelectItem value="Finished Good">Finished Good</SelectItem>
                  <SelectItem value="Component">Component</SelectItem>
                  <SelectItem value="Consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={watch("unit")} onValueChange={(v) => setValue("unit", v as MaterialFormData["unit"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="liters">liters</SelectItem>
                  <SelectItem value="meters">meters</SelectItem>
                  <SelectItem value="boxes">boxes</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" {...register("stock")} />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Min Stock</Label>
              <Input type="number" {...register("min_stock")} />
              {errors.min_stock && <p className="text-xs text-red-500">{errors.min_stock.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Unit Price</Label>
              <Input type="number" step="0.01" {...register("unit_price")} />
              {errors.unit_price && <p className="text-xs text-red-500">{errors.unit_price.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : material ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
