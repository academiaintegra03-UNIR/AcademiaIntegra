"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { setPlanActiveAction } from "@/app/admin/planes/actions";
import type { Plan, PlanType } from "@/lib/types/billing";
import type { StatusTone } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlanFormDialog } from "@/features/admin/plan-form-dialog";

const TYPE_LABEL: Record<PlanType, string> = {
  individual: "Individual",
  grupal: "Grupal / familiar",
  institucional: "Institucional",
};

const TYPE_TONE: Record<PlanType, StatusTone> = {
  individual: "info",
  grupal: "success",
  institucional: "warning",
};

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    value
  );
}

function ToggleActiveButton({ plan }: { plan: Plan }) {
  const [isPending, startTransition] = React.useTransition();

  function handleToggle() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", plan.id);
      fd.set("active", String(!plan.active));
      const result = await setPlanActiveAction(fd);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(plan.active ? "Plan desactivado." : "Plan activado.");
    });
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
      {plan.active ? "Desactivar" : "Activar"}
    </Button>
  );
}

export function PlansTable({ plans, existingGroupLabels }: { plans: Plan[]; existingGroupLabels: string[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Cupo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Todavía no hay planes creados.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div className="font-semibold">{plan.name}</div>
                    <div className="max-w-56 truncate text-xs text-muted-foreground">{plan.description}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={TYPE_TONE[plan.type]}>{TYPE_LABEL[plan.type]}</StatusBadge>
                  </TableCell>
                  <TableCell>{formatCop(plan.priceCop)}</TableCell>
                  <TableCell className="text-muted-foreground">{plan.seatLimit ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge tone={plan.active ? "success" : "neutral"}>
                      {plan.active ? "Activo" : "Inactivo"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <PlanFormDialog
                        plan={plan}
                        existingGroupLabels={existingGroupLabels}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${plan.name}`}>
                            <Pencil />
                          </Button>
                        }
                      />
                      <ToggleActiveButton plan={plan} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
