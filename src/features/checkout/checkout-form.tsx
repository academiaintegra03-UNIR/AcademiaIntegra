"use client";

import * as React from "react";
import { startCheckoutAction } from "@/app/checkout/[planId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="plan_id" value={planId} />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="checkout-nombre">Nombre completo</Label>
        <Input id="checkout-nombre" name="nombre" required disabled={isPending} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="checkout-email">Correo</Label>
        <Input id="checkout-email" name="email" type="email" autoComplete="email" required disabled={isPending} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="checkout-password">Contraseña</Label>
        <Input
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

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Conectando con Wompi..." : "Ir a pagar"}
      </Button>
    </form>
  );
}
