import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile } from "@/lib/auth/get-profile";
import { roleOptionFor, roleTone } from "@/lib/data/roles";
import type { AdminUserRow, Colegio } from "@/lib/types/panels";
import { CreateUserDialog } from "@/features/admin/create-user-dialog";
import { UsersTable } from "@/features/admin/users-table";

async function getUsersAndColegios(): Promise<{ rows: AdminUserRow[]; colegios: Colegio[] }> {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, role, colegio_id")
    .order("nombre");

  if (!profiles || profiles.length === 0) return { rows: [], colegios: [] };

  // `profiles` has no email column — only auth.users does, and only the
  // admin (service-role) client can read it.
  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email ?? "—"]) ?? []);
  const nombreById = new Map(profiles.map((p) => [p.id, p.nombre]));

  const colegios: Colegio[] = profiles
    .filter((p) => p.role === "colegio")
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
  }));

  return { rows, colegios };
}

export default async function AdminUsuariosPage() {
  const [{ rows, colegios }, currentProfile] = await Promise.all([
    getUsersAndColegios(),
    getAuthenticatedProfile(),
  ]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CreateUserDialog colegios={colegios} />
      </div>
      <UsersTable rows={rows} currentUserId={currentProfile?.id ?? ""} colegios={colegios} />
    </div>
  );
}
