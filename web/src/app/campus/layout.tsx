"use client";

import { BarChart3, Bot, BookOpen, ClipboardList, Compass, HelpCircle, Home } from "lucide-react";
import { RoleGuard } from "@/lib/session/role-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";

const navItems: DashboardNavItem[] = [
  { href: "/campus", label: "Inicio", icon: Home },
  { href: "/campus/mi-ruta", label: "Mi ruta", icon: Compass },
  { href: "/campus/cursos", label: "Mis cursos", icon: BookOpen },
  { href: "/campus/banco-preguntas", label: "Banco de preguntas", icon: HelpCircle },
  { href: "/campus/simulacros", label: "Simulacros", icon: ClipboardList },
  { href: "/campus/progreso", label: "Progreso", icon: BarChart3 },
  { href: "/campus/tutor-ia", label: "Tutor con IA", icon: Bot },
];

export default function CampusLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="estudiante">
      <DashboardShell
        panelLabel="Campus"
        navItems={navItems}
        pageSubtitle="Datos de prueba — panel del estudiante"
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
