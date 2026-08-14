"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUserAction } from "@/app/admin/usuarios/actions";
import type { AdminUserRow } from "@/lib/types/panels";
import { Button } from "@/components/ui/button";
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

export function DeleteUserDialog({ user, disabled }: { user: AdminUserRow; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await deleteUserAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success(`"${user.name}" fue eliminado.`);
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Eliminar ${user.name}`}
          disabled={disabled}
          title={disabled ? "No puedes eliminar tu propia cuenta" : undefined}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={handleSubmit}>
          <input type="hidden" name="id" value={user.id} />
          <DialogHeader>
            <DialogTitle>Eliminar usuario</DialogTitle>
            <DialogDescription>
              Esta acción elimina la cuenta de <strong>{user.name}</strong> ({user.email}) de forma
              permanente. No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar definitivamente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
