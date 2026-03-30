import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users, ArrowUpDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/materials", label: "Materials", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/transactions", label: "Txns", icon: ArrowUpDown },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500"
              )
            }
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
