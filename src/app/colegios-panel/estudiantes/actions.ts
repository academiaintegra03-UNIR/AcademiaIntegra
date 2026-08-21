"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { readContactoForm } from "@/lib/validation/contacto";
import { getColegioPlanInfo } from "@/lib/queries/colegio-plan";

export interface InviteGuardianState {
  error?: string;
  success?: boolean;
}

export async function inviteGuardianAction(formData: FormData): Promise<InviteGuardianState> {
  const caller = await requireRole("colegio");

  const studentId = String(formData.get("student_id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!studentId || !nombre || !email) return { error: "Completa el nombre y el correo." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const planInfo = await getColegioPlanInfo(caller.id);
  if (!planInfo.allowAcudientes) return { error: "Tu plan actual no incluye invitar acudientes." };

  const admin = createAdminClient();

  const { data: student } = await admin.from("profiles").select("colegio_id").eq("id", studentId).single();
  if (!student || student.colegio_id !== caller.id) return { error: "Ese estudiante no es de tu colegio." };

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "acudiente", nombre },
  });

  if (createError || !created.user) {
    return {
      error: createError?.message.toLowerCase().includes("already been registered")
        ? "Ya existe una cuenta con ese correo."
        : "No se pudo crear la cuenta.",
    };
  }

  const { error: linkError } = await admin
    .from("guardian_students")
    .insert({ guardian_id: created.user.id, student_id: studentId });

  if (linkError) {
    console.error("Failed to link invited guardian:", linkError);
    return { error: "La cuenta se creó, pero no se pudo vincular al estudiante." };
  }

  revalidatePath("/colegios-panel/estudiantes");
  return { success: true };
}

export async function createStudentAction(formData: FormData): Promise<InviteGuardianState> {
  const caller = await requireRole("colegio");

  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email) return { error: "Completa el nombre y el correo." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const contacto = readContactoForm(formData);
  if ("error" in contacto) return { error: contacto.error };

  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // handle_new_user (0003, 0011) crea el perfil con colegio_id y el
    // contacto en el mismo insert, y check_colegio_id (0003, extendido en
    // 0005) aplica el seat_limit del plan institucional activo
    // automáticamente — sin suscripción activa no hay límite (flujo
    // gratuito), igual que en admin/usuarios.
    user_metadata: {
      role: "estudiante",
      nombre,
      colegio_id: caller.id,
      telefono: contacto.data.telefono ?? "",
      tipo_documento: contacto.data.tipoDocumento ?? "",
      numero_documento: contacto.data.numeroDocumento ?? "",
    },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes("already been registered")) {
      return { error: "Ya existe una cuenta con ese correo." };
    }
    // El mensaje del trigger de cupo (check_colegio_id, 0005) ya viene en
    // español y es seguro de mostrar tal cual.
    return { error: createError.message.includes("cupo") ? createError.message : "No se pudo crear el estudiante." };
  }
  if (!created.user) return { error: "No se pudo crear el estudiante." };

  revalidatePath("/colegios-panel/estudiantes");
  revalidatePath("/colegios-panel/grupos");
  return { success: true };
}
