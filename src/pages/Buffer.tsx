import { motion } from "framer-motion";
import { Layers, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BufferToolbar } from "@/components/buffer/BufferToolbar";
import { BufferTable } from "@/components/buffer/BufferTable";
import { useBuffer } from "@/hooks/useBuffer";
import { toast } from "@/components/ui/use-toast";
import { releaseBufferEntry } from "@/api/buffer";
import { extractApiError } from "@/api/client";

export default function Buffer() {
  const { data, loading, error, refetch } = useBuffer();

  const handleRelease = async (id: number | string) => {
    try {
      await releaseBufferEntry(id);
      toast({ title: "Buffer entry released successfully" });
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
            Failed to load buffer entries
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
          Buffer
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage buffer stock reserves.
        </p>
      </div>

      <BufferToolbar onAdd={() => {}} />

      {!loading && data.length === 0 ? (
        <Card className="p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-800 dark:text-slate-100 font-medium mb-1">
            No buffer stock
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Reserve buffer stock from inventory for specific tickets.
          </p>
          <Button onClick={() => {}}>Add Buffer Entry</Button>
        </Card>
      ) : (
        <BufferTable data={data} loading={loading} onRelease={handleRelease} />
      )}
    </motion.div>
  );
}
