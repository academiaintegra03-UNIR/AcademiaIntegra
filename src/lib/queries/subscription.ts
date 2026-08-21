import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanType, PlanBillingType } from "@/lib/supabase/database.types";

export interface ActiveSubscriptionInfo {
  subscriptionId: string;
  planId: string;
  planName: string;
  planSeatLimit: number | null;
  seatLimitOverride: number | null;
  /** Cupo efectivo: el personalizado si el admin puso uno, si no el del plan. */
  effectiveSeatLimit: number | null;
  allowSubgrupos: boolean;
  allowAcudientes: boolean;
  billingType: PlanBillingType;
  expiresAt: string | null;
}

/**
 * Busca la suscripción activa y no vencida de un perfil, cuyo plan sea del
 * tipo esperado para su rol (individual/grupal/institucional). Sin fila
 * de subscriptions, o vencida (expires_at pasado), o de otro tipo de plan
 * → null, sin distinguir el motivo (mismo trato que "sin plan").
 */
export async function getActiveSubscription(
  profileId: string,
  expectedType: PlanType
): Promise<ActiveSubscriptionInfo | null> {
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: sub } = await admin
    .from("subscriptions")
    .select("id, plan_id, seat_limit_override, expires_at")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) return null;

  const { data: plan } = await admin
    .from("plans")
    .select("name, type, seat_limit, allow_subgrupos, allow_acudientes, billing_type")
    .eq("id", sub.plan_id)
    .single();

  if (!plan || plan.type !== expectedType) return null;

  return {
    subscriptionId: sub.id,
    planId: sub.plan_id,
    planName: plan.name,
    planSeatLimit: plan.seat_limit,
    seatLimitOverride: sub.seat_limit_override,
    effectiveSeatLimit: sub.seat_limit_override ?? plan.seat_limit,
    allowSubgrupos: plan.allow_subgrupos,
    allowAcudientes: plan.allow_acudientes,
    billingType: plan.billing_type,
    expiresAt: sub.expires_at,
  };
}
