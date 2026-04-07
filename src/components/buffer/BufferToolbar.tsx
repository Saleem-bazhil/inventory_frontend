import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BufferToolbarProps {
  onAdd: () => void;
}

export function BufferToolbar({ onAdd }: BufferToolbarProps) {
  return (
    <div className="flex items-center justify-end mb-6">
      <Button onClick={onAdd} className="gap-2">
        <Plus className="w-4 h-4" />
        Reserve Buffer Stock
      </Button>
    </div>
  );
}
