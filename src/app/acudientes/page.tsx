import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { nextClass, recentTutorMessage, statCards, studentSummary } from "@/lib/data/acudientes";

export default function AcudientesResumenPage() {
  return (
    <div>
      <Card className="mb-5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar className="size-11">
              <AvatarFallback className="bg-[#2FA6A1] font-bold text-white">MG</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-base font-bold text-primary">{studentSummary.name}</div>
              <div className="text-xs text-muted-foreground">{studentSummary.meta}</div>
            </div>
          </div>
          <StatusBadge tone="success">{studentSummary.status}</StatusBadge>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-base font-bold text-primary">Próxima clase</h3>
            <div className="text-sm font-semibold">{nextClass.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{nextClass.meta}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-base font-bold text-primary">Mensaje reciente del tutor</h3>
            <p className="text-sm leading-relaxed text-foreground/80">&ldquo;{recentTutorMessage}&rdquo;</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
