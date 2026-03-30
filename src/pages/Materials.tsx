import { useState } from "react";
import { motion } from "framer-motion";
import { Package, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialsToolbar } from "@/components/materials/MaterialsToolbar";
import { MaterialsTable } from "@/components/materials/MaterialsTable";
import { MaterialFormDialog } from "@/components/materials/MaterialFormDialog";
import { DeleteConfirmDialog } from "@/components/materials/DeleteConfirmDialog";
import { useMaterials } from "@/hooks/useMaterials";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/ui/use-toast";
import type { Material } from "@/types";


export default function Materials() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, loading, error, pagination, refetch } = useMaterials({
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    page,
    per_page: 8,
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async () => {
    toast({ title: selectedMaterial ? "Material updated successfully" : "Material created successfully" });
    setFormOpen(false);
    setSelectedMaterial(null);
    refetch();
  };

  const handleDelete = () => {
    toast({ title: "Material deleted successfully" });
    setDeleteOpen(false);
    setSelectedMaterial(null);
    refetch();
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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Materials</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your inventory materials.</p>
      </div>

      <MaterialsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onAdd={() => { setSelectedMaterial(null); setFormOpen(true); }}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">No materials found</p>
          <p className="text-sm text-slate-500 mb-4">Add your first material to get started.</p>
          <Button onClick={() => { setSelectedMaterial(null); setFormOpen(true); }}>Add Material</Button>
        </Card>
      ) : (
        <MaterialsTable
          data={data}
          loading={loading}
          pagination={pagination}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(m) => { setSelectedMaterial(m); setFormOpen(true); }}
          onDelete={(m) => { setSelectedMaterial(m); setDeleteOpen(true); }}
          onPageChange={setPage}
        />
      )}

      <MaterialFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setSelectedMaterial(null); }}
        material={selectedMaterial}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { setDeleteOpen(open); if (!open) setSelectedMaterial(null); }}
        title={`Delete ${selectedMaterial?.name}?`}
        description="This action cannot be undone. This will permanently delete the material."
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
