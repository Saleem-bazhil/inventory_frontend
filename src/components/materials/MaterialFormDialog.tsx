import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
  });

  useEffect(() => {
    if (material) {
      reset({
        cust_name: material.cust_name,
        cust_contact: material.cust_contact,
        case_id: material.case_id,
        so_number: material.so_number,
        warranty: material.warranty,
        issue: material.issue,
        product: material.product,
        model_name: material.model_name,
        part_number: material.part_number,
        serial_number: material.serial_number,
        qty: material.qty,
        hp_part_in_date: material.hp_part_in_date || null,
        aging: material.aging || null,
        out_date: material.out_date || null,
        collector: material.collector || "",
        in_date: material.in_date || null,
        receiver: material.receiver || "",
        used_part: material.used_part,
        remarks: material.remarks || "",
      });
    } else {
      reset({
        cust_name: "", cust_contact: "", case_id: "", so_number: "", warranty: false,
        issue: "", product: "", model_name: "", part_number: "", serial_number: "",
        qty: 1, hp_part_in_date: null, aging: null, out_date: null, collector: "",
        in_date: null, receiver: "", used_part: false, remarks: ""
      });
    }
  }, [material, open, reset]);

  const onFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{material ? "Edit Material Record" : "Add New Material"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <span className="hidden sm:inline">General Info</span>
                <span className="sm:hidden">General</span>
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2">
                <span className="hidden sm:inline">Product Details</span>
                <span className="sm:hidden">Product</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <span className="hidden sm:inline">Tracking & Dates</span>
                <span className="sm:hidden">Tracking</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 min-h-[300px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input {...register("cust_name")} placeholder="e.g. Acme Corp" />
                  {errors.cust_name && <p className="text-xs text-red-500">{errors.cust_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Customer Contact</Label>
                  <Input {...register("cust_contact")} placeholder="Phone or Email" />
                  {errors.cust_contact && <p className="text-xs text-red-500">{errors.cust_contact.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Case ID</Label>
                  <Input {...register("case_id")} placeholder="CASE-123456" />
                  {errors.case_id && <p className="text-xs text-red-500">{errors.case_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>SO Number</Label>
                  <Input {...register("so_number")} placeholder="SO-789012" />
                  {errors.so_number && <p className="text-xs text-red-500">{errors.so_number.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Reported Issue</Label>
                  <Input {...register("issue")} placeholder="Briefly describe the defect or issue..." />
                  {errors.issue && <p className="text-xs text-red-500">{errors.issue.message}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Remarks / Internal Notes</Label>
                  <Input {...register("remarks")} placeholder="Additional notes..." />
                  {errors.remarks && <p className="text-xs text-red-500">{errors.remarks.message}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="product" className="space-y-4 min-h-[300px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product / Category</Label>
                  <Input {...register("product")} placeholder="e.g. Laptop, Server" />
                  {errors.product && <p className="text-xs text-red-500">{errors.product.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Model Name</Label>
                  <Input {...register("model_name")} placeholder="EliteBook 840 G8" />
                  {errors.model_name && <p className="text-xs text-red-500">{errors.model_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Part Number</Label>
                  <Input {...register("part_number")} placeholder="PN-00000" />
                  {errors.part_number && <p className="text-xs text-red-500">{errors.part_number.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input {...register("serial_number")} placeholder="SN-00000" />
                  {errors.serial_number && <p className="text-xs text-red-500">{errors.serial_number.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" {...register("qty", { valueAsNumber: true })} />
                  {errors.qty && <p className="text-xs text-red-500">{errors.qty.message}</p>}
                </div>
                
                <div className="space-y-4 pt-4 sm:col-span-2 grid grid-cols-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="warranty" {...register("warranty")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <div className="leading-none">
                      <Label htmlFor="warranty" className="font-medium cursor-pointer">Under Warranty</Label>
                      <p className="text-xs text-slate-500 mt-1">Is the item covered by warranty?</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="used_part" {...register("used_part")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <div className="leading-none">
                      <Label htmlFor="used_part" className="font-medium cursor-pointer">Used Part</Label>
                      <p className="text-xs text-slate-500 mt-1">Check if this is a refurbished component</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4 min-h-[300px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>HP Part In Date</Label>
                  <Input type="date" {...register("hp_part_in_date")} />
                  {errors.hp_part_in_date && <p className="text-xs text-red-500">{errors.hp_part_in_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Aging (Days)</Label>
                  <Input type="number" {...register("aging", { valueAsNumber: true })} />
                  {errors.aging && <p className="text-xs text-red-500">{errors.aging.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>In Date</Label>
                  <Input type="date" {...register("in_date")} />
                  {errors.in_date && <p className="text-xs text-red-500">{errors.in_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Receiver</Label>
                  <Input {...register("receiver")} placeholder="Name of receiving agent" />
                  {errors.receiver && <p className="text-xs text-red-500">{errors.receiver.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Out Date</Label>
                  <Input type="date" {...register("out_date")} />
                  {errors.out_date && <p className="text-xs text-red-500">{errors.out_date.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Collector</Label>
                  <Input {...register("collector")} placeholder="Name of collecting agent" />
                  {errors.collector && <p className="text-xs text-red-500">{errors.collector.message}</p>}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="w-24">
              {loading ? "Saving..." : material ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
