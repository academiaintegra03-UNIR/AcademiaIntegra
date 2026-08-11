"use client";

import { BookOpen, ClipboardList, CreditCard, FileText, Home, Users } from "lucide-react";
import { RoleGuard } from "@/lib/session/role-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/admin", label: "Resumen general", icon: Home },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/programas", label: "Programas", icon: BookOpen },
  { href: "/admin/matriculas", label: "Matrículas", icon: ClipboardList },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/reportes", label: "Reportes", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="administrador">
      <DashboardShell
        panelLabel="Administración"
        navItems={navItems}
        pageSubtitle="Datos de prueba — panel administrativo"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
