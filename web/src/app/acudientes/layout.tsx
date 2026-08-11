"use client";

import { BarChart3, CreditCard, FileText, Home, Mail } from "lucide-react";
import { RoleGuard } from "@/lib/session/role-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/acudientes", label: "Resumen", icon: Home },
  { href: "/acudientes/progreso", label: "Progreso", icon: BarChart3 },
  { href: "/acudientes/reportes", label: "Reportes", icon: FileText },
  { href: "/acudientes/pagos", label: "Pagos", icon: CreditCard },
  { href: "/acudientes/mensajes", label: "Mensajes", icon: Mail },
];

export default function AcudientesLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="acudiente">
      <DashboardShell
        panelLabel="Panel de acudientes"
        navItems={navItems}
        pageSubtitle="Datos de prueba — panel del acudiente"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
