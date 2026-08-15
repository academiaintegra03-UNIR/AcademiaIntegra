import Link from "next/link";
import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Confirmando tu pago" };

export default function CheckoutGraciasPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:px-8">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Clock className="size-6" aria-hidden="true" />
      </div>
      <h1 className="mb-2 text-2xl font-extrabold text-primary">Estamos confirmando tu pago</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Wompi nos avisa en cuanto el pago se procesa — normalmente toma solo unos segundos, a veces unos
        minutos. En cuanto se confirme, tu cuenta queda activa y puedes iniciar sesión con el correo y la
        contraseña que registraste.
      </p>
      <Button asChild>
        <Link href="/login">Ir a iniciar sesión</Link>
      </Button>
    </div>
  );
}
