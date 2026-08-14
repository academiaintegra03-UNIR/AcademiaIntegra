import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { alerts, enrollTrend, kpis } from "@/lib/data/admin";

const alertToneClass: Record<string, string> = {
  warning: "text-warning",
  error: "text-destructive",
  info: "text-secondary-foreground",
};

export default function AdminResumenPage() {
  const max = Math.max(...enrollTrend.map((w) => w.value));

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-5">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent>
            <h3 className="mb-4 text-base font-bold text-primary">Matrículas por mes</h3>
            <div className="flex h-32 items-end gap-3">
              {enrollTrend.map((w) => (
                <div key={w.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full rounded-t bg-primary" style={{ height: `${(w.value / max) * 100}%` }} />
                  <div className="text-xs text-muted-foreground">{w.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-base font-bold text-primary">Alertas</h3>
            {alerts.map((a) => (
              <div key={a.text} className="flex items-start gap-2.5 border-b border-border py-2 text-sm last:border-none">
                <a.icon className={`mt-0.5 size-4 shrink-0 ${alertToneClass[a.tone] ?? "text-muted-foreground"}`} aria-hidden="true" />
                <span>{a.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
