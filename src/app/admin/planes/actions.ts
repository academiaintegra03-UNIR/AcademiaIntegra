"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/require-role";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlanType } from "@/lib/supabase/database.types";

export interface PlanActionState {
  error?: string;
  success?: boolean;
}

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const MULTI_SEAT_TYPES: PlanType[] = ["grupal", "institucional"];

function isValidType(value: FormDataEntryValue | null): value is PlanType {
  return value === "individual" || value === "grupal" || value === "institucional";
}

function readPlanForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const type = formData.get("type");
  const priceCop = Number(formData.get("price_cop"));
  const seatLimitRaw = String(formData.get("seat_limit") ?? "").trim();
  const period = String(formData.get("period") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const groupLabel = String(formData.get("group_label") ?? "").trim();
  const features = parseFeatures(String(formData.get("features") ?? ""));

  if (!name || !description || !period) {
    return { error: "Completa el nombre, la descripción y el período." } as const;
  }
  if (!isValidType(type)) return { error: "Selecciona un tipo de plan válido." } as const;
  if (!Number.isFinite(priceCop) || priceCop < 0) return { error: "El precio no es válido." } as const;

  const needsSeatLimit = MULTI_SEAT_TYPES.includes(type);
  const seatLimit = needsSeatLimit ? Number(seatLimitRaw) : null;
  if (needsSeatLimit && (!Number.isFinite(seatLimit) || (seatLimit as number) <= 0)) {
    return { error: "Los planes grupales e institucionales necesitan un cupo de estudiantes válido." } as const;
  }

  return {
    data: {
      name,
      description,
      type,
      price_cop: priceCop,
      seat_limit: seatLimit,
      period,
      badge: badge || null,
      features,
      group_label: groupLabel || null,
    },
  } as const;
}

export async function createPlanAction(formData: FormData): Promise<PlanActionState> {
  await requireRole("administrador");

  const parsed = readPlanForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const admin = createAdminClient();
  const { error } = await admin.from("plans").insert(parsed.data);
  if (error) {
    console.error("Failed to create plan:", error);
    return { error: "No se pudo crear el plan." };
  }

  revalidatePath("/admin/planes");
  revalidatePath("/planes-precios");
  return { success: true };
}

export async function updatePlanAction(formData: FormData): Promise<PlanActionState> {
  await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Falta el plan a actualizar." };

  const parsed = readPlanForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const admin = createAdminClient();
  const { error } = await admin.from("plans").update(parsed.data).eq("id", id);
  if (error) {
    console.error("Failed to update plan:", error);
    return { error: "No se pudo actualizar el plan." };
  }

  revalidatePath("/admin/planes");
  revalidatePath("/planes-precios");
  return { success: true };
}

export async function setPlanActiveAction(formData: FormData): Promise<PlanActionState> {
  await requireRole("administrador");

  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!id) return { error: "Falta el plan." };

  const admin = createAdminClient();
  const { error } = await admin.from("plans").update({ active }).eq("id", id);
  if (error) {
    console.error("Failed to toggle plan active state:", error);
    return { error: "No se pudo actualizar el plan." };
  }

  revalidatePath("/admin/planes");
  revalidatePath("/planes-precios");
  return { success: true };
}
