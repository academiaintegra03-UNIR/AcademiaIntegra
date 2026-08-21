import "server-only";
import { Resend } from "resend";

let cached: Resend | null | undefined;

/** null cuando falta RESEND_API_KEY — el llamador decide cómo degradar. */
export function getResendClient(): Resend | null {
  if (cached !== undefined) return cached;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  cached = apiKey ? new Resend(apiKey) : null;
  return cached;
}
