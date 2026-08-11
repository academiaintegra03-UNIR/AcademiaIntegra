import Link from "next/link";
import { Bell } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { ProgressRow } from "@/components/shared/progress-row";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  masteredTopics,
  routeModules,
  statCards,
  studentName,
  tutorMessage,
  upcomingTasks,
  weakTopics,
} from "@/lib/data/campus";

export default function CampusHomePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground">
          <Bell className="size-3.5" /> 3 notificaciones
        </div>
      </div>

      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl bg-primary px-7 py-6 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative">
          <div className="mb-1 text-xl font-bold">Hola, {studentName.split(" ")[0]} 👋</div>
          <div className="text-sm text-[#EAF6F5]">
            Tu próxima clase es <strong>hoy a las 4:00 p.m.</strong> — Álgebra: sistemas de ecuaciones.
          </div>
        </div>
        <Button className="relative shrink-0 bg-white text-primary hover:bg-white/90" asChild>
          <Link href="/campus/cursos">Ir a mis cursos</Link>
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent>
              <h3 className="mb-3.5 text-lg font-bold text-primary">Mi ruta de aprendizaje</h3>
              {routeModules.map((m) => (
                <ProgressRow key={m.name} label={m.name} pct={m.pct} />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="mb-3.5 text-lg font-bold text-primary">Próximas entregas</h3>
              {upcomingTasks.map((t) => (
                <div key={t.name} className="flex items-center justify-between border-b border-border py-2.5 last:border-none">
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.course}</div>
                  </div>
                  <StatusBadge tone={t.tone}>{t.due}</StatusBadge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardContent>
              <h3 className="mb-3 text-base font-bold text-primary">Temas</h3>
              <div className="mb-1.5 text-xs font-bold text-success">Dominados</div>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {masteredTopics.map((t) => (
                  <span key={t} className="rounded-full bg-success-foreground px-2.5 py-1 text-xs font-semibold text-success">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mb-1.5 text-xs font-bold text-warning">Por reforzar</div>
              <div className="flex flex-wrap gap-1.5">
                {weakTopics.map((t) => (
                  <span key={t} className="rounded-full bg-warning-foreground px-2.5 py-1 text-xs font-semibold text-warning">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="mb-2.5 text-base font-bold text-primary">Mensaje de tu tutor</h3>
              <div className="rounded-[10px] bg-muted p-3 text-sm leading-relaxed text-foreground/80">
                &ldquo;{tutorMessage.text}&rdquo;
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{tutorMessage.from}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
