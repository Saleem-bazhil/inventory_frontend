import { Search, Plus, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { STATUS_CONFIG } from "@/lib/workflow";
import { useAuthStore } from "@/store/authStore";
import {
  REGION_LABELS,
  PRIORITY_LABELS,
} from "@/types";
import type {
  TicketStatus,
  TicketPriority,
  SLAHealth,
  Region,
} from "@/types";

const SLA_HEALTH_OPTIONS: Record<SLAHealth, string> = {
  on_track: "On Track",
  warning: "Warning",
  breached: "Breached",
};

interface TicketsToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
  slaHealth: string;
  onSLAHealthChange: (val: string) => void;
  region: string;
  onRegionChange: (val: string) => void;
  onAdd: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TicketsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  slaHealth,
  onSLAHealthChange,
  region,
  onRegionChange,
  onAdd,
  onClearFilters,
  hasActiveFilters,
}: TicketsToolbarProps) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: Search + Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tickets by number, customer, product..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="gap-1 text-slate-500"
            >
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
          <Button onClick={onAdd} className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Add Ticket
          </Button>
        </div>
      </div>

      {/* Row 2: Filter dropdowns */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.entries(STATUS_CONFIG) as [TicketStatus, (typeof STATUS_CONFIG)[TicketStatus]][]).map(
              ([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {(Object.entries(PRIORITY_LABELS) as [TicketPriority, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        {/* SLA Health */}
        <Select value={slaHealth} onValueChange={onSLAHealthChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="SLA Health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SLA</SelectItem>
            {(Object.entries(SLA_HEALTH_OPTIONS) as [SLAHealth, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>

        {/* Region (admin only) */}
        {isAdmin && (
          <Select value={region} onValueChange={onRegionChange}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {(Object.entries(REGION_LABELS) as [Region, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
