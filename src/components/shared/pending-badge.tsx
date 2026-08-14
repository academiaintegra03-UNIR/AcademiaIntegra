import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Marks content that the Matriz de Migración flagged as "pendiente de
 * validación con el propietario" (prices, testimonials, real figures,
 * agreements). Never replace this with invented data — surface the gap
 * instead.
 */
export function PendingBadge({
  label = "Pendiente de validación con el propietario",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-warning-foreground px-2.5 py-1 text-xs font-semibold text-warning",
        className
      )}
    >
      <AlertTriangle className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
