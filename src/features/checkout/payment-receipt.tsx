"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { getPaymentReceiptAction, type PaymentReceipt } from "@/app/checkout/gracias/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20; // ~1 minuto

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    value
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ReceiptRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border py-2 text-sm last:border-none">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-semibold text-foreground"}>{value}</span>
    </div>
  );
}

export function PaymentReceiptView({
  initial,
  reference,
}: {
  initial: PaymentReceipt | null;
  reference: string;
}) {
  const [receipt, setReceipt] = React.useState(initial);
  const [pollCount, setPollCount] = React.useState(0);

  React.useEffect(() => {
    if (!reference || receipt?.status !== "pending" || pollCount >= MAX_POLLS) return;
    const timer = setTimeout(async () => {
      const next = await getPaymentReceiptAction(reference);
      setReceipt(next);
      setPollCount((c) => c + 1);
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [receipt, pollCount, reference]);

  if (!receipt) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-10 text-center">
          <TriangleAlert className="mb-3 size-8 text-warning" aria-hidden="true" />
          <h1 className="mb-1.5 text-lg font-extrabold text-primary">No encontramos ese pago</h1>
          <p className="mb-5 text-sm text-muted-foreground">
            Si acabas de pagar, escríbenos por Contacto con tu correo y te confirmamos manualmente.
          </p>
          <Button asChild>
            <Link href="/planes-precios">Volver a planes</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (receipt.status === "pending") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-10 text-center">
          <Loader2 className="mb-3 size-8 animate-spin text-secondary-foreground" aria-hidden="true" />
          <h1 className="mb-1.5 text-lg font-extrabold text-primary">Confirmando tu pago</h1>
          <p className="text-sm text-muted-foreground">
            Wompi nos avisa apenas se procese — normalmente toma solo unos segundos. Esta página se
            actualiza sola, no hace falta que la recargues.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (receipt.status === "approved") {
    return (
      <Card>
        <CardContent>
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-success-foreground text-success">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </div>
            <h1 className="mb-1 text-xl font-extrabold text-primary">¡Pago confirmado!</h1>
            <p className="text-sm text-muted-foreground">Tu cuenta ya está activa.</p>
          </div>

          <div className="mb-5 rounded-xl bg-muted p-4">
            <ReceiptRow label="Plan" value={receipt.planName} />
            <ReceiptRow label="Monto" value={formatCop(receipt.amountCop)} />
            <ReceiptRow label="Fecha" value={formatDate(receipt.createdAt)} />
            <ReceiptRow label="Referencia" value={receipt.reference} mono />
          </div>

          <Button asChild size="lg" className="w-full">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-10 text-center">
        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mb-1.5 text-lg font-extrabold text-primary">El pago no se completó</h1>
        <p className="mb-5 text-sm text-muted-foreground">
          Tu cuenta quedó creada, pero el plan no se activó. Puedes intentar de nuevo o escribirnos por
          Contacto si el problema persiste.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/contacto">Contactar soporte</Link>
          </Button>
          <Button asChild>
            <Link href="/planes-precios">Intentar de nuevo</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
