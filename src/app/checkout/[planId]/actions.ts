"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildIntegritySignature } from "@/lib/wompi";
import type { PlanType, UserRole } from "@/lib/supabase/database.types";

export interface CheckoutState {
  error?: string;
  checkoutUrl?: string;
}

// individual: el comprador es el propio estudiante.
// grupal: el comprador queda como acudiente; los cupos extra se vinculan
//   después como sus estudiantes (guardian_students).
// institucional: el comprador queda como colegio; los cupos extra se
//   vinculan como profiles.colegio_id.
const ROLE_BY_PLAN_TYPE: Record<PlanType, UserRole> = {
  individual: "estudiante",
  grupal: "acudiente",
  institucional: "colegio",
};

/**
 * Derives the real, reachable origin from the incoming request instead of a
 * static env var — works on localhost, any Vercel preview, and production
 * without configuration. (A hardcoded/placeholder site URL here is exactly
 * what sent Wompi's redirect to a domain that doesn't exist.)
 */
async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  if (!host) return "http://localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Creates the account up front (Supabase hashes the password — we never
 * store it) and a `pending` payment row, then hands back a Wompi Web
 * Checkout URL with a server-computed integrity signature. The webhook
 * (api/webhooks/wompi) is what actually grants access on confirmed payment
 * — this action only gets the user to Wompi's hosted page.
 */
export async function startCheckoutAction(formData: FormData): Promise<CheckoutState> {
  const planId = String(formData.get("plan_id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!planId || !nombre || !email) return { error: "Completa todos los campos." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  // .trim(): a stray trailing space/newline from copy-pasting the secret out
  // of Wompi's dashboard silently changes the hash and Wompi rejects it as
  // "firma inválida" with no other clue — this is the #1 real-world cause.
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY?.trim();
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET?.trim();
  if (!publicKey || !integritySecret) {
    return { error: "Los pagos todavía no están disponibles. Escríbenos por Contacto mientras tanto." };
  }

  const admin = createAdminClient();

  const { data: plan } = await admin.from("plans").select("*").eq("id", planId).eq("active", true).single();
  if (!plan) return { error: "Este plan ya no está disponible." };

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: ROLE_BY_PLAN_TYPE[plan.type], nombre },
  });

  if (createError || !created.user) {
    return {
      error: createError?.message.toLowerCase().includes("already been registered")
        ? "Ya existe una cuenta con ese correo. Inicia sesión y escríbenos por Contacto para activar el plan."
        : "No se pudo crear tu cuenta.",
    };
  }

  const reference = `ai-${randomUUID()}`;
  const amountInCents = plan.price_cop * 100;

  const { error: paymentError } = await admin.from("payments").insert({
    reference,
    plan_id: plan.id,
    email,
    nombre,
    amount_cop: plan.price_cop,
    status: "pending",
    profile_id: created.user.id,
  });

  if (paymentError) return { error: "No se pudo iniciar el pago." };

  const signature = buildIntegritySignature({ reference, amountInCents, currency: "COP", integritySecret });
  const origin = await getOrigin();

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency: "COP",
    "amount-in-cents": String(amountInCents),
    reference,
    "signature:integrity": signature,
    // Wompi appends its own `?id=` / `&env=` to this — our own `ref` rides
    // along so /checkout/gracias can look up the right payment.
    "redirect-url": `${origin}/checkout/gracias?ref=${encodeURIComponent(reference)}`,
  });

  return { checkoutUrl: `https://checkout.wompi.co/p/?${params.toString()}` };
}
