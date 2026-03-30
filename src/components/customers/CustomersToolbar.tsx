import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomersToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAdd: () => void;
}

export function CustomersToolbar({ search, onSearchChange, onAdd }: CustomersToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>
      <Button onClick={onAdd} className="w-full sm:w-auto gap-2">
        <Plus className="w-4 h-4" />
        Add Customer
      </Button>
    </div>
  );
}
