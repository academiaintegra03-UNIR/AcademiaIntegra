import { GraduationCap, Settings, School, Presentation, Users } from "lucide-react";
import type { RoleOption } from "@/lib/types/session";

export const roleOptions: RoleOption[] = [
  {
    role: "estudiante",
    label: "Estudiante",
    description: "Accede a tu ruta de aprendizaje, cursos, simulacros y tutor con IA.",
    icon: GraduationCap,
    nombreDemo: "Mariana Gómez",
    homePath: "/campus",
  },
  {
    role: "acudiente",
    label: "Acudiente",
    description: "Consulta el progreso, reportes y pagos de tu estudiante.",
    icon: Users,
    nombreDemo: "Luisa Gómez",
    homePath: "/acudientes",
  },
  {
    role: "colegio",
    label: "Colegio",
    description: "Gestiona grupos, resultados agregados y simulacros institucionales.",
    icon: School,
    nombreDemo: "Colegio San Rafael",
    homePath: "/colegios-panel",
  },
  {
    role: "tutor",
    label: "Tutor",
    description: "Consulta tu agenda, estudiantes asignados y actividades por calificar.",
    icon: Presentation,
    nombreDemo: "Andrés Rojas",
    homePath: "/tutores",
  },
  {
    role: "administrador",
    label: "Administrador",
    description: "Panel general: usuarios, programas, matrículas, pagos y reportes.",
    icon: Settings,
    nombreDemo: "Sofía Arango",
    homePath: "/admin",
  },
];

export function roleOptionFor(role: RoleOption["role"]) {
  return roleOptions.find((r) => r.role === role);
}
