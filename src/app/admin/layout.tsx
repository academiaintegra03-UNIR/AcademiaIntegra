import { BookOpen, ClipboardList, CreditCard, FileText, Home, Users } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/admin", label: "Resumen general", icon: <Home /> },
  { href: "/admin/usuarios", label: "Usuarios", icon: <Users /> },
  { href: "/admin/programas", label: "Programas", icon: <BookOpen /> },
  { href: "/admin/matriculas", label: "Matrículas", icon: <ClipboardList /> },
  { href: "/admin/pagos", label: "Pagos", icon: <CreditCard /> },
  { href: "/admin/reportes", label: "Reportes", icon: <FileText /> },
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
