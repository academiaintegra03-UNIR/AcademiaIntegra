"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { roleOptions } from "@/lib/data/roles";
import type { Role } from "@/lib/types/session";

export interface UserActionState {
  error?: string;
  success?: boolean;
}

const VALID_ROLES = new Set(roleOptions.map((option) => option.role));

function isValidRole(value: FormDataEntryValue | null): value is Role {
  return typeof value === "string" && VALID_ROLES.has(value as Role);
}

export async function createUserAction(formData: FormData): Promise<UserActionState> {
  await requireRole("administrador");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const role = formData.get("role");
  const colegioId = String(formData.get("colegio_id") ?? "").trim();

  if (!email || !nombre) return { error: "Completa el correo y el nombre." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (!isValidRole(role)) return { error: "Selecciona un rol válido." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // handle_new_user (0003_relationships.sql) reads colegio_id from here too,
    // so the profile and its colegio link are created atomically. Only
    // meaningful for role "estudiante" — the trigger rejects it otherwise.
    user_metadata: { role, nombre, colegio_id: role === "estudiante" ? colegioId : "" },
  });

  if (error) {
    return {
      error: error.message.toLowerCase().includes("already been registered")
        ? "Ya existe un usuario con ese correo."
        : "No se pudo crear el usuario.",
    };
  }

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateUserAction(formData: FormData): Promise<UserActionState> {
  await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const role = formData.get("role");
  const colegioId = String(formData.get("colegio_id") ?? "").trim();

  if (!id || !nombre) return { error: "Faltan datos del usuario." };
  if (!isValidRole(role)) return { error: "Selecciona un rol válido." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ nombre, role, colegio_id: role === "estudiante" && colegioId ? colegioId : null })
    .eq("id", id);

  if (error) return { error: "No se pudo actualizar el usuario." };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function deleteUserAction(formData: FormData): Promise<UserActionState> {
  const caller = await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Falta el usuario a eliminar." };
  if (id === caller.id) return { error: "No puedes eliminar tu propia cuenta." };

  const admin = createAdminClient();

  const { data: target } = await admin.from("profiles").select("role").eq("id", id).single();
  if (target?.role === "administrador") {
    const { count } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "administrador");
    if ((count ?? 0) <= 1) {
      return { error: "No puedes eliminar al único administrador." };
    }
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: "No se pudo eliminar el usuario." };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function linkGuardianStudentAction(formData: FormData): Promise<UserActionState> {
  await requireRole("administrador");

  const guardianId = String(formData.get("guardian_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!guardianId || !studentId) return { error: "Selecciona un estudiante." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("guardian_students")
    .upsert({ guardian_id: guardianId, student_id: studentId }, { onConflict: "guardian_id,student_id", ignoreDuplicates: true });

  if (error) return { error: "No se pudo vincular el estudiante." };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function unlinkGuardianStudentAction(formData: FormData): Promise<UserActionState> {
  await requireRole("administrador");

  const guardianId = String(formData.get("guardian_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!guardianId || !studentId) return { error: "Faltan datos." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("guardian_students")
    .delete()
    .eq("guardian_id", guardianId)
    .eq("student_id", studentId);

  if (error) return { error: "No se pudo desvincular el estudiante." };

  revalidatePath("/admin/usuarios");
  return { success: true };
}
