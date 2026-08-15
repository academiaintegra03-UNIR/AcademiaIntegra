"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateUserAction } from "@/app/admin/usuarios/actions";
import { roleOptions } from "@/lib/data/roles";
import type { AdminUserRow, Colegio } from "@/lib/types/panels";
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

export function EditUserDialog({ user, colegios }: { user: AdminUserRow; colegios: Colegio[] }) {
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState<string>(user.role);
  const [colegioId, setColegioId] = React.useState(user.colegioId ?? "");
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

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
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Editar ${user.name}`}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
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
