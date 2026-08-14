import { BarChart3, Bot, BookOpen, ClipboardList, Compass, HelpCircle, Home } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/campus", label: "Inicio", icon: <Home /> },
  { href: "/campus/mi-ruta", label: "Mi ruta", icon: <Compass /> },
  { href: "/campus/cursos", label: "Mis cursos", icon: <BookOpen /> },
  { href: "/campus/banco-preguntas", label: "Banco de preguntas", icon: <HelpCircle /> },
  { href: "/campus/simulacros", label: "Simulacros", icon: <ClipboardList /> },
  { href: "/campus/progreso", label: "Progreso", icon: <BarChart3 /> },
  { href: "/campus/tutor-ia", label: "Tutor con IA", icon: <Bot /> },
];

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole("estudiante");

  return (
    <DashboardShell
      panelLabel="Campus"
      navItems={navItems}
      pageSubtitle="Datos de prueba — panel del estudiante"
      profile={profile}
    >
      {children}
    </DashboardShell>
  );
}
