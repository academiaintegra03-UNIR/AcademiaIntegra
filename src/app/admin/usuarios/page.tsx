import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile } from "@/lib/auth/get-profile";
import { roleOptionFor, roleTone, EXPECTED_PLAN_TYPE_BY_ROLE } from "@/lib/data/roles";
import type { AdminUserRow, Colegio, EstudianteOption, PlanOption } from "@/lib/types/panels";
import type { Role } from "@/lib/types/session";
import type { PlanBillingType } from "@/lib/supabase/database.types";
import { CreateUserDialog } from "@/features/admin/create-user-dialog";
import { UsersTable } from "@/features/admin/users-table";

interface UsuariosPageData {
  rows: AdminUserRow[];
  colegios: Colegio[];
  estudiantes: EstudianteOption[];
  planes: PlanOption[];
}

async function getUsuariosPageData(): Promise<UsuariosPageData> {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, role, colegio_id")
    .order("nombre");

  if (!profiles || profiles.length === 0) return { rows: [], colegios: [], estudiantes: [], planes: [] };

  // `profiles` has no email column — only auth.users does, and only the
  // admin (service-role) client can read it.
  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email ?? "—"]) ?? []);
  const nombreById = new Map(profiles.map((p) => [p.id, p.nombre]));

  // 0003_relationships.sql may not be applied yet — degrade to no links
  // instead of breaking the whole page.
  const { data: links, error: linksError } = await supabase
    .from("guardian_students")
    .select("guardian_id, student_id");
  if (linksError) console.error("Failed to load guardian_students:", linksError);

  const linkedStudentIdsByGuardian = new Map<string, string[]>();
  for (const link of links ?? []) {
    const existing = linkedStudentIdsByGuardian.get(link.guardian_id) ?? [];
    existing.push(link.student_id);
    linkedStudentIdsByGuardian.set(link.guardian_id, existing);
  }

  // 0011_profile_contacto.sql también puede no estar aplicada todavía —
  // mismo criterio: degrada a "sin datos de contacto" en vez de romper.
  const { data: contactos, error: contactosError } = await supabase
    .from("profile_contacto")
    .select("profile_id, telefono, tipo_documento, numero_documento");
  if (contactosError) console.error("Failed to load profile_contacto:", contactosError);
  const contactoById = new Map((contactos ?? []).map((c) => [c.profile_id, c]));

  // Suscripción activa y no vencida de cada perfil que puede tener plan
  // (estudiante/individual, acudiente/grupal, colegio/institucional) —
  // para poder activar/ajustar cupo/vencimiento desde "Gestionar suscripción".
  const subscribableIds = profiles
    .filter((p) => p.role in EXPECTED_PLAN_TYPE_BY_ROLE)
    .map((p) => p.id);
  const nowIso = new Date().toISOString();
  const { data: subs } = await admin
    .from("subscriptions")
    .select("id, profile_id, plan_id, seat_limit_override, expires_at")
    .in("profile_id", subscribableIds.length > 0 ? subscribableIds : [""])
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("started_at", { ascending: false });

  // Todos los planes activos — para el selector de "Activar suscripción".
  const { data: allPlans } = await admin
    .from("plans")
    .select("id, name, type, seat_limit, billing_type, duration_days")
    .eq("active", true)
    .order("name");
  const planById = new Map((allPlans ?? []).map((p) => [p.id, p]));

  const subscriptionByProfile = new Map<
    string,
    {
      id: string;
      planName: string;
      planSeatLimit: number | null;
      seatLimitOverride: number | null;
      billingType: PlanBillingType;
      expiresAt: string | null;
    }
  >();
  for (const s of subs ?? []) {
    if (subscriptionByProfile.has(s.profile_id)) continue; // ya tenemos la más reciente (ordenado desc)
    const plan = planById.get(s.plan_id);
    const profileRole = profiles.find((p) => p.id === s.profile_id)?.role;
    if (!plan || !profileRole || plan.type !== EXPECTED_PLAN_TYPE_BY_ROLE[profileRole as Role]) continue;
    subscriptionByProfile.set(s.profile_id, {
      id: s.id,
      planName: plan.name,
      planSeatLimit: plan.seat_limit,
      seatLimitOverride: s.seat_limit_override,
      billingType: plan.billing_type,
      expiresAt: s.expires_at,
    });
  }

  const planes: PlanOption[] = (allPlans ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    seatLimit: p.seat_limit,
    billingType: p.billing_type,
    durationDays: p.duration_days,
  }));

  const colegios: Colegio[] = profiles
    .filter((p) => p.role === "colegio")
    .map((p) => ({ id: p.id, nombre: p.nombre }));

  const estudiantes: EstudianteOption[] = profiles
    .filter((p) => p.role === "estudiante")
    .map((p) => ({ id: p.id, nombre: p.nombre }));

  const rows: AdminUserRow[] = profiles.map((profile) => ({
    id: profile.id,
    name: profile.nombre,
    email: emailById.get(profile.id) ?? "—",
    role: profile.role,
    roleLabel: roleOptionFor(profile.role)?.label ?? profile.role,
    roleTone: roleTone(profile.role),
    colegioId: profile.colegio_id,
    colegioNombre: profile.colegio_id ? (nombreById.get(profile.colegio_id) ?? null) : null,
    linkedStudentIds: linkedStudentIdsByGuardian.get(profile.id) ?? [],
    telefono: contactoById.get(profile.id)?.telefono ?? null,
    tipoDocumento: contactoById.get(profile.id)?.tipo_documento ?? null,
    numeroDocumento: contactoById.get(profile.id)?.numero_documento ?? null,
    subscription: subscriptionByProfile.get(profile.id) ?? null,
  }));

  return { rows, colegios, estudiantes, planes };
}

export default async function AdminUsuariosPage() {
  const [{ rows, colegios, estudiantes, planes }, currentProfile] = await Promise.all([
    getUsuariosPageData(),
    getAuthenticatedProfile(),
  ]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CreateUserDialog colegios={colegios} />
      </div>
      <UsersTable
        rows={rows}
        currentUserId={currentProfile?.id ?? ""}
        colegios={colegios}
        estudiantes={estudiantes}
        planes={planes}
      />
    </div>
  );
}
