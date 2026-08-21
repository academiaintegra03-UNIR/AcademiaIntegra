"use client";

import * as React from "react";
import { toast } from "sonner";
import { createSubgrupoAction } from "@/app/colegios-panel/grupos/actions";
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

export function CreateSubgrupoDialog() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await createSubgrupoAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast.success("Subgrupo creado — ahora agrégale estudiantes.");
      setOpen(false);
      formRef.current?.reset();
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
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); setError(undefined); }}>
      <DialogTrigger asChild>
        <Button size="sm">+ Crear subgrupo</Button>
      </DialogTrigger>
      <DialogContent>
        <form ref={formRef} onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Crear subgrupo</DialogTitle>
            <DialogDescription>
              Ej. &ldquo;8A&rdquo;, &ldquo;8B&rdquo;, &ldquo;Grado 10°&rdquo; — para dividir a tus estudiantes
              en clases dentro de tu colegio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subgrupo-name">Nombre</Label>
              <Input id="subgrupo-name" name="name" required disabled={isPending} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
