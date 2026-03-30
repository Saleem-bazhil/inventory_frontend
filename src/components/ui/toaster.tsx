import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} onClose={() => dismiss(t.id)}>
          {t.title && <p className="text-sm font-semibold">{t.title}</p>}
          {t.description && <p className="text-sm opacity-80">{t.description}</p>}
        </Toast>
      ))}
    </div>
  );
}
