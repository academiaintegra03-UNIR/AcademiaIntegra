"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { PaymentStatus, DocumentType } from "@/lib/supabase/database.types";

export interface PaymentReceipt {
  reference: string;
  status: PaymentStatus;
  createdAt: string;
  // Cliente — nombre/correo ya quedaron en el pago desde el checkout;
  // el documento es opcional (depende de si profile_contacto tiene datos).
  nombre: string;
  email: string;
  tipoDocumento: DocumentType | null;
  numeroDocumento: string | null;
  // Plan
  planName: string;
  planDescription: string;
  planPeriod: string;
  amountCop: number;
}

/**
 * Looks up a payment by its reference for the receipt page (pantalla, PDF
 * y correo comparten exactamente estos datos — un solo lugar que los
 * arma). Uses the admin client (payments has no public RLS policy — only
 * admins can list them), but this only ever returns the single row
 * matching an exact reference the caller already has in hand (a random
 * UUID from their own checkout), never a browsable list, so there's no
 * broader exposure.
 */
export async function getPaymentReceiptAction(reference: string): Promise<PaymentReceipt | null> {
  if (!reference) return null;

  const admin = createAdminClient();
  const { data: payment } = await admin
    .from("payments")
    .select("plan_id, amount_cop, status, created_at, reference, nombre, email, profile_id")
    .eq("reference", reference)
    .single();

  if (!payment) return null;

  const { data: plan } = await admin
    .from("plans")
    .select("name, description, period")
    .eq("id", payment.plan_id)
    .single();

  let tipoDocumento: DocumentType | null = null;
  let numeroDocumento: string | null = null;
  if (payment.profile_id) {
    const { data: contacto } = await admin
      .from("profile_contacto")
      .select("tipo_documento, numero_documento")
      .eq("profile_id", payment.profile_id)
      .maybeSingle();
    tipoDocumento = contacto?.tipo_documento ?? null;
    numeroDocumento = contacto?.numero_documento ?? null;
  }

  return {
    reference: payment.reference,
    status: payment.status,
    createdAt: payment.created_at,
    nombre: payment.nombre,
    email: payment.email,
    tipoDocumento,
    numeroDocumento,
    planName: plan?.name ?? "Plan",
    planDescription: plan?.description ?? "",
    planPeriod: plan?.period ?? "",
    amountCop: payment.amount_cop,
  };
}
