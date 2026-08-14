import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/lib/supabase/database.types";

/** Mirrors the `user_role` enum in web/supabase/migrations/0001_profiles.sql. */
export type Role = UserRole;

/** The authenticated user's row in `public.profiles`. `null` means signed out. */
export interface Profile {
  id: string;
  role: Role;
  nombre: string;
}

export interface RoleOption {
  role: Role;
  label: string;
  description: string;
  icon: LucideIcon;
  homePath: string;
}
