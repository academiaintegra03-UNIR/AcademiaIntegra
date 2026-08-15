// Dev-only tooling script — simulates a real Wompi webhook call against your
// local server, so you can test /api/webhooks/wompi end-to-end without
// exposing localhost to the internet (no ngrok/Vercel needed for this).
//
// Usage (from repo root):
//   node --env-file=.env.local scripts/simulate-wompi-webhook.mjs <reference> [APPROVED|DECLINED]
//
// <reference> is the `payments.reference` row to confirm — create one first
// by actually going through /checkout/[planId] locally (it stops at the
// Wompi redirect; the `payments` row with status "pending" already exists
// by then, that's the reference you need).
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

const [, , reference, statusArg] = process.argv;
const status = statusArg ?? "APPROVED";

if (!reference) {
  console.error("Uso: node --env-file=.env.local scripts/simulate-wompi-webhook.mjs <reference> [APPROVED|DECLINED]");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const eventsSecret = process.env.WOMPI_EVENTS_SECRET;

if (!supabaseUrl || !serviceRoleKey || !eventsSecret) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o WOMPI_EVENTS_SECRET en .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: payment, error } = await supabase
  .from("payments")
  .select("reference, amount_cop")
  .eq("reference", reference)
  .single();

if (error || !payment) {
  console.error(`No se encontró un pago con reference "${reference}". ¿Ya pasaste por /checkout/[planId]?`);
  process.exit(1);
}

const transactionId = `sim-${Date.now()}`;
const timestamp = Math.floor(Date.now() / 1000);
const amountInCents = payment.amount_cop * 100;

// Same shape/order Wompi documents for signature.properties on transaction.updated.
const properties = ["transaction.id", "transaction.status", "transaction.amount_in_cents"];
const data = {
  transaction: {
    id: transactionId,
    status,
    reference: payment.reference,
    amount_in_cents: amountInCents,
    currency: "COP",
  },
};

function resolvePath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

const raw =
  properties.map((p) => resolvePath(data, p) ?? "").join("") + timestamp + eventsSecret;
const checksum = createHash("sha256").update(raw).digest("hex");

const event = {
  event: "transaction.updated",
  data,
  environment: "test",
  signature: { properties, checksum },
  timestamp,
  sent_at: new Date().toISOString(),
};

const res = await fetch("http://localhost:3000/api/webhooks/wompi", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(event),
});

console.log(`POST /api/webhooks/wompi -> ${res.status}`);
console.log(await res.text());
