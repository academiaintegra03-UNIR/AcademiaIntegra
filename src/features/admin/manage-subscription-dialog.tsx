"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  activateSubscriptionAction,
  cancelSubscriptionAction,
  updateSubscriptionAction,
} from "@/app/admin/usuarios/subscription-actions";
import { EXPECTED_PLAN_TYPE_BY_ROLE } from "@/lib/data/roles";
import type { AdminUserRow, PlanOption } from "@/lib/types/panels";
import type { Role } from "@/lib/types/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BILLING_TYPE_LABEL: Record<string, string> = {
  pago_unico: "Pago único",
  mensual: "Mensual",
  prueba_gratis: "Prueba gratis",
};

const MULTI_SEAT_TYPES = new Set(["grupal", "institucional"]);

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export function ManageSubscriptionDialog({ user, planes }: { user: AdminUserRow; planes: PlanOption[] }) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  // Activar (sin suscripción todavía)
  const [planId, setPlanId] = React.useState("");

  // Editar (ya tiene suscripción)
  const [seatLimitOverride, setSeatLimitOverride] = React.useState(
    user.subscription?.seatLimitOverride != null ? String(user.subscription.seatLimitOverride) : ""
  );
  const [expiresAt, setExpiresAt] = React.useState(toDateInputValue(user.subscription?.expiresAt ?? null));

  const expectedType = EXPECTED_PLAN_TYPE_BY_ROLE[user.role as Role];
  const compatiblePlans = planes.filter((p) => p.type === expectedType);
  const isMultiSeat = user.subscription ? MULTI_SEAT_TYPES.has(expectedType ?? "") : false;

  function resetState() {
    setPlanId("");
    setSeatLimitOverride(
      user.subscription?.seatLimitOverride != null ? String(user.subscription.seatLimitOverride) : ""
    );
    setExpiresAt(toDateInputValue(user.subscription?.expiresAt ?? null));
    setError(undefined);
  }

  function handleActivate() {
    if (!planId) return;
    setError(undefined);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("profile_id", user.id);
      fd.set("plan_id", planId);
      const result = await activateSubscriptionAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Suscripción activada.");
      setOpen(false);
    });
  }

  function handleSave() {
    if (!user.subscription) return;
    setError(undefined);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("subscription_id", user.subscription!.id);
      fd.set("seat_limit_override", seatLimitOverride);
      fd.set("expires_at", expiresAt);
      const result = await updateSubscriptionAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Suscripción actualizada.");
      setOpen(false);
    });
  }

  function handleCancel() {
    if (!user.subscription) return;
    setError(undefined);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("subscription_id", user.subscription!.id);
      const result = await cancelSubscriptionAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Suscripción cancelada.");
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Suscripción de ${user.name}`}>
          <CreditCard />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suscripción de {user.name}</DialogTitle>
          <DialogDescription>
            {user.subscription
              ? "Ajusta el cupo o el vencimiento de esta cuenta sin tocar el plan de nadie más."
              : "Activa un plan para esta cuenta a mano — sin pasar por el checkout."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {!user.subscription ? (
            compatiblePlans.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`sub-plan-${user.id}`}>Plan</Label>
                <Select value={planId} onValueChange={setPlanId} disabled={isPending}>
                  <SelectTrigger id={`sub-plan-${user.id}`} className="w-full">
                    <SelectValue placeholder="Selecciona un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {compatiblePlans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {BILLING_TYPE_LABEL[p.billingType]}
                        {p.durationDays ? ` · ${p.durationDays} días` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay planes activos de tipo {expectedType} — crea uno en /admin/planes primero.
              </p>
            )
          ) : (
            <>
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="font-semibold text-foreground">{user.subscription.planName}</div>
                <div className="text-xs text-muted-foreground">
                  {BILLING_TYPE_LABEL[user.subscription.billingType]}
                  {user.subscription.expiresAt ? ` · vence el ${formatDate(user.subscription.expiresAt)}` : " · sin vencimiento"}
                </div>
              </div>

              {isMultiSeat ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`sub-seats-${user.id}`}>Cupo personalizado (opcional)</Label>
                  <Input
                    id={`sub-seats-${user.id}`}
                    type="number"
                    min={1}
                    value={seatLimitOverride}
                    onChange={(e) => setSeatLimitOverride(e.target.value)}
                    placeholder={`Plan: ${user.subscription.planSeatLimit ?? "sin límite"}`}
                    disabled={isPending}
                  />
                  <p className="text-xs text-muted-foreground">Vacío = usa el cupo del plan.</p>
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`sub-expires-${user.id}`}>Vencimiento (opcional)</Label>
                <Input
                  id={`sub-expires-${user.id}`}
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">Vacío = no vence.</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {user.subscription ? (
            <Button type="button" variant="destructive" disabled={isPending} onClick={handleCancel}>
              Cancelar suscripción
            </Button>
          ) : (
            <span />
          )}
          {user.subscription ? (
            <Button type="button" disabled={isPending} onClick={handleSave}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          ) : (
            <Button type="button" disabled={isPending || !planId} onClick={handleActivate}>
              {isPending ? "Activando..." : "Activar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
