import { NextResponse, type NextRequest } from "next/server";
import { verifyWompiWebhookChecksum, type WompiEvent } from "@/lib/wompi";
import { createAdminClient } from "@/lib/supabase/admin";
import { activateSubscription } from "@/lib/subscriptions";
import { getPaymentReceiptAction } from "@/app/checkout/gracias/actions";
import { sendReceiptEmail } from "@/lib/email/send-receipt-email";
import type { PaymentStatus } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

interface WompiTransaction {
  id: string;
  status: string;
  reference: string;
}

function mapWompiStatus(wompiStatus: string): PaymentStatus {
  switch (wompiStatus) {
    case "APPROVED":
      return "approved";
    case "DECLINED":
      return "declined";
    case "VOIDED":
      return "voided";
    case "ERROR":
      return "error";
    default:
      return "pending";
  }
}

const TERMINAL_STATUSES: PaymentStatus[] = ["approved", "declined", "error", "voided"];

export async function POST(request: NextRequest) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET?.trim();
  if (!eventsSecret) {
    console.error("WOMPI_EVENTS_SECRET is not set.");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let event: WompiEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!event?.signature?.checksum) {
    console.error("Wompi webhook: missing signature — rejecting.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const checksumResult = verifyWompiWebhookChecksum(event, eventsSecret);
  if (!checksumResult.valid) {
    // Safe to log: debug never includes the events secret itself, only the
    // resolved property values and the two checksums being compared.
    console.error("Wompi webhook: checksum mismatch — rejecting.", checksumResult.debug);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Only transaction updates matter here; acknowledge anything else so
  // Wompi doesn't keep retrying an event we deliberately ignore.
  if (event.event !== "transaction.updated") {
    return NextResponse.json({ received: true });
  }

  const transaction = (event.data as { transaction?: WompiTransaction }).transaction;
  if (!transaction?.reference || !transaction.id || !transaction.status) {
    return NextResponse.json({ received: true });
  }

  const admin = createAdminClient();

  const { data: payment } = await admin.from("payments").select("*").eq("reference", transaction.reference).single();
  if (!payment) {
    console.error("Wompi webhook: no payment found for reference", transaction.reference);
    return NextResponse.json({ received: true });
  }

  // Idempotency: once a payment reaches a terminal status, further webhook
  // deliveries for the same reference (retries, duplicate sends) are no-ops.
  if (TERMINAL_STATUSES.includes(payment.status)) {
    return NextResponse.json({ received: true });
  }

  const status = mapWompiStatus(transaction.status);

  await admin
    .from("payments")
    .update({ status, wompi_transaction_id: transaction.id, raw_webhook: event })
    .eq("id", payment.id);

  if (status === "approved" && payment.profile_id) {
    const { error: subError } = await activateSubscription(payment.profile_id, payment.plan_id);
    if (subError) console.error("Wompi webhook: failed to activate subscription:", subError);

    // Best-effort — sendReceiptEmail never throws, así que un correo que
    // falla no afecta la respuesta 200 que espera Wompi.
    const receipt = await getPaymentReceiptAction(payment.reference);
    if (receipt) await sendReceiptEmail(payment.email, receipt);
  }

  return NextResponse.json({ received: true });
}
