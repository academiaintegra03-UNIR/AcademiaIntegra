import "server-only";
import { createHash } from "node:crypto";

/**
 * Checkout integrity signature — Wompi's docs are explicit that this must be
 * generated server-side, never in the browser, since it's derived from the
 * integrity secret.
 * https://docs.wompi.co/docs/colombia/widget-checkout-web/
 */
export function buildIntegritySignature({
  reference,
  amountInCents,
  currency,
  integritySecret,
}: {
  reference: string;
  amountInCents: number;
  currency: string;
  integritySecret: string;
}): string {
  const raw = `${reference}${amountInCents}${currency}${integritySecret}`;
  return createHash("sha256").update(raw).digest("hex");
}

interface WompiEventSignature {
  properties: string[];
  checksum: string;
}

export interface WompiEvent {
  event: string;
  data: Record<string, unknown>;
  environment: string;
  signature: WompiEventSignature;
  timestamp: number;
  sent_at: string;
}

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

/**
 * Verifies a Wompi webhook checksum. Never process an event without calling
 * this first — the endpoint is public and unauthenticated by design (Wompi
 * calls it directly), so the checksum is the only thing standing between us
 * and someone POSTing a fake "payment approved" event.
 * https://docs.wompi.co/docs/colombia/eventos/
 */
export function verifyWompiWebhookChecksum(event: WompiEvent, eventsSecret: string): boolean {
  const values = event.signature.properties.map((path) => resolvePath(event.data, path) ?? "");
  const raw = `${values.join("")}${event.timestamp}${eventsSecret}`;
  const expected = createHash("sha256").update(raw).digest("hex");
  return expected.toLowerCase() === event.signature.checksum.toLowerCase();
}
