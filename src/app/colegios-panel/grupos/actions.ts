"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { getColegioPlanInfo } from "@/lib/queries/colegio-plan";

export interface GrupoActionState {
  error?: string;
  success?: boolean;
}

export async function createSubgrupoAction(formData: FormData): Promise<GrupoActionState> {
  const caller = await requireRole("colegio");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Ponle un nombre al subgrupo." };

  const planInfo = await getColegioPlanInfo(caller.id);
  if (!planInfo.allowSubgrupos) return { error: "Tu plan actual no incluye la creación de subgrupos propios." };

  const admin = createAdminClient();
  const { error } = await admin.from("grupos").insert({ name, colegio_id: caller.id, es_default_colegio: false });

  if (error) {
    console.error("Failed to create subgrupo:", error);
    return { error: "No se pudo crear el subgrupo." };
  }

  revalidatePath("/colegios-panel/grupos");
  return { success: true };
}

export async function deleteSubgrupoAction(formData: FormData): Promise<GrupoActionState> {
  const caller = await requireRole("colegio");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Falta el subgrupo a eliminar." };

  const admin = createAdminClient();

  const { data: grupo } = await admin.from("grupos").select("colegio_id, es_default_colegio").eq("id", id).single();
  if (!grupo || grupo.colegio_id !== caller.id) return { error: "Ese grupo no es tuyo." };
  if (grupo.es_default_colegio) return { error: "Ese grupo se administra automáticamente." };

  const { error } = await admin.from("grupos").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete subgrupo:", error);
    return { error: "No se pudo eliminar el subgrupo." };
  }

  revalidatePath("/colegios-panel/grupos");
  return { success: true };
}

export async function addStudentToSubgrupoAction(formData: FormData): Promise<GrupoActionState> {
  const caller = await requireRole("colegio");

  const grupoId = String(formData.get("grupo_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!grupoId || !studentId) return { error: "Selecciona un estudiante." };

  const admin = createAdminClient();

  const { data: grupo } = await admin.from("grupos").select("colegio_id").eq("id", grupoId).single();
  if (!grupo || grupo.colegio_id !== caller.id) return { error: "Ese grupo no es tuyo." };

  const { data: student } = await admin.from("profiles").select("colegio_id").eq("id", studentId).single();
  if (!student || student.colegio_id !== caller.id) return { error: "Ese estudiante no es de tu colegio." };

  const { error } = await admin
    .from("grupo_estudiantes")
    .upsert({ grupo_id: grupoId, student_id: studentId }, { onConflict: "grupo_id,student_id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to add student to subgrupo:", error);
    return { error: "No se pudo agregar el estudiante." };
  }

  revalidatePath("/colegios-panel/grupos");
  return { success: true };
}

export async function removeStudentFromSubgrupoAction(formData: FormData): Promise<GrupoActionState> {
  const caller = await requireRole("colegio");

  const grupoId = String(formData.get("grupo_id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!grupoId || !studentId) return { error: "Faltan datos." };

  const admin = createAdminClient();

  const { data: grupo } = await admin.from("grupos").select("colegio_id").eq("id", grupoId).single();
  if (!grupo || grupo.colegio_id !== caller.id) return { error: "Ese grupo no es tuyo." };

  const { error } = await admin
    .from("grupo_estudiantes")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("student_id", studentId);

  if (error) {
    console.error("Failed to remove student from subgrupo:", error);
    return { error: "No se pudo quitar el estudiante." };
  }

  revalidatePath("/colegios-panel/grupos");
  return { success: true };
}
