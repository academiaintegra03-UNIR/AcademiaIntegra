import { Card, CardContent } from "@/components/ui/card";
import { todayClasses, weekClasses } from "@/lib/data/tutores";

export default function TutoresAgendaPage() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardContent>
          <h3 className="mb-3.5 text-base font-bold text-primary">Hoy</h3>
          {todayClasses.map((c) => (
            <div key={c.name} className="flex items-center gap-3 border-b border-border py-2.5 last:border-none">
              <div className="w-[70px] shrink-0 text-sm font-bold text-secondary-foreground">{c.time}</div>
              <div>
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.group}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="mb-3.5 text-base font-bold text-primary">Esta semana</h3>
          {weekClasses.map((c) => (
            <div key={c.day + c.name} className="flex justify-between border-b border-border py-2.5 text-sm last:border-none">
              <span>
                {c.day} · {c.name}
              </span>
              <span className="text-muted-foreground">{c.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
