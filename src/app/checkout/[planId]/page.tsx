import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutForm } from "@/features/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(
    value
  );
}

export default async function CheckoutPage({ params }: PageProps<"/checkout/[planId]">) {
  const { planId } = await params;

  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).eq("active", true).single();
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-8">
      <h1 className="mb-6 text-center text-2xl font-extrabold text-primary">Confirma tu inscripción</h1>

      <Card className="mb-6">
        <CardContent>
          <div className="mb-1 text-lg font-extrabold text-primary">{plan.name}</div>
          <p className="mb-3 text-sm text-muted-foreground">{plan.description}</p>
          {plan.seat_limit ? (
            <div className="mb-3 inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
              Hasta {plan.seat_limit} estudiantes
            </div>
          ) : null}
          <div className="mb-3 text-xl font-extrabold text-primary">
            {formatCop(plan.price_cop)}{" "}
            <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>
          </div>
          {plan.features.map((f) => (
            <div key={f} className="mb-1.5 flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
              <span className="text-xs text-foreground/80">{f}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <CheckoutForm planId={plan.id} />

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Te llevaremos a Wompi para completar el pago de forma segura.
      </p>
    </div>
  );
}
