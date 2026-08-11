import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ListRow } from "@/components/shared/list-row";
import { messages, messagesPrivacyNote } from "@/lib/data/acudientes";

export default function AcudientesMensajesPage() {
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
      <div className="border-t border-border px-5 py-3.5 text-xs text-muted-foreground">
        {messagesPrivacyNote}
      </div>
    </Card>
  );
}
