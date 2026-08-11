import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ListRow, listRowToneFromStatus } from "@/components/shared/list-row";
import { reports } from "@/lib/data/acudientes";

export default function AcudientesReportesPage() {
  return (
    <Card>
      <CardContent className="p-0">
        {reports.map((r) => (
          <ListRow
            key={r.title}
            icon={FileText}
            tone={listRowToneFromStatus(r.tone)}
            title={r.title}
            subtitle={r.date}
            trailing={
              <>
                <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                <Button variant="outline" size="sm">
                  Descargar PDF
                </Button>
              </>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
