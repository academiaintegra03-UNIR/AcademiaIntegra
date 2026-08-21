"use client";

import * as React from "react";
import { toast } from "sonner";
import { createGrupoAction, updateGrupoAction } from "@/app/admin/grupos/actions";
import type { AdminGrupoRow, Colegio, TutorOption } from "@/lib/types/panels";
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
const NO_TUTOR = "__none__";

export function GrupoFormDialog({
  grupo,
  colegios,
  tutores,
  trigger,
}: {
  grupo?: AdminGrupoRow;
  colegios: Colegio[];
  tutores: TutorOption[];
  trigger: React.ReactNode;
}) {
  const isEdit = Boolean(grupo);
  const [open, setOpen] = React.useState(false);
  const [colegioId, setColegioId] = React.useState(grupo?.colegioId ?? "");
  const [tutorId, setTutorId] = React.useState(grupo?.tutorId ?? "");
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await (isEdit ? updateGrupoAction : createGrupoAction)(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success(isEdit ? "Grupo actualizado." : "Grupo creado — ahora agrégale estudiantes.");
      setOpen(false);
      if (!isEdit) formRef.current?.reset();
    });
  }

  // Sin esto, React resetea los campos no controlados apenas la función
  // termina (aunque devolvamos { error }), y el usuario pierde lo que
  // escribió cada vez que falla una validación.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(new FormData(e.currentTarget));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(undefined);
        if (next) {
          setColegioId(grupo?.colegioId ?? "");
          setTutorId(grupo?.tutorId ?? "");
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form ref={formRef} onSubmit={onSubmit}>
          {isEdit ? <input type="hidden" name="id" value={grupo!.id} /> : null}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar grupo" : "Crear grupo"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Nombre, colegio y tutor. Los estudiantes se gestionan aparte, con el botón de personas."
                : "Después de crear el grupo podrás agregarle estudiantes."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="grupo-name">Nombre</Label>
              <Input
                id="grupo-name"
                name="name"
                placeholder="Ej. Aritmética, 8A, Familia Pérez..."
                defaultValue={grupo?.name}
                required
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="grupo-colegio">Colegio (opcional)</Label>
              <input type="hidden" name="colegio_id" value={colegioId} />
              <Select
                value={colegioId || NO_COLEGIO}
                onValueChange={(next) => setColegioId(next === NO_COLEGIO ? "" : next)}
                disabled={isPending || grupo?.esDefaultColegio}
              >
                <SelectTrigger id="grupo-colegio" className="w-full">
                  <SelectValue placeholder="Sin colegio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_COLEGIO}>Sin colegio (familiar / individual / libre)</SelectItem>
                  {colegios.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {grupo?.esDefaultColegio ? (
                <p className="text-xs text-muted-foreground">
                  Grupo automático del colegio — incluye a todos sus estudiantes. No se puede cambiar de
                  colegio.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="grupo-tutor">Tutor (opcional)</Label>
              <input type="hidden" name="tutor_id" value={tutorId} />
              <Select
                value={tutorId || NO_TUTOR}
                onValueChange={(next) => setTutorId(next === NO_TUTOR ? "" : next)}
                disabled={isPending}
              >
                <SelectTrigger id="grupo-tutor" className="w-full">
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_TUTOR}>Sin asignar</SelectItem>
                  {tutores.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
