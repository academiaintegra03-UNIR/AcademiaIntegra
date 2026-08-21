"use client";

import * as React from "react";
import { Plus, Search, Users, X } from "lucide-react";
import { toast } from "sonner";
import type { GrupoActionState } from "@/app/admin/grupos/actions";
import type { AdminGrupoRow, Colegio, GrupoEstudianteOption } from "@/lib/types/panels";
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

const NO_COLEGIO_BULK = "__none__";

function matchesSearch(student: GrupoEstudianteOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return student.nombre.toLowerCase().includes(q) || (student.numeroDocumento ?? "").toLowerCase().includes(q);
}

type GrupoStudentAction = (formData: FormData) => Promise<GrupoActionState>;

export function ManageGrupoStudentsDialog({
  grupo,
  colegios,
  estudiantes,
  addStudentAction,
  removeStudentAction,
  addColegioStudentsAction,
}: {
  grupo: AdminGrupoRow;
  /** Colegios para "agregar todos" — pasa [] para ocultar esa sección
   * (ej. panel de colegio, donde ya todo es de un solo colegio). */
  colegios: Colegio[];
  estudiantes: GrupoEstudianteOption[];
  addStudentAction: GrupoStudentAction;
  removeStudentAction: GrupoStudentAction;
  addColegioStudentsAction?: GrupoStudentAction;
}) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [linkedStudentIds, setLinkedStudentIds] = React.useState<string[]>(grupo.studentIds);
  const [search, setSearch] = React.useState("");
  const [colegioBulk, setColegioBulk] = React.useState("");
  const [isLinkPending, startLinkTransition] = React.useTransition();
  const [addingStudentId, setAddingStudentId] = React.useState<string>();
  const [isBulkPending, startBulkTransition] = React.useTransition();

  const nombreByStudentId = new Map(estudiantes.map((s) => [s.id, s.nombre]));

  const searchResults = search.trim()
    ? estudiantes.filter((s) => !linkedStudentIds.includes(s.id) && matchesSearch(s, search)).slice(0, 20)
    : [];

  function handleAddStudent(studentId: string) {
    setError(undefined);
    setAddingStudentId(studentId);
    startLinkTransition(async () => {
      const fd = new FormData();
      fd.set("grupo_id", grupo.id);
      fd.set("student_id", studentId);
      const result = await addStudentAction(fd);
      setAddingStudentId(undefined);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLinkedStudentIds((prev) => [...prev, studentId]);
      setSearch("");
    });
  }

  function handleBulkAdd() {
    if (!colegioBulk || !addColegioStudentsAction) return;
    setError(undefined);
    const colegioId = colegioBulk;
    startBulkTransition(async () => {
      const fd = new FormData();
      fd.set("grupo_id", grupo.id);
      fd.set("colegio_id", colegioId);
      const result = await addColegioStudentsAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      const idsFromColegio = estudiantes.filter((s) => s.colegioId === colegioId).map((s) => s.id);
      setLinkedStudentIds((prev) => Array.from(new Set([...prev, ...idsFromColegio])));
      setColegioBulk("");
      toast.success("Estudiantes del colegio agregados.");
    });
  }

  function handleRemoveStudent(studentId: string) {
    setError(undefined);
    startLinkTransition(async () => {
      const fd = new FormData();
      fd.set("grupo_id", grupo.id);
      fd.set("student_id", studentId);
      const result = await removeStudentAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLinkedStudentIds((prev) => prev.filter((id) => id !== studentId));
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(undefined);
        if (next) {
          setLinkedStudentIds(grupo.studentIds);
          setSearch("");
          setColegioBulk("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Estudiantes de ${grupo.name}`}>
          <Users />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estudiantes de {grupo.name}</DialogTitle>
          <DialogDescription>
            Los cambios aquí se guardan de inmediato. Un estudiante puede estar en varios grupos a la vez.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label>
              {linkedStudentIds.length} estudiante{linkedStudentIds.length === 1 ? "" : "s"} en el grupo
            </Label>
            {linkedStudentIds.length > 0 ? (
              <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
                {linkedStudentIds.map((studentId) => (
                  <li
                    key={studentId}
                    className="flex items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-sm"
                  >
                    <span>{nombreByStudentId.get(studentId) ?? "Estudiante eliminado"}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={isLinkPending}
                      aria-label="Quitar del grupo"
                      onClick={() => handleRemoveStudent(studentId)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin estudiantes todavía.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="grupo-student-search" className="text-xs text-muted-foreground">
              Agregar un estudiante — busca por nombre o número de documento
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="grupo-student-search"
                className="pl-8"
                placeholder="Ej. Juan Pérez o 1023456789"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLinkPending}
              />
            </div>
            {search.trim() ? (
              searchResults.length > 0 ? (
                <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto">
                  {searchResults.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        disabled={isLinkPending}
                        onClick={() => handleAddStudent(s.id)}
                        className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-left text-sm hover:bg-accent disabled:opacity-50"
                      >
                        <span>
                          {s.nombre}
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {s.numeroDocumento ? `Doc. ${s.numeroDocumento}` : ""} {s.colegioNombre ?? "Independiente"}
                          </span>
                        </span>
                        {addingStudentId === s.id && isLinkPending ? (
                          <span className="text-xs text-muted-foreground">Agregando...</span>
                        ) : (
                          <Plus className="size-4 text-muted-foreground" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Sin resultados.</p>
              )
            ) : null}
          </div>

          {colegios.length > 0 && addColegioStudentsAction ? (
            <div className="flex flex-col gap-1.5 border-t border-border pt-3">
              <Label className="text-xs text-muted-foreground">O agrega a todos los de un colegio</Label>
              <div className="flex gap-2">
                <Select value={colegioBulk || NO_COLEGIO_BULK} onValueChange={setColegioBulk} disabled={isBulkPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un colegio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COLEGIO_BULK} disabled>
                      Selecciona un colegio
                    </SelectItem>
                    {colegios.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBulkPending || !colegioBulk}
                  onClick={handleBulkAdd}
                >
                  {isBulkPending ? "Agregando..." : "Agregar todos"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
