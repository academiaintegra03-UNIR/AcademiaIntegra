import { GraduationCap, Settings, School, Presentation, Users } from "lucide-react";
import type { StatusTone } from "@/components/shared/status-badge";
import type { Role, RoleOption } from "@/lib/types/session";

export const roleOptions: RoleOption[] = [
  {
    role: "estudiante",
    label: "Estudiante",
    description: "Accede a tu ruta de aprendizaje, cursos, simulacros y tutor con IA.",
    icon: GraduationCap,
    homePath: "/campus",
  },
  {
    role: "acudiente",
    label: "Acudiente",
    description: "Consulta el progreso, reportes y pagos de tu estudiante.",
    icon: Users,
    homePath: "/acudientes",
  },
  {
    role: "colegio",
    label: "Colegio",
    description: "Gestiona grupos, resultados agregados y simulacros institucionales.",
    icon: School,
    homePath: "/colegios-panel",
  },
  {
    role: "tutor",
    label: "Tutor",
    description: "Consulta tu agenda, estudiantes asignados y actividades por calificar.",
    icon: Presentation,
    homePath: "/tutores",
  },
  {
    role: "administrador",
    label: "Administrador",
    description: "Panel general: usuarios, programas, matrículas, pagos y reportes.",
    icon: Settings,
    homePath: "/admin",
  },
];

export function roleOptionFor(role: RoleOption["role"]) {
  return roleOptions.find((r) => r.role === role);
}

const roleTones: Record<Role, StatusTone> = {
  estudiante: "info",
  tutor: "info",
  acudiente: "warning",
  colegio: "warning",
  administrador: "error",
};

/** Badge tone for a role — used anywhere a role is shown as a colored pill. */
export function roleTone(role: Role): StatusTone {
  return roleTones[role];
}
