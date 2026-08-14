import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile } from "@/lib/auth/get-profile";
import { roleOptionFor, roleTone } from "@/lib/data/roles";
import type { AdminUserRow } from "@/lib/types/panels";
import { CreateUserDialog } from "@/features/admin/create-user-dialog";
import { UsersTable } from "@/features/admin/users-table";

async function getUserRows(): Promise<AdminUserRow[]> {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, nombre, role")
    .order("nombre");

  if (!profiles || profiles.length === 0) return [];

  // `profiles` has no email column — only auth.users does, and only the
  // admin (service-role) client can read it.
  const admin = createAdminClient();
  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email ?? "—"]) ?? []);

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.nombre,
    email: emailById.get(profile.id) ?? "—",
    role: profile.role,
    roleLabel: roleOptionFor(profile.role)?.label ?? profile.role,
    roleTone: roleTone(profile.role),
  }));
}

export default async function AdminUsuariosPage() {
  const [rows, currentProfile] = await Promise.all([getUserRows(), getAuthenticatedProfile()]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <CreateUserDialog />
      </div>
      <UsersTable rows={rows} currentUserId={currentProfile?.id ?? ""} />
    </div>
  );
}
