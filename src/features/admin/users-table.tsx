"use client";

import * as React from "react";
import { roleOptions, EXPECTED_PLAN_TYPE_BY_ROLE } from "@/lib/data/roles";
import type { AdminUserRow, Colegio, EstudianteOption, PlanOption } from "@/lib/types/panels";
import type { Role } from "@/lib/types/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { NameCell } from "@/components/shared/name-cell";
import { EditUserDialog } from "@/features/admin/edit-user-dialog";
import { DeleteUserDialog } from "@/features/admin/delete-user-dialog";
import { ManageSubscriptionDialog } from "@/features/admin/manage-subscription-dialog";

const ALL = "todos";

function formatExpiry(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function PlanCell({ user }: { user: AdminUserRow }) {
  if (!(user.role in EXPECTED_PLAN_TYPE_BY_ROLE)) return <span className="text-muted-foreground">—</span>;
  if (!user.subscription) return <StatusBadge tone="neutral">Sin plan</StatusBadge>;

  return (
    <div>
      <StatusBadge tone="success">{user.subscription.planName}</StatusBadge>
      <div className="mt-1 text-xs text-muted-foreground">
        {user.subscription.expiresAt ? `Vence ${formatExpiry(user.subscription.expiresAt)}` : "Sin vencimiento"}
      </div>
    </div>
  );
}

export function UsersTable({
  rows,
  currentUserId,
  colegios,
  estudiantes,
  planes,
}: {
  rows: AdminUserRow[];
  currentUserId: string;
  colegios: Colegio[];
  estudiantes: EstudianteOption[];
  planes: PlanOption[];
}) {
  const [roleFilter, setRoleFilter] = React.useState<Role | typeof ALL>(ALL);
  const filtered = roleFilter === ALL ? rows : rows.filter((r) => r.role === roleFilter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={roleFilter === ALL ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setRoleFilter(ALL)}
          >
            Todos
          </Button>
          {roleOptions.map((option) => (
            <Button
              key={option.role}
              variant={roleFilter === option.role ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setRoleFilter(option.role)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No hay usuarios con ese rol.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <NameCell
                        name={user.name}
                        subtitle={
                          user.role === "estudiante"
                            ? (user.colegioNombre ?? "Independiente")
                            : user.role === "acudiente"
                              ? user.linkedStudentIds.length === 0
                                ? "Sin estudiantes vinculados"
                                : `${user.linkedStudentIds.length} estudiante${user.linkedStudentIds.length === 1 ? "" : "s"} vinculado${user.linkedStudentIds.length === 1 ? "" : "s"}`
                              : undefined
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.tipoDocumento && user.numeroDocumento
                        ? `${user.tipoDocumento} ${user.numeroDocumento}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={user.roleTone}>{user.roleLabel}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <PlanCell user={user} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {user.role in EXPECTED_PLAN_TYPE_BY_ROLE ? (
                          <ManageSubscriptionDialog user={user} planes={planes} />
                        ) : null}
                        <EditUserDialog user={user} colegios={colegios} estudiantes={estudiantes} />
                        <DeleteUserDialog user={user} disabled={user.id === currentUserId} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
