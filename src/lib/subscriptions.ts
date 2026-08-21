import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export function computeExpiresAt(durationDays: number | null, from: Date = new Date()): string | null {
  if (!durationDays) return null;
  const d = new Date(from);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString();
}

/**
 * Activa un plan para un perfil: cierra cualquier suscripción `active`
 * previa de ese perfil (queda `cancelled`) y crea la nueva — así nunca
 * quedan dos suscripciones activas del mismo perfil a la vez, sin
 * importar si la activación viene del webhook de Wompi o de un admin.
 */
export async function activateSubscription(
  profileId: string,
  planId: string,
  options?: { expiresAtOverride?: string | null }
): Promise<{ error?: string }> {
  const admin = createAdminClient();

  const { data: plan, error: planError } = await admin
    .from("plans")
    .select("duration_days")
    .eq("id", planId)
    .single();
  if (planError || !plan) return { error: "El plan no existe." };

  const { error: cancelError } = await admin
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("profile_id", profileId)
    .eq("status", "active");
  if (cancelError) {
    console.error("Failed to cancel previous subscriptions:", cancelError);
    return { error: "No se pudo activar la suscripción." };
  }

  const expiresAt =
    options && "expiresAtOverride" in options ? options.expiresAtOverride! : computeExpiresAt(plan.duration_days);

  const { error: insertError } = await admin
    .from("subscriptions")
    .insert({ profile_id: profileId, plan_id: planId, status: "active", expires_at: expiresAt });
  if (insertError) {
    console.error("Failed to insert subscription:", insertError);
    return { error: "No se pudo activar la suscripción." };
  }

  return {};
}
