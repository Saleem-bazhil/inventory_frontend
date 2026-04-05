import { Search, Plus, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { SERVICE_TYPE_LABELS, CALL_STATUS_LABELS, REGION_LABELS } from "@/types";

interface MaterialsToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  serviceType: string;
  onServiceTypeChange: (val: string) => void;
  callStatus: string;
  onCallStatusChange: (val: string) => void;
  region: string;
  onRegionChange: (val: string) => void;
  onAdd: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function MaterialsToolbar({
  search, onSearchChange,
  serviceType, onServiceTypeChange,
  callStatus, onCallStatusChange,
  region, onRegionChange,
  onAdd, onClearFilters, hasActiveFilters,
}: MaterialsToolbarProps) {
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: Search + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, case ID, product, part..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 text-slate-500">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
          <Button onClick={onAdd} className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Row 2: Filter dropdowns */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Service Type */}
        <Select value={serviceType} onValueChange={onServiceTypeChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Service Types</SelectItem>
            {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Call Status */}
        <Select value={callStatus} onValueChange={onCallStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Call Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(CALL_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region (super admin only) */}
        {isSuperAdmin && (
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(REGION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
