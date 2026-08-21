import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveSubscription } from "@/lib/queries/subscription";

export interface ColegioPlanInfo {
  planName: string | null;
  /** Cupo efectivo: el personalizado de la suscripción (seat_limit_override,
   * ajustable por admin) si existe, si no el del plan. */
  seatLimit: number | null;
  /** Sin suscripción activa = flujo gratuito, sin restricción (mismo
   * criterio que el trigger check_colegio_id: sin plan no hay límite). */
  allowSubgrupos: boolean;
  allowAcudientes: boolean;
  studentCount: number;
}

/**
 * Resuelve el plan institucional activo de un colegio (si tiene uno) y
 * cuántos estudiantes ya tiene — usado tanto para mostrar el cupo en
 * /colegios-panel/grupos y /colegios-panel/estudiantes, como para decidir
 * si puede crear subgrupos (createSubgrupoAction) o invitar acudientes
 * (inviteGuardianAction).
 */
export async function getColegioPlanInfo(colegioId: string): Promise<ColegioPlanInfo> {
  const admin = createAdminClient();

  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "estudiante")
    .eq("colegio_id", colegioId);

  const sub = await getActiveSubscription(colegioId, "institucional");

  if (!sub) {
    return { planName: null, seatLimit: null, allowSubgrupos: true, allowAcudientes: true, studentCount: count ?? 0 };
  }

  return {
    planName: sub.planName,
    seatLimit: sub.effectiveSeatLimit,
    allowSubgrupos: sub.allowSubgrupos,
    allowAcudientes: sub.allowAcudientes,
    studentCount: count ?? 0,
  };
}
