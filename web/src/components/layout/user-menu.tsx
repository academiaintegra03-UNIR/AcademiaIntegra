"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRoundCog } from "lucide-react";
import { useSession } from "@/lib/session/session-context";
import { roleOptionFor } from "@/lib/data/roles";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export function UserMenu() {
  const { session, isHydrated, logout } = useSession();
  const router = useRouter();

  if (!isHydrated) return null;

  if (session.role === "visitante") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Iniciar sesión</Link>
        </Button>
        <Button asChild>
          <Link href="/diagnostico">Comenzar ahora</Link>
        </Button>
      </div>
    );
  }

  const option = roleOptionFor(session.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-2 px-2 py-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-secondary text-xs font-bold text-primary">
              {initials(session.nombre)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-xs font-semibold leading-tight">{session.nombre}</span>
            <span className="block text-xs leading-tight text-muted-foreground">
              {option?.label ?? session.role}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Modo demostración
          <div className="mt-0.5 text-xs font-normal text-muted-foreground">
            Sesión simulada — sin autenticación real todavía.
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {option ? (
          <DropdownMenuItem asChild>
            <Link href={option.homePath}>
              <UserRoundCog /> Ir a mi panel
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/login">
            <UserRoundCog /> Cambiar de rol
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut /> Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
