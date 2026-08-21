"use client";

import { Pencil } from "lucide-react";
import {
  addColegioStudentsToGrupoAction,
  addStudentToGrupoAction,
  removeStudentFromGrupoAction,
} from "@/app/admin/grupos/actions";
import type { AdminGrupoRow, Colegio, GrupoEstudianteOption, TutorOption } from "@/lib/types/panels";
import type { StatusTone } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { GrupoFormDialog } from "@/features/admin/grupo-form-dialog";
import { ManageGrupoStudentsDialog } from "@/features/admin/manage-grupo-students-dialog";
import { DeleteGrupoDialog } from "@/features/admin/delete-grupo-dialog";

function tipoGrupo(grupo: AdminGrupoRow): { label: string; tone: StatusTone } {
  if (grupo.esDefaultColegio) return { label: "Colegio · automático", tone: "info" };
  if (grupo.colegioId) return { label: "Colegio · subgrupo", tone: "warning" };
  return { label: "Libre / familiar", tone: "success" };
}

export function GruposTable({
  grupos,
  colegios,
  tutores,
  estudiantes,
}: {
  grupos: AdminGrupoRow[];
  colegios: Colegio[];
  tutores: TutorOption[];
  estudiantes: GrupoEstudianteOption[];
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Colegio</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Estudiantes</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {grupos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                  Todavía no hay grupos creados.
                </TableCell>
              </TableRow>
            ) : (
              grupos.map((grupo) => {
                const tipo = tipoGrupo(grupo);
                return (
                <TableRow key={grupo.id}>
                  <TableCell>
                    <span className="font-semibold">{grupo.name}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={tipo.tone}>{tipo.label}</StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{grupo.colegioNombre ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{grupo.tutorNombre ?? "Sin asignar"}</TableCell>
                  <TableCell className="text-muted-foreground">{grupo.studentIds.length}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5">
                      <ManageGrupoStudentsDialog
                        grupo={grupo}
                        colegios={colegios}
                        estudiantes={estudiantes}
                        addStudentAction={addStudentToGrupoAction}
                        removeStudentAction={removeStudentFromGrupoAction}
                        addColegioStudentsAction={addColegioStudentsToGrupoAction}
                      />
                      <GrupoFormDialog
                        grupo={grupo}
                        colegios={colegios}
                        tutores={tutores}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label={`Editar ${grupo.name}`}>
                            <Pencil />
                          </Button>
                        }
                      />
                      <DeleteGrupoDialog grupo={grupo} />
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
