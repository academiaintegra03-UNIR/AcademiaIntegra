"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/lib/auth/get-profile";
import { roleOptionFor } from "@/lib/data/roles";
import { safeNextPath } from "@/lib/auth/redirects";

export interface LoginState {
  error?: string;
}

export async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  if (!email || !password) {
    return { error: "Ingresa tu correo y tu contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const profile = await getAuthenticatedProfile();
  if (!profile) {
    // Auth succeeded but there's no matching `profiles` row (misconfigured
    // account) — sign back out rather than leave a half-authenticated user.
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene un rol asignado. Contacta a soporte." };
  }

  redirect(next ?? roleOptionFor(profile.role)?.homePath ?? "/");
}
