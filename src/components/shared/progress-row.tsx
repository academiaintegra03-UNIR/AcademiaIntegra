import { Progress } from "@/components/ui/progress";

export function ProgressRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{pct}%</span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );
}
