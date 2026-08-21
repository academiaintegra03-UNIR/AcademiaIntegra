"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { readContactoForm } from "@/lib/validation/contacto";
import { getActiveSubscription } from "@/lib/queries/subscription";

export interface ChildActionState {
  error?: string;
  success?: boolean;
}

export async function createChildAction(formData: FormData): Promise<ChildActionState> {
  const caller = await requireRole("acudiente");

  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email) return { error: "Completa el nombre y el correo." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const contacto = readContactoForm(formData);
  if ("error" in contacto) return { error: contacto.error };

  const admin = createAdminClient();

  // Self-service solo si hay un plan grupal activo — sin esto, un
  // acudiente podría crear estudiantes sin límite: check_guardian_students_roles()
  // (0005) solo aplica el cupo cuando existe una suscripción activa de
  // tipo "grupal"; sin suscripción, el trigger asume el flujo gratuito
  // manual del admin y no limita nada.
  const sub = await getActiveSubscription(caller.id, "grupal");
  if (!sub) return { error: "No tienes un plan grupal activo. Actívalo desde Planes y precios." };

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "estudiante",
      nombre,
      telefono: contacto.data.telefono ?? "",
      tipo_documento: contacto.data.tipoDocumento ?? "",
      numero_documento: contacto.data.numeroDocumento ?? "",
    },
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
    .insert({ guardian_id: caller.id, student_id: created.user.id });

  if (linkError) {
    // El mensaje del trigger de cupo (check_guardian_students_roles, 0005)
    // ya viene en español y es seguro de mostrar tal cual.
    return { error: linkError.message.includes("cupo") ? linkError.message : "No se pudo vincular al estudiante." };
  }

  revalidatePath("/acudientes/mi-grupo");
  return { success: true };
}
