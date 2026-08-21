import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminGrupoRow, Colegio, GrupoEstudianteOption, TutorOption } from "@/lib/types/panels";
import { Button } from "@/components/ui/button";
import { GrupoFormDialog } from "@/features/admin/grupo-form-dialog";
import { GruposTable } from "@/features/admin/grupos-table";

interface GruposPageData {
  grupos: AdminGrupoRow[];
  colegios: Colegio[];
  estudiantes: GrupoEstudianteOption[];
  tutores: TutorOption[];
}

async function getGruposPageData(): Promise<GruposPageData> {
  // Cliente admin: la página necesita ver todos los grupos y perfiles sin
  // las restricciones de RLS pensadas para tutores/colegios/estudiantes.
  const admin = createAdminClient();

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, nombre, role, colegio_id")
    .order("nombre");
  if (profilesError) console.error("Failed to load profiles for grupos:", profilesError);

  const { data: grupoRows, error: gruposError } = await admin.from("grupos").select("*").order("name");
  if (gruposError) console.error("Failed to load grupos:", gruposError);

  const { data: memberships, error: membershipsError } = await admin
    .from("grupo_estudiantes")
    .select("grupo_id, student_id");
  if (membershipsError) console.error("Failed to load grupo_estudiantes:", membershipsError);

  // 0011_profile_contacto.sql puede no estar aplicada todavía — degrada a
  // "sin número de documento" en vez de romper la página.
  const { data: contactos, error: contactosError } = await admin
    .from("profile_contacto")
    .select("profile_id, numero_documento");
  if (contactosError) console.error("Failed to load profile_contacto for grupos:", contactosError);
  const numeroDocumentoById = new Map((contactos ?? []).map((c) => [c.profile_id, c.numero_documento]));

  const nombreById = new Map((profiles ?? []).map((p) => [p.id, p.nombre]));

  const studentIdsByGrupo = new Map<string, string[]>();
  for (const m of memberships ?? []) {
    const existing = studentIdsByGrupo.get(m.grupo_id) ?? [];
    existing.push(m.student_id);
    studentIdsByGrupo.set(m.grupo_id, existing);
  }

  const grupos: AdminGrupoRow[] = (grupoRows ?? []).map((g) => ({
    id: g.id,
    name: g.name,
    colegioId: g.colegio_id,
    colegioNombre: g.colegio_id ? (nombreById.get(g.colegio_id) ?? null) : null,
    tutorId: g.tutor_id,
    tutorNombre: g.tutor_id ? (nombreById.get(g.tutor_id) ?? null) : null,
    esDefaultColegio: g.es_default_colegio,
    studentIds: studentIdsByGrupo.get(g.id) ?? [],
  }));

  const colegios: Colegio[] = (profiles ?? [])
    .filter((p) => p.role === "colegio")
    .map((p) => ({ id: p.id, nombre: p.nombre }));

  const estudiantes: GrupoEstudianteOption[] = (profiles ?? [])
    .filter((p) => p.role === "estudiante")
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      colegioId: p.colegio_id,
      colegioNombre: p.colegio_id ? (nombreById.get(p.colegio_id) ?? null) : null,
      numeroDocumento: numeroDocumentoById.get(p.id) ?? null,
    }));

  const tutores: TutorOption[] = (profiles ?? [])
    .filter((p) => p.role === "tutor")
    .map((p) => ({ id: p.id, nombre: p.nombre }));

  return { grupos, colegios, estudiantes, tutores };
}

export default async function AdminGruposPage() {
  const { grupos, colegios, estudiantes, tutores } = await getGruposPageData();

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <GrupoFormDialog
          colegios={colegios}
          tutores={tutores}
          trigger={<Button size="sm">+ Crear grupo</Button>}
        />
      </div>
      <GruposTable grupos={grupos} colegios={colegios} tutores={tutores} estudiantes={estudiantes} />
    </div>
  );
}
