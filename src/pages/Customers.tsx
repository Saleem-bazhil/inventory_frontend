import { useState } from "react";
import { motion } from "framer-motion";
import { Users, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomersToolbar } from "@/components/customers/CustomersToolbar";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";
import { DeleteConfirmDialog } from "@/components/materials/DeleteConfirmDialog";
import { useCustomers } from "@/hooks/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/ui/use-toast";
import type { Customer } from "@/types";


export default function Customers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const debouncedSearch = useDebounce(search);
  const { data, loading, error, pagination, refetch } = useCustomers({
    search: debouncedSearch || undefined,
    page,
    per_page: 8,
  });

  const handleSubmit = async () => {
    toast({ title: selectedCustomer ? "Customer updated successfully" : "Customer created successfully" });
    setFormOpen(false);
    setSelectedCustomer(null);
    refetch();
  };

  const handleDelete = () => {
    toast({ title: "Customer deleted successfully" });
    setDeleteOpen(false);
    setSelectedCustomer(null);
    refetch();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">Failed to load customers</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Customers</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your customer records.</p>
      </div>

      <CustomersToolbar
        search={search}
        onSearchChange={setSearch}
        onAdd={() => { setSelectedCustomer(null); setFormOpen(true); }}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">No customers found</p>
          <p className="text-sm text-slate-500 mb-4">Add your first customer to get started.</p>
          <Button onClick={() => { setSelectedCustomer(null); setFormOpen(true); }}>Add Customer</Button>
        </Card>
      ) : (
        <CustomersTable
          data={data}
          loading={loading}
          pagination={pagination}
          onEdit={(c) => { setSelectedCustomer(c); setFormOpen(true); }}
          onDelete={(c) => { setSelectedCustomer(c); setDeleteOpen(true); }}
          onPageChange={setPage}
        />
      )}

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setSelectedCustomer(null); }}
        customer={selectedCustomer}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => { setDeleteOpen(open); if (!open) setSelectedCustomer(null); }}
        title={`Delete ${selectedCustomer?.name}?`}
        description="This action cannot be undone. This will permanently delete the customer."
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
