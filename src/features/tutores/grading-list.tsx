"use client";

import { FilePenLine } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListRow } from "@/components/shared/list-row";
import { pendingGrading } from "@/lib/data/tutores";

export function GradingList() {
  return (
    <Card>
      <CardContent className="p-0">
        {pendingGrading.map((a) => (
          <ListRow
            key={a.title + a.student}
            icon={FilePenLine}
            tone="warning"
            title={a.title}
            subtitle={`${a.student} · ${a.course}`}
            trailing={
              <Button size="sm" onClick={() => toast.success(`"${a.title}" marcado como calificado (simulado)`)}>
                Calificar
              </Button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
