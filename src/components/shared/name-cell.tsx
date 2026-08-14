import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export function NameCell({ name, subtitle }: { name: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="bg-secondary text-[11px] font-bold text-secondary-foreground">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-semibold">{name}</div>
        {subtitle ? <div className="truncate text-xs text-muted-foreground">{subtitle}</div> : null}
      </div>
    </div>
  );
}
