import { Suspense } from "react";
import type { Metadata } from "next";
import { RoleSelect } from "@/features/auth/role-select";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <div className="border-b border-border bg-card px-4 py-4 sm:px-8">
        <Logo withTagline={false} className="w-fit" />
      </div>
      <Suspense>
        <RoleSelect />
      </Suspense>
    </div>
  );
}
