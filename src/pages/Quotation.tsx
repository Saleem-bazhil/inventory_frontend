import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Quotation() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Quotation</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and create quotations.</p>
      </div>

      <Card className="p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">No quotations yet</p>
        <p className="text-sm text-slate-500">Quotation management coming soon.</p>
      </Card>
    </motion.div>
  );
}
