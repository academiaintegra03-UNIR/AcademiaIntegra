"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSubgrupoAction } from "@/app/colegios-panel/grupos/actions";
import type { AdminGrupoRow } from "@/lib/types/panels";
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

export function DeleteSubgrupoDialog({ grupo }: { grupo: AdminGrupoRow }) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await deleteSubgrupoAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success(`"${grupo.name}" fue eliminado.`);
      setOpen(false);
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(new FormData(e.currentTarget));
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); setError(undefined); }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Eliminar ${grupo.name}`}
          disabled={grupo.esDefaultColegio}
          title={grupo.esDefaultColegio ? "Se administra solo" : undefined}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <input type="hidden" name="id" value={grupo.id} />
          <DialogHeader>
            <DialogTitle>Eliminar subgrupo</DialogTitle>
            <DialogDescription>
              Esta acción elimina <strong>{grupo.name}</strong>. Tus estudiantes no se ven afectados, solo se
              quita esta división. No se puede deshacer.
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
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
