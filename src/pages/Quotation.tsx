import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuotationsToolbar } from "@/components/quotations/QuotationsToolbar";
import { QuotationsTable } from "@/components/quotations/QuotationsTable";
import { useQuotations } from "@/hooks/useQuotations";
import { toast } from "@/components/ui/use-toast";
import { sendQuotation, recordCustomerResponse } from "@/api/quotations";
import { extractApiError } from "@/api/client";
import type { QuotationStatus } from "@/types";

export default function Quotation() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      status: status !== "all" ? (status as QuotationStatus) : undefined,
      page,
      per_page: 20,
    }),
    [status, page],
  );

  const { data, loading, error, pagination, refetch } = useQuotations(filters);

  const hasActiveFilters = status !== "all";

  const handleClearFilters = () => {
    setStatus("all");
    setPage(1);
  };

  const handleSend = async (id: number | string) => {
    try {
      await sendQuotation(id);
      toast({ title: "Quotation sent successfully" });
      refetch();
    } catch (err) {
      toast({ title: extractApiError(err), variant: "destructive" });
    }
  };

  const handleRecordResponse = async (
    id: number | string,
    response: "approved" | "rejected",
    reason?: string,
  ) => {
    try {
      await recordCustomerResponse(id, { response, reason });
      toast({
        title:
          response === "approved"
            ? "Customer approved the quotation"
            : "Customer rejected the quotation",
      });
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
            Failed to load quotations
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
          Quotations
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Create and manage quotations for service tickets.
        </p>
      </div>

      <QuotationsToolbar
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        onAdd={() => {}}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">
            No quotations yet
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Quotations will appear here when created from approved part requests.
          </p>
        </Card>
      ) : (
        <QuotationsTable
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onSend={handleSend}
          onRecordResponse={handleRecordResponse}
        />
      )}
    </motion.div>
  );
}
