import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile } from "@/lib/auth/get-profile";
import { getColegioPlanInfo } from "@/lib/queries/colegio-plan";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NameCell } from "@/components/shared/name-cell";
import { InviteGuardianDialog } from "@/features/colegios/invite-guardian-dialog";
import { CreateStudentDialog } from "@/features/colegios/create-student-dialog";

interface ColegioEstudianteRow {
  id: string;
  nombre: string;
  numeroDocumento: string | null;
  acudientesCount: number;
}

async function getColegioEstudiantes(colegioId: string): Promise<ColegioEstudianteRow[]> {
  const admin = createAdminClient();

  const { data: students, error: studentsError } = await admin
    .from("profiles")
    .select("id, nombre")
    .eq("role", "estudiante")
    .eq("colegio_id", colegioId)
    .order("nombre");
  if (studentsError) console.error("Failed to load colegio estudiantes:", studentsError);
  if (!students || students.length === 0) return [];

  const studentIds = students.map((s) => s.id);

  const { data: contactos } = await admin
    .from("profile_contacto")
    .select("profile_id, numero_documento")
    .in("profile_id", studentIds);
  const numeroDocumentoById = new Map((contactos ?? []).map((c) => [c.profile_id, c.numero_documento]));

  const { data: links } = await admin.from("guardian_students").select("student_id").in("student_id", studentIds);
  const acudientesCountByStudent = new Map<string, number>();
  for (const link of links ?? []) {
    acudientesCountByStudent.set(link.student_id, (acudientesCountByStudent.get(link.student_id) ?? 0) + 1);
  }

  return students.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    numeroDocumento: numeroDocumentoById.get(s.id) ?? null,
    acudientesCount: acudientesCountByStudent.get(s.id) ?? 0,
  }));
}

export default async function ColegiosEstudiantesPage() {
  const profile = await getAuthenticatedProfile();
  const [estudiantes, planInfo] = profile
    ? await Promise.all([getColegioEstudiantes(profile.id), getColegioPlanInfo(profile.id)])
    : [[], { planName: null, seatLimit: null, allowSubgrupos: true, allowAcudientes: true, studentCount: 0 }];

  const atLimit = planInfo.seatLimit !== null && planInfo.studentCount >= planInfo.seatLimit;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {planInfo.seatLimit !== null
            ? `${planInfo.studentCount} de ${planInfo.seatLimit} cupos usados.`
            : `${planInfo.studentCount} estudiante${planInfo.studentCount === 1 ? "" : "s"} — sin límite de cupo.`}
        </p>
        <CreateStudentDialog disabled={atLimit} />
      </div>
      {!planInfo.allowAcudientes ? (
        <p className="mb-4 text-sm text-muted-foreground">
          Tu plan actual no incluye invitar acudientes para tus estudiantes.
        </p>
      ) : null}
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Acudientes</TableHead>
              <TableHead className="w-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {estudiantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  Todavía no tienes estudiantes vinculados.
                </TableCell>
              </TableRow>
            ) : (
              estudiantes.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <NameCell name={s.nombre} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.numeroDocumento ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.acudientesCount} vinculado{s.acudientesCount === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      {planInfo.allowAcudientes ? (
                        <InviteGuardianDialog studentId={s.id} studentName={s.nombre} />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}
