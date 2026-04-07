import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "\u2014";
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "\u2014";
  return format(new Date(date), "MMM dd, yyyy HH:mm");
}

export function formatTimeAgo(date: string | null | undefined): string {
  if (!date) return "\u2014";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}

/** Build query params object, filtering out undefined/empty values */
export function buildParams(obj: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== null && val !== "" && val !== "all") {
      params[key] = String(val);
    }
  }
  return params;
}
