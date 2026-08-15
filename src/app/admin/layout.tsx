import { Bot, Home, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

// Programas, Matrículas, Pagos y Reportes siguen con datos de prueba
// simulados — ocultos del menú hasta que tengan datos reales. Las páginas
// en sí no se borraron, solo el enlace en el nav.
const navItems: DashboardNavItem[] = [
  { href: "/admin", label: "Resumen general", icon: <Home /> },
  { href: "/admin/usuarios", label: "Usuarios", icon: <Users /> },
  { href: "/admin/ia", label: "IA (Álex)", icon: <Bot /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireRole("administrador");

  return (
    <DashboardShell
      panelLabel="Administración"
      navItems={navItems}
      pageSubtitle="Datos de prueba — panel administrativo"
      profile={profile}
    >
      {children}
    </DashboardShell>
  );
}
