"use client";

import { FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListRow } from "@/components/shared/list-row";
import { generatedReports } from "@/lib/data/tutores";

export function ReportsList() {
  return (
    <div>
      <Button
        className="mb-5"
        onClick={() => toast.success("Reporte generado (simulado)")}
      >
        Generar nuevo reporte
      </Button>
      <Card>
        <CardContent className="p-0">
          {generatedReports.map((r) => (
            <ListRow key={r.title} icon={FileText} title={r.title} subtitle={r.date} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
