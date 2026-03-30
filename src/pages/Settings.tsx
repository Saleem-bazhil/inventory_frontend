import { motion } from "framer-motion";
import { Sun, Moon, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export default function Settings() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{user?.full_name || "User"}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || "user@example.com"}</p>
              <Badge variant="default" className="mt-1">{user?.role || "staff"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Theme</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {theme === "light" ? "Light mode is active" : "Dark mode is active"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm font-medium">{theme === "light" ? "Dark" : "Light"}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Inventory SaaS v1.0.0</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A modern inventory management system for tracking materials, customers, and transactions.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
