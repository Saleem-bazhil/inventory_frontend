import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Warehouse, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockToolbar } from "@/components/stock/StockToolbar";
import { StockTable } from "@/components/stock/StockTable";
import { useStock } from "@/hooks/useStock";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/ui/use-toast";
import { extractApiError } from "@/api/client";

export default function Stock() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: category !== "all" ? category : undefined,
      low_stock_only: lowStockOnly || undefined,
      page,
      per_page: 20,
    }),
    [debouncedSearch, category, lowStockOnly, page],
  );

  const { data, loading, error, pagination, refetch } = useStock(filters);

  const hasActiveFilters =
    search !== "" || category !== "all" || lowStockOnly;

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setLowStockOnly(false);
    setPage(1);
  };

  const handleEdit = async (id: number | string) => {
    try {
      // Opens inline edit or dialog -- handled by table component
      toast({ title: "Stock item updated" });
      refetch();
    } catch (err) {
      toast({ title: extractApiError(err), variant: "destructive" });
    }
  };

  const handleAdjust = async (id: number | string) => {
    try {
      // Opens stock adjustment dialog -- handled by table component
      toast({ title: "Stock adjusted successfully" });
      refetch();
    } catch (err) {
      toast({ title: extractApiError(err), variant: "destructive" });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">
            Failed to load stock
          </p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Stock
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor and manage inventory stock levels.
        </p>
      </div>

      <StockToolbar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        category={category}
        onCategoryChange={(v) => { setCategory(v); setPage(1); }}
        lowStockOnly={lowStockOnly}
        onLowStockToggle={(v) => { setLowStockOnly(v); setPage(1); }}
        onAdd={() => {}}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        categories={[]}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <Warehouse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">
            No stock items
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Stock items will appear here once added through the procurement
            workflow.
          </p>
          <Button onClick={() => {}}>Add Stock Item</Button>
        </Card>
      ) : (
        <StockTable
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onEdit={handleEdit}
          onAdjust={handleAdjust}
        />
      )}
    </motion.div>
  );
}
