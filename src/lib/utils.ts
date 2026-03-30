import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(date: string): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getStatusColor(status: string) {
  switch (status) {
    case "normal":
      return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "low":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "out":
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "normal":
      return "Normal";
    case "low":
      return "Low Stock";
    case "out":
      return "Out of Stock";
    default:
      return status;
  }
}
