"use client";

import * as React from "react";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";
import {
  linkGuardianStudentAction,
  unlinkGuardianStudentAction,
  updateUserAction,
} from "@/app/admin/usuarios/actions";
import { roleOptions } from "@/lib/data/roles";
import { documentTypes } from "@/lib/data/document-types";
import type { AdminUserRow, Colegio, EstudianteOption } from "@/lib/types/panels";
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

const NO_COLEGIO = "__none__";
const NO_DOC_TYPE = "__none__";

export function EditUserDialog({
  user,
  colegios,
  estudiantes,
}: {
  user: AdminUserRow;
  colegios: Colegio[];
  estudiantes: EstudianteOption[];
}) {
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState<string>(user.role);
  const [colegioId, setColegioId] = React.useState(user.colegioId ?? "");
  const [tipoDocumento, setTipoDocumento] = React.useState(user.tipoDocumento ?? "");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  const [linkedStudentIds, setLinkedStudentIds] = React.useState<string[]>(user.linkedStudentIds);
  const [studentToAdd, setStudentToAdd] = React.useState("");
  const [isLinkPending, startLinkTransition] = React.useTransition();
  const availableStudents = estudiantes.filter((s) => !linkedStudentIds.includes(s.id));
  const nombreByStudentId = new Map(estudiantes.map((s) => [s.id, s.nombre]));

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await updateUserAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Usuario actualizado.");
      setOpen(false);
      setPassword("");
    });
  }

  // Sin esto, React resetea los campos no controlados apenas la función
  // termina (aunque devolvamos { error }), y el usuario pierde lo que
  // escribió cada vez que falla una validación.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(new FormData(e.currentTarget));
  }

  function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const bytes = new Uint32Array(12);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, (b) => chars[b % chars.length]).join(""));
  }

  function handleAddStudent() {
    if (!studentToAdd) return;
    setError(undefined);
    const studentId = studentToAdd;
    startLinkTransition(async () => {
      const fd = new FormData();
      fd.set("guardian_id", user.id);
      fd.set("student_id", studentId);
      const result = await linkGuardianStudentAction(fd);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLinkedStudentIds((prev) => [...prev, studentId]);
      setStudentToAdd("");
    });
  }

  function handleRemoveStudent(studentId: string) {
    setError(undefined);
    startLinkTransition(async () => {
      const fd = new FormData();
      fd.set("guardian_id", user.id);
      fd.set("student_id", studentId);
      const result = await unlinkGuardianStudentAction(fd);
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
          setRole(user.role);
          setColegioId(user.colegioId ?? "");
          setTipoDocumento(user.tipoDocumento ?? "");
          setPassword("");
          setLinkedStudentIds(user.linkedStudentIds);
          setStudentToAdd("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Editar ${user.name}`}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <input type="hidden" name="id" value={user.id} />
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>{user.email}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`edit-user-nombre-${user.id}`}>Nombre completo</Label>
              <Input
                id={`edit-user-nombre-${user.id}`}
                name="nombre"
                defaultValue={user.name}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`edit-user-password-${user.id}`}>Nueva contraseña (opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id={`edit-user-password-${user.id}`}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  disabled={isPending}
                  className="font-mono"
                  placeholder="Déjalo vacío para no cambiarla"
                />
                <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={generatePassword}>
                  Generar
                </Button>
              </div>
              {password ? (
                <p className="text-xs text-muted-foreground">Compártela con el usuario por un canal seguro.</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`edit-user-telefono-${user.id}`}>Teléfono (opcional)</Label>
              <Input
                id={`edit-user-telefono-${user.id}`}
                name="telefono"
                type="tel"
                defaultValue={user.telefono ?? ""}
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-[1fr_1.4fr] gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-user-doc-tipo-${user.id}`}>Tipo de documento</Label>
                <input type="hidden" name="tipo_documento" value={tipoDocumento} />
                <Select
                  value={tipoDocumento || NO_DOC_TYPE}
                  onValueChange={(next) => setTipoDocumento(next === NO_DOC_TYPE ? "" : next)}
                  disabled={isPending}
                >
                  <SelectTrigger id={`edit-user-doc-tipo-${user.id}`} className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_DOC_TYPE}>Sin especificar</SelectItem>
                    {documentTypes.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-user-doc-numero-${user.id}`}>Número de documento</Label>
                <Input
                  id={`edit-user-doc-numero-${user.id}`}
                  name="numero_documento"
                  defaultValue={user.numeroDocumento ?? ""}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`edit-user-role-${user.id}`}>Rol</Label>
              <input type="hidden" name="role" value={role} />
              <Select
                value={role}
                onValueChange={(next) => {
                  setRole(next);
                  if (next !== "estudiante") setColegioId("");
                }}
                disabled={isPending}
              >
                <SelectTrigger id={`edit-user-role-${user.id}`} className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.role} value={option.role}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === "estudiante" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`edit-user-colegio-${user.id}`}>Colegio</Label>
                <input type="hidden" name="colegio_id" value={colegioId} />
                <Select
                  value={colegioId || NO_COLEGIO}
                  onValueChange={(next) => setColegioId(next === NO_COLEGIO ? "" : next)}
                  disabled={isPending}
                >
                  <SelectTrigger id={`edit-user-colegio-${user.id}`} className="w-full">
                    <SelectValue placeholder="Selecciona un colegio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COLEGIO}>Sin colegio (independiente)</SelectItem>
                    {colegios.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {role === "acudiente" ? (
              <div className="flex flex-col gap-1.5">
                <Label>Estudiantes vinculados</Label>
                <p className="text-xs text-muted-foreground">
                  Los cambios aquí se guardan de inmediato — no hace falta &ldquo;Guardar cambios&rdquo;.
                </p>

                {linkedStudentIds.length > 0 ? (
                  <ul className="flex flex-col gap-1">
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
                          aria-label="Quitar vínculo"
                          onClick={() => handleRemoveStudent(studentId)}
                        >
                          <X />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sin estudiantes vinculados todavía.</p>
                )}

                {availableStudents.length > 0 ? (
                  <div className="flex gap-2">
                    <Select value={studentToAdd} onValueChange={setStudentToAdd} disabled={isLinkPending}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vincular un estudiante..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLinkPending || !studentToAdd}
                      onClick={handleAddStudent}
                    >
                      Agregar
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
