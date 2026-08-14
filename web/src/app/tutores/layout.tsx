import { CalendarDays, ClipboardList, FileText, GraduationCap, Mail } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/tutores", label: "Agenda", icon: <CalendarDays /> },
  { href: "/tutores/estudiantes", label: "Estudiantes asignados", icon: <GraduationCap /> },
  { href: "/tutores/actividades", label: "Actividades por calificar", icon: <ClipboardList /> },
  { href: "/tutores/mensajes", label: "Mensajes", icon: <Mail /> },
  { href: "/tutores/informes", label: "Informes", icon: <FileText /> },
];

export default async function TutoresLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole("tutor");

  return (
    <DashboardShell
      panelLabel="Panel del tutor"
      navItems={navItems}
      pageSubtitle="Datos de prueba — panel del tutor"
      profile={profile}
    >
      {children}
    </DashboardShell>
  );
}
