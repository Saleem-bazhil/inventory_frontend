import { useState, useCallback } from "react";

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastCount = 0;
const listeners: Array<(toasts: ToastItem[]) => void> = [];
let memoryToasts: ToastItem[] = [];

function dispatch(toasts: ToastItem[]) {
  memoryToasts = toasts;
  listeners.forEach((l) => l(toasts));
}

export function toast(props: Omit<ToastItem, "id">) {
  const id = String(++toastCount);
  const newToast = { ...props, id };
  dispatch([...memoryToasts, newToast]);
  setTimeout(() => {
    dispatch(memoryToasts.filter((t) => t.id !== id));
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(memoryToasts);

  useState(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  });

  const dismiss = useCallback((id: string) => {
    dispatch(memoryToasts.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
