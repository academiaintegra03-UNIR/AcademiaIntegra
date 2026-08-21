"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";

export interface GrupoActionState {
  error?: string;
  success?: boolean;
}

export async function createGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const name = String(formData.get("name") ?? "").trim();
  const colegioId = String(formData.get("colegio_id") ?? "").trim();
  const tutorId = String(formData.get("tutor_id") ?? "").trim();

  if (!name) return { error: "Ponle un nombre al grupo." };

  const admin = createAdminClient();
  const { error } = await admin.from("grupos").insert({
    name,
    colegio_id: colegioId || null,
    tutor_id: tutorId || null,
  });

  if (error) {
    console.error("Failed to create grupo:", error);
    return { error: "No se pudo crear el grupo." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}

export async function updateGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const colegioId = String(formData.get("colegio_id") ?? "").trim();
  const tutorId = String(formData.get("tutor_id") ?? "").trim();

  if (!id || !name) return { error: "Faltan datos del grupo." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("grupos")
    .update({ name, colegio_id: colegioId || null, tutor_id: tutorId || null })
    .eq("id", id);

  if (error) {
    console.error("Failed to update grupo:", error);
    return { error: "No se pudo actualizar el grupo." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}

export async function deleteGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Falta el grupo a eliminar." };

  const admin = createAdminClient();

  const { data: grupo } = await admin.from("grupos").select("es_default_colegio").eq("id", id).single();
  if (grupo?.es_default_colegio) {
    return { error: "Este grupo se administra automáticamente. Se elimina solo si eliminas el colegio." };
  }

  const { error } = await admin.from("grupos").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete grupo:", error);
    return { error: "No se pudo eliminar el grupo." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}

export async function addStudentToGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const grupoId = String(formData.get("grupo_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!grupoId || !studentId) return { error: "Selecciona un estudiante." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("grupo_estudiantes")
    .upsert({ grupo_id: grupoId, student_id: studentId }, { onConflict: "grupo_id,student_id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to add student to grupo:", error);
    return { error: "No se pudo agregar el estudiante." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}

export async function addColegioStudentsToGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const grupoId = String(formData.get("grupo_id") ?? "");
  const colegioId = String(formData.get("colegio_id") ?? "");
  if (!grupoId || !colegioId) return { error: "Selecciona un colegio." };

  const admin = createAdminClient();

  const { data: estudiantes, error: estudiantesError } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "estudiante")
    .eq("colegio_id", colegioId);

  if (estudiantesError) {
    console.error("Failed to load colegio students for bulk add:", estudiantesError);
    return { error: "No se pudo cargar a los estudiantes del colegio." };
  }
  if (!estudiantes || estudiantes.length === 0) return { error: "Ese colegio todavía no tiene estudiantes." };

  const { error } = await admin
    .from("grupo_estudiantes")
    .upsert(
      estudiantes.map((s) => ({ grupo_id: grupoId, student_id: s.id })),
      { onConflict: "grupo_id,student_id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("Failed to bulk add colegio students to grupo:", error);
    return { error: "No se pudo agregar a los estudiantes del colegio." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}

export async function removeStudentFromGrupoAction(formData: FormData): Promise<GrupoActionState> {
  await requireRole("administrador");

  const grupoId = String(formData.get("grupo_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!grupoId || !studentId) return { error: "Faltan datos." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("grupo_estudiantes")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("student_id", studentId);

  if (error) {
    console.error("Failed to remove student from grupo:", error);
    return { error: "No se pudo quitar el estudiante." };
  }

  revalidatePath("/admin/grupos");
  return { success: true };
}
