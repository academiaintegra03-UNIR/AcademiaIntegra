"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/session/session-context";
import { roleOptionFor, roleOptions } from "@/lib/data/roles";
import type { Role } from "@/lib/types/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RoleSelect() {
  const { setRole } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRole = searchParams.get("next");
  const requestedOption = nextRole ? roleOptionFor(nextRole as Role) : undefined;

  function handleSelect(option: (typeof roleOptions)[number]) {
    setRole(option.role, option.nombreDemo);
    router.push(option.homePath);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-extrabold text-primary sm:text-3xl">Iniciar sesión</h1>
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          El acceso real (correo y contraseña, con Supabase) se conecta en la siguiente fase del
          proyecto. Por ahora, elige un rol de demostración para ver ese panel con datos de prueba.
        </p>
      </div>

      {requestedOption ? (
        <Alert className="mb-6 border-none bg-warning-foreground">
          <AlertDescription className="text-sm font-semibold text-warning">
            Esa página requiere el rol &ldquo;{requestedOption.label}&rdquo;. Selecciónalo abajo para
            continuar en modo demostración.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {roleOptions.map((option) => (
          <Card key={option.role} className="h-full">
            <CardContent className="flex h-full flex-col gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <option.icon className="size-5" aria-hidden="true" />
              </div>
              <div className="text-base font-bold text-primary">{option.label}</div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>
              <Button onClick={() => handleSelect(option)} className="mt-1 w-full">
                Entrar como {option.label.toLowerCase()} (demo)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-muted p-4 text-center text-xs text-muted-foreground">
        Modo demostración: los datos de estos paneles son de prueba y no representan información real de
        estudiantes, colegios ni familias.
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-bold text-secondary-foreground">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
