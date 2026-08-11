import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { institutionalPricingNote, pricingNote, pricingPlans } from "@/lib/data/pricing";
import { PendingBadge } from "@/components/shared/pending-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Planes y precios" };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <h1 className="mb-2 text-center text-3xl font-extrabold text-primary">Planes y precios</h1>
      <p className="mb-2 text-center text-base text-muted-foreground">
        Elige la modalidad que se ajuste a tu ritmo de estudio.
      </p>
      <p className="mb-3 text-center text-xs font-semibold text-warning">{pricingNote}</p>
      <div className="mb-10 flex justify-center">
        <PendingBadge />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn("flex flex-col", plan.badge ? "ring-2 ring-primary" : "ring-1 ring-border")}
          >
            <CardContent className="flex flex-1 flex-col">
              {plan.badge ? (
                <span className="mb-2.5 inline-block w-fit rounded-full bg-[#F2954A] px-2.5 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </span>
              ) : null}
              <div className="mb-1.5 text-lg font-extrabold text-primary">{plan.name}</div>
              <div className="mb-3.5 min-h-9 text-sm text-muted-foreground">{plan.tagline}</div>
              <div className="mb-0.5 text-2xl font-extrabold text-primary">{plan.price}</div>
              <div className="mb-4 text-xs text-muted-foreground">{plan.period}</div>
              {plan.features.map((f) => (
                <div key={f} className="mb-2 flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <span className="text-xs text-foreground/80">{f}</span>
                </div>
              ))}
              <Button className="mt-4 w-full" asChild>
                <Link href="/contacto">Solicitar información</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-secondary p-7">
        <div>
          <div className="mb-1 text-base font-extrabold text-primary">Planes institucionales para colegios</div>
          <div className="text-sm text-foreground/80">{institutionalPricingNote}</div>
        </div>
        <Button className="shrink-0" asChild>
          <Link href="/contacto">Contactar equipo de colegios</Link>
        </Button>
      </div>
    </div>
  );
}
