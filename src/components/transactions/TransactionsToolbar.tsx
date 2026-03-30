import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionsToolbarProps {
  type: string;
  onTypeChange: (val: string) => void;
  dateFrom: string;
  onDateFromChange: (val: string) => void;
  dateTo: string;
  onDateToChange: (val: string) => void;
  onAdd: () => void;
}

export function TransactionsToolbar({ type, onTypeChange, dateFrom, onDateFromChange, dateTo, onDateToChange, onAdd }: TransactionsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="in">Inflow</SelectItem>
          <SelectItem value="out">Outflow</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        placeholder="From"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        placeholder="To"
      />
      <div className="sm:ml-auto">
        <Button onClick={onAdd} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          New Transaction
        </Button>
      </div>
    </div>
  );
}
