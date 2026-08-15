"use client";

import * as React from "react";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";
import { startCheckoutAction } from "@/app/checkout/[planId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

function IconField({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon: typeof User }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("pl-8", className)} {...props} />
    </div>
  );
}

export function CheckoutForm({ planId }: { planId: string }) {
  const [error, setError] = React.useState<string>();
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await startCheckoutAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
        <p className="text-xs text-muted-foreground">
          Tus datos viajan cifrados. Pagas directo en la plataforma de Wompi — nunca vemos ni guardamos los
          datos de tu tarjeta o cuenta.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="plan_id" value={planId} />

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="checkout-nombre">Nombre completo</Label>
          <IconField icon={User} id="checkout-nombre" name="nombre" required disabled={isPending} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="checkout-email">Correo</Label>
          <IconField
            icon={Mail}
            id="checkout-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="checkout-password">Contraseña</Label>
          <IconField
            icon={Lock}
            id="checkout-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">La usarás para iniciar sesión después de pagar.</p>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={isPending}>
          {isPending ? (
            "Conectando con Wompi..."
          ) : (
            <>
              <Lock className="size-4" aria-hidden="true" /> Continuar al pago seguro
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Al continuar aceptas ser dirigido a Wompi, una pasarela de pago regulada, para completar tu compra.
        </p>
      </form>
    </div>
  );
}
