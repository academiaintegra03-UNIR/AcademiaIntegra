"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { activateSubscription } from "@/lib/subscriptions";
import { EXPECTED_PLAN_TYPE_BY_ROLE } from "@/lib/data/roles";
import type { Role } from "@/lib/types/session";

export interface SubscriptionActionState {
  error?: string;
  success?: boolean;
}

export async function activateSubscriptionAction(formData: FormData): Promise<SubscriptionActionState> {
  await requireRole("administrador");

  const profileId = String(formData.get("profile_id") ?? "");
  const planId = String(formData.get("plan_id") ?? "");
  if (!profileId || !planId) return { error: "Selecciona un plan." };

  const admin = createAdminClient();

  const { data: profile } = await admin.from("profiles").select("role").eq("id", profileId).single();
  const { data: plan } = await admin.from("plans").select("type").eq("id", planId).single();
  const expectedType = profile ? EXPECTED_PLAN_TYPE_BY_ROLE[profile.role as Role] : undefined;
  if (!profile || !plan || plan.type !== expectedType) {
    return { error: "Ese plan no corresponde al rol de este usuario." };
  }

  const { error } = await activateSubscription(profileId, planId);
  if (error) return { error };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateSubscriptionAction(formData: FormData): Promise<SubscriptionActionState> {
  await requireRole("administrador");

  const subscriptionId = String(formData.get("subscription_id") ?? "");
  if (!subscriptionId) return { error: "Falta la suscripción." };

  const seatLimitOverrideRaw = String(formData.get("seat_limit_override") ?? "").trim();
  const seatLimitOverride = seatLimitOverrideRaw ? Number(seatLimitOverrideRaw) : null;
  if (seatLimitOverrideRaw && (!Number.isFinite(seatLimitOverride) || (seatLimitOverride as number) <= 0)) {
    return { error: "El cupo personalizado debe ser un número mayor a 0." };
  }

  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();
  // El input date manda "YYYY-MM-DD" — se guarda al final de ese día.
  const expiresAt = expiresAtRaw ? new Date(`${expiresAtRaw}T23:59:59`).toISOString() : null;

  const admin = createAdminClient();
  const { error } = await admin
    .from("subscriptions")
    .update({ seat_limit_override: seatLimitOverride, expires_at: expiresAt })
    .eq("id", subscriptionId);

  if (error) {
    console.error("Failed to update subscription:", error);
    return { error: "No se pudo actualizar la suscripción." };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function cancelSubscriptionAction(formData: FormData): Promise<SubscriptionActionState> {
  await requireRole("administrador");

  const subscriptionId = String(formData.get("subscription_id") ?? "");
  if (!subscriptionId) return { error: "Falta la suscripción." };

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").update({ status: "cancelled" }).eq("id", subscriptionId);

  if (error) {
    console.error("Failed to cancel subscription:", error);
    return { error: "No se pudo cancelar la suscripción." };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}
