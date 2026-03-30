import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen transition-all duration-200">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-x-hidden">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
