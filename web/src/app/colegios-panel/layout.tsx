"use client";

import { BarChart3, ClipboardList, FileText, GraduationCap, Home } from "lucide-react";
import { RoleGuard } from "@/lib/session/role-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/colegios-panel", label: "Resumen institucional", icon: Home },
  { href: "/colegios-panel/estudiantes", label: "Estudiantes", icon: GraduationCap },
  { href: "/colegios-panel/resultados", label: "Resultados", icon: BarChart3 },
  { href: "/colegios-panel/simulacros", label: "Simulacros", icon: ClipboardList },
  { href: "/colegios-panel/informes", label: "Informes", icon: FileText },
];

export default function ColegiosPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="colegio">
      <DashboardShell
        panelLabel="Panel de colegios"
        navItems={navItems}
        pageSubtitle="Datos de prueba — panel institucional"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
