import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Package, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialsToolbar } from "@/components/materials/MaterialsToolbar";
import { MaterialsTable } from "@/components/materials/MaterialsTable";
import { MaterialFormDialog } from "@/components/materials/MaterialFormDialog";
import { DeleteConfirmDialog } from "@/components/materials/DeleteConfirmDialog";
import { useMaterials } from "@/hooks/useMaterials";
import { createMaterial, updateMaterial, deleteMaterial } from "@/api/materials";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import { REGION_LABELS } from "@/types";
import type { Material } from "@/types";
import type { MaterialFilters } from "@/api/materials";

export default function Materials() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [callStatus, setCallStatus] = useState("all");
  const [region, setRegion] = useState("all");
  const [ordering, setOrdering] = useState("-created_at");

  const user = useAuthStore((s) => s.user);
  const debouncedSearch = useDebounce(search, 400);

  const filters = useMemo<MaterialFilters>(() => ({
    search: debouncedSearch || undefined,
    service_type: serviceType !== "all" ? serviceType : undefined,
    call_status: callStatus !== "all" ? callStatus : undefined,
    region: region !== "all" ? region : undefined,
    ordering,
  }), [debouncedSearch, serviceType, callStatus, region, ordering]);

  const { data, loading, error, pagination, refetch } = useMaterials(filters);

  const hasActiveFilters = serviceType !== "all" || callStatus !== "all" || region !== "all" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setServiceType("all");
    setCallStatus("all");
    setRegion("all");
  };

  const handleSort = (field: string) => {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedMaterial) {
        await updateMaterial(selectedMaterial.id, formData);
        toast({ title: "Material updated successfully" });
      } else {
        await createMaterial(formData);
        toast({ title: "Material created successfully" });
      }
      setFormOpen(false);
      setSelectedMaterial(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error saving material",
        description: err.response?.data?.detail || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;
    try {
      await deleteMaterial(selectedMaterial.id);
      toast({ title: "Material deleted successfully" });
      setDeleteOpen(false);
      setSelectedMaterial(null);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error deleting material",
        description: err.response?.data?.detail || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">Failed to load materials</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">CSO Entry</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {user?.role === "super_admin"
            ? "Viewing all regions"
            : user?.region
              ? `Region: ${REGION_LABELS[user.region]}`
              : "Manage your inventory materials."}
        </p>
      </div>

      <MaterialsToolbar
        search={search}
        onSearchChange={setSearch}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
        callStatus={callStatus}
        onCallStatusChange={setCallStatus}
        region={region}
        onRegionChange={setRegion}
        onAdd={() => { setSelectedMaterial(null); setFormOpen(true); }}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">
            {hasActiveFilters ? "No materials match your filters" : "No materials found"}
          </p>
          <p className="text-sm text-slate-500 mb-4">
            {hasActiveFilters ? "Try adjusting your filters." : "Add your first material to get started."}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          ) : (
            <Button onClick={() => { setSelectedMaterial(null); setFormOpen(true); }}>Add Material</Button>
          )}
        </Card>
      ) : (
        <MaterialsTable
          data={data}
          loading={loading}
          pagination={pagination}
          onSort={handleSort}
          onEdit={(m) => { setSelectedMaterial(m); setFormOpen(true); }}
          onDelete={(m) => { setSelectedMaterial(m); setDeleteOpen(true); }}
          onPageChange={() => {}}
        />
      )}

      <MaterialFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setSelectedMaterial(null); }}
        material={selectedMaterial}
        onSubmit={handleSubmit}
        onVerifiedSubmit={() => { setFormOpen(false); setSelectedMaterial(null); refetch(); }}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { setDeleteOpen(open); if (!open) setSelectedMaterial(null); }}
        title={`Delete ${selectedMaterial?.case_id}?`}
        description="This action cannot be undone. This will permanently delete the material record."
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
