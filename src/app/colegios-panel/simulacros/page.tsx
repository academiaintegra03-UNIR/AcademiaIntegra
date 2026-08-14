import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ListRow } from "@/components/shared/list-row";
import { schoolSims } from "@/lib/data/colegios-panel";

export default function ColegiosSimulacrosPage() {
  return (
    <Card>
      <CardContent className="p-0">
        {schoolSims.map((sm) => (
          <ListRow
            key={sm.name}
            icon={ClipboardList}
            tone="accent"
            title={sm.name}
            subtitle={sm.date}
            trailing={<span className="text-sm text-muted-foreground">{sm.participation} participación</span>}
          />
        ))}
      </CardContent>
    </Card>
  );
}
