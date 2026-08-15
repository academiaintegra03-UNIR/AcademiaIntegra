"use client";

import * as React from "react";
import { toast } from "sonner";
import { createPlanAction, updatePlanAction } from "@/app/admin/planes/actions";
import type { Plan, PlanType } from "@/lib/types/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const NO_GROUP = "__none__";
const NEW_GROUP = "__new__";

export function PlanFormDialog({
  plan,
  trigger,
  existingGroupLabels,
}: {
  plan?: Plan;
  trigger: React.ReactNode;
  existingGroupLabels: string[];
}) {
  const isEdit = Boolean(plan);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<PlanType | "">(plan?.type ?? "");
  const [groupMode, setGroupMode] = React.useState(plan?.groupLabel || NO_GROUP);
  const [newGroupLabel, setNewGroupLabel] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  const effectiveGroupLabel =
    groupMode === NO_GROUP ? "" : groupMode === NEW_GROUP ? newGroupLabel.trim() : groupMode;

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await (isEdit ? updatePlanAction : createPlanAction)(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success(isEdit ? "Plan actualizado." : "Plan creado.");
      setOpen(false);
      if (!isEdit) formRef.current?.reset();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(undefined);
        if (next) {
          setType(plan?.type ?? "");
          setGroupMode(plan?.groupLabel || NO_GROUP);
          setNewGroupLabel("");
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form ref={formRef} action={handleSubmit}>
          {isEdit ? <input type="hidden" name="id" value={plan!.id} /> : null}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar plan" : "Crear plan"}</DialogTitle>
            <DialogDescription>
              Este plan aparece en /planes-precios en cuanto quede activo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-name">Nombre</Label>
              <Input id="plan-name" name="name" defaultValue={plan?.name} required disabled={isPending} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-description">Descripción corta</Label>
              <Input
                id="plan-description"
                name="description"
                placeholder="Clases en vivo grupales de alto rendimiento."
                defaultValue={plan?.description}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-type">Tipo</Label>
              <input type="hidden" name="type" value={type} />
              <Select value={type} onValueChange={(next) => setType(next as PlanType)} disabled={isPending}>
                <SelectTrigger id="plan-type" className="w-full">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual (1 estudiante, el comprador)</SelectItem>
                  <SelectItem value="grupal">Grupal / familiar (acudiente, varios hijos)</SelectItem>
                  <SelectItem value="institucional">Institucional (colegio)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-price">Precio (COP)</Label>
              <Input
                id="plan-price"
                name="price_cop"
                type="number"
                min={0}
                step={1000}
                defaultValue={plan?.priceCop}
                required
                disabled={isPending}
              />
            </div>

            {type === "grupal" || type === "institucional" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plan-seats">Cupo de estudiantes</Label>
                <Input
                  id="plan-seats"
                  name="seat_limit"
                  type="number"
                  min={1}
                  defaultValue={plan?.seatLimit ?? undefined}
                  required
                  disabled={isPending}
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-period">Período</Label>
              <Input
                id="plan-period"
                name="period"
                placeholder="Pago único · semestre"
                defaultValue={plan?.period}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-badge">Insignia (opcional)</Label>
              <Input
                id="plan-badge"
                name="badge"
                placeholder="Más popular"
                defaultValue={plan?.badge ?? ""}
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-group">Grupo / pestaña (opcional)</Label>
              <input type="hidden" name="group_label" value={effectiveGroupLabel} />
              <Select value={groupMode} onValueChange={setGroupMode} disabled={isPending}>
                <SelectTrigger id="plan-group" className="w-full">
                  <SelectValue placeholder="Sin grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_GROUP}>Sin grupo</SelectItem>
                  {existingGroupLabels.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                  <SelectItem value={NEW_GROUP}>+ Crear nuevo grupo…</SelectItem>
                </SelectContent>
              </Select>
              {groupMode === NEW_GROUP ? (
                <Input
                  placeholder="Ej. Grado 10°"
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  disabled={isPending}
                  autoFocus
                />
              ) : null}
              <p className="text-xs text-muted-foreground">
                Los planes con el mismo grupo se muestran juntos, con pestañas, en /planes-precios.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="plan-features">Características (una por línea)</Label>
              <Textarea
                id="plan-features"
                name="features"
                rows={4}
                defaultValue={plan?.features.join("\n")}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
