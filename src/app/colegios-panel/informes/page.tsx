import { FileBarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListRow } from "@/components/shared/list-row";
import { schoolReports } from "@/lib/data/colegios-panel";

export default function ColegiosInformesPage() {
  return (
    <Card>
      <CardContent className="p-0">
        {schoolReports.map((r) => (
          <ListRow
            key={r.title}
            icon={FileBarChart}
            title={r.title}
            trailing={
              <Button variant="outline" size="sm">
                Exportar
              </Button>
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
