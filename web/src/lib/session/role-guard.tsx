"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types/session";
import { useSession } from "@/lib/session/session-context";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side guard for the simulated demo panels. Not real authentication —
 * it only checks the role stored for this browser in localStorage and
 * redirects to /login when it doesn't match. Real auth (Supabase) replaces
 * this later.
 */
export function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { session, isHydrated } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (isHydrated && session.role !== role) {
      router.replace(`/login?next=${encodeURIComponent(role)}`);
    }
  }, [isHydrated, session.role, role, router]);

  if (!isHydrated || session.role !== role) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted p-8">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
