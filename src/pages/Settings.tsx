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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 px-4 md:px-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/60 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
              <User className="w-8 h-8" />
              <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-indigo-500"></div>
            </div>

            {/* User Info */}
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {user?.full_name || user?.username || "User"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user?.email || "user@example.com"}
              </p>

              <Badge className="mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                {user?.role || "staff"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Card */}
      <Card className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/60 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                Theme Mode
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {theme === "light"
                  ? "Light mode is active"
                  : "Dark mode is active"}
              </p>
            </div>

            {/* Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition-all"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </motion.button>
          </div>
        </CardContent>
      </Card>

      {/* About Card */}
      <Card className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/60 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">About</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Inventory SaaS v1.0.0
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            A modern inventory management system for tracking materials,
            customers, and transactions with real-time insights and clean UI.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}