import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/session";

/**
 * Returns the signed-in user's profile, or `null` if signed out.
 * `React.cache()` dedupes this within a single request — every layout in the
 * tree (marketing header, dashboard shell, page) can call it without
 * triggering a repeat round-trip to Supabase.
 *
 * Uses `getUser()`, not `getSession()`: it revalidates the JWT against the
 * Supabase server instead of trusting a cookie that could be stale/forged.
 */
export const getAuthenticatedProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, nombre")
    .eq("id", user.id)
    .single();

  return profile;
});
