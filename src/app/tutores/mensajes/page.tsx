import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ListRow } from "@/components/shared/list-row";
import { messages } from "@/lib/data/tutores";

export default function TutoresMensajesPage() {
  return (
    <Card className="max-w-2xl">
      <CardContent className="p-0">
        {messages.map((m) => (
          <ListRow
            key={m.from + m.date}
            icon={MessageSquare}
            title={m.from}
            subtitle={m.text}
            trailing={<span className="text-xs text-muted-foreground">{m.date}</span>}
          />
        ))}
      </CardContent>
    </Card>
  );
}
