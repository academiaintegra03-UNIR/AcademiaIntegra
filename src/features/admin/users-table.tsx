"use client";

import * as React from "react";
import { roleOptions } from "@/lib/data/roles";
import type { AdminUserRow, Colegio } from "@/lib/types/panels";
import type { Role } from "@/lib/types/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { NameCell } from "@/components/shared/name-cell";
import { EditUserDialog } from "@/features/admin/edit-user-dialog";
import { DeleteUserDialog } from "@/features/admin/delete-user-dialog";

const ALL = "todos";

export function UsersTable({
  rows,
  currentUserId,
  colegios,
}: {
  rows: AdminUserRow[];
  currentUserId: string;
  colegios: Colegio[];
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
                <TableHead>Rol</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No hay usuarios con ese rol.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <NameCell
                        name={user.name}
                        subtitle={user.role === "estudiante" ? (user.colegioNombre ?? "Independiente") : undefined}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <StatusBadge tone={user.roleTone}>{user.roleLabel}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <EditUserDialog user={user} colegios={colegios} />
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
