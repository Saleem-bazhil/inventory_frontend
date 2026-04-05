import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Moon, Sun, User, Settings, LogOut, Shield, MapPin } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { REGION_LABELS } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/materials": "Materials",
  "/customers": "Customers",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  const title = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-14 sm:h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: page title on mobile, search on larger */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 md:hidden truncate">
            {title}
          </h1>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search materials, customers..."
              className="h-10 w-48 md:w-64 lg:w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Right: notification, theme toggle, user avatar */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "light" ? <Moon className="w-[18px] h-[18px] sm:w-5 sm:h-5" /> : <Sun className="w-[18px] h-[18px] sm:w-5 sm:h-5" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-800 transition-all">
                <User className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || "user@example.com"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                    <Shield className="w-3 h-3" />
                    {user?.role === "super_admin" ? "Super Admin" : "Sub Admin"}
                  </span>
                  {user?.region && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3 h-3" />
                      {REGION_LABELS[user.region]}
                    </span>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
