import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted text-foreground",
} as const;

/**
 * Consistent "icon in a tinted rounded box" treatment used across the app in
 * place of raw emoji or bare oversized glyphs — one line-icon set, one shape
 * language, instead of every section inventing its own icon presentation.
 */
export function IconTile({
  icon: Icon,
  tone = "secondary",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof toneClasses;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-8 rounded-lg [&>svg]:size-4",
    md: "size-10 rounded-xl [&>svg]:size-5",
    lg: "size-12 rounded-xl [&>svg]:size-6",
  } as const;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      aria-hidden="true"
    >
      <Icon strokeWidth={2} />
    </div>
  );
}
