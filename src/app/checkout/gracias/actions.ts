"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { PaymentStatus } from "@/lib/supabase/database.types";

export interface PaymentReceipt {
  planName: string;
  amountCop: number;
  status: PaymentStatus;
  createdAt: string;
  reference: string;
}

/**
 * Looks up a payment by its reference for the receipt page. Uses the admin
 * client (payments has no public RLS policy — only admins can list them),
 * but this only ever returns the single row matching an exact reference the
 * caller already has in hand (a random UUID from their own checkout), never
 * a browsable list, so there's no broader exposure.
 */
export async function getPaymentReceiptAction(reference: string): Promise<PaymentReceipt | null> {
  if (!reference) return null;

  const admin = createAdminClient();
  const { data: payment } = await admin
    .from("payments")
    .select("plan_id, amount_cop, status, created_at, reference")
    .eq("reference", reference)
    .single();

  if (!payment) return null;

  const { data: plan } = await admin.from("plans").select("name").eq("id", payment.plan_id).single();

  return {
    planName: plan?.name ?? "Plan",
    amountCop: payment.amount_cop,
    status: payment.status,
    createdAt: payment.created_at,
    reference: payment.reference,
  };
}
