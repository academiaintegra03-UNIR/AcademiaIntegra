import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { ProgressRow } from "@/components/shared/progress-row";
import { courseAvg, kpis, needsAttention } from "@/lib/data/colegios-panel";

export default function ColegiosResumenPage() {
  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardContent>
            <h3 className="mb-4 text-base font-bold text-primary">Avance promedio por curso</h3>
            {courseAvg.map((c) => (
              <ProgressRow key={c.name} label={c.name} pct={c.pct} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-base font-bold text-primary">Estudiantes que requieren acompañamiento</h3>
            {needsAttention.map((s) => (
              <div key={s.name} className="flex justify-between border-b border-border py-2 text-sm last:border-none">
                <span>{s.name}</span>
                <span className="font-bold text-destructive">{s.reason}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
