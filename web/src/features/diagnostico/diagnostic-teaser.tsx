"use client";

import * as React from "react";
import { diagnosticSteps } from "@/lib/data/home-content";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DiagnosticTeaser() {
  const [started, setStarted] = React.useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-8">
      <div className="mb-2.5 text-xs font-bold tracking-wide text-[#2FA6A1] uppercase">
        Gratis · Sin compromiso
      </div>
      <h1 className="mb-3.5 text-3xl font-extrabold text-primary">Diagnóstico académico</h1>
      <p className="mb-8 text-base leading-relaxed text-foreground/80">
        Un vistazo breve y claro a tu nivel actual: identificamos tus fortalezas y las áreas donde más te
        conviene reforzar. No usamos puntajes garantizados ni predicciones — solo una recomendación
        honesta de por dónde empezar.
      </p>

      <div className="mb-8 flex flex-col gap-2.5 text-left">
        {diagnosticSteps.map((s) => (
          <div key={s.n} className="flex items-center gap-3.5 rounded-[10px] border border-border bg-card px-4 py-3.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              {s.n}
            </div>
            <div className="text-sm font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <Button size="lg" className="mb-3" onClick={() => setStarted(true)}>
        Comenzar diagnóstico
      </Button>
      <div className="text-xs text-muted-foreground">
        Si el estudiante es menor de edad, se solicitará el consentimiento de su acudiente antes de
        comenzar.
      </div>

      {started ? (
        <Alert className="mt-6 border-none bg-secondary text-left">
          <AlertDescription className="text-sm font-semibold text-secondary-foreground">
            El flujo completo de preguntas se habilita en la siguiente iteración del proyecto. Te
            contactamos por WhatsApp o correo para coordinar tu diagnóstico mientras tanto — completa tus
            datos en Contacto.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
