import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionsToolbar } from "@/components/transactions/TransactionsToolbar";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "@/components/ui/use-toast";


export default function Transactions() {
  const [type, setType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const { data, loading, error, pagination, refetch } = useTransactions({
    type: type !== "all" ? (type as "in" | "out") : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    page,
    per_page: 8,
  });

  const handleSubmit = async () => {
    toast({ title: "Transaction created successfully" });
    setFormOpen(false);
    refetch();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-2">Failed to load transactions</p>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transactions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track all inventory movements.</p>
      </div>

      <TransactionsToolbar
        type={type}
        onTypeChange={setType}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        onAdd={() => setFormOpen(true)}
      />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <ArrowUpDown className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">No transactions found</p>
          <p className="text-sm text-slate-500 mb-4">Record your first transaction to get started.</p>
          <Button onClick={() => setFormOpen(true)}>New Transaction</Button>
        </Card>
      ) : (
        <TransactionsTable
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
        />
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </motion.div>
  );
}
