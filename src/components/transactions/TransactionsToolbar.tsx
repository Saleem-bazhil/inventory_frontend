import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-4 mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm"
    >
      {/* Type Filter with Icon */}
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Filter className="w-4 h-4" />
        </div>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full lg:w-40 border-none bg-slate-100/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/20 transition-all rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="in">Inflow</SelectItem>
            <SelectItem value="out">Outflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden lg:block mx-2" />

      {/* Date Range Group */}
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative flex-1 lg:flex-none">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-xl border-none bg-slate-100/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
        
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">to</span>

        <div className="relative flex-1 lg:flex-none">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-xl border-none bg-slate-100/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="lg:ml-auto w-full lg:w-auto">
        <Button 
          onClick={onAdd} 
          className="w-full lg:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6 py-5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold">New Transaction</span>
        </Button>
      </div>
    </motion.div>
  );
}