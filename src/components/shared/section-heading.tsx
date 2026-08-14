import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-6 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <div className="mb-2 text-xs font-bold tracking-wide text-secondary-foreground/70 uppercase">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
