export type Role =
  | "visitante"
  | "estudiante"
  | "acudiente"
  | "colegio"
  | "tutor"
  | "administrador";

export interface DemoSession {
  role: Role;
  nombre: string;
}

import type { LucideIcon } from "lucide-react";

export interface RoleOption {
  role: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  nombreDemo: string;
  homePath: string;
}
