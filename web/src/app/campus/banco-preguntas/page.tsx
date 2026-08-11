import { Badge } from "@/components/ui/badge";
import { QuestionBank } from "@/features/campus/question-bank";
import { bankFilters } from "@/lib/data/campus";

export default function BancoPreguntasPage() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {bankFilters.map((f) => (
          <Badge key={f} variant="outline" className="h-auto px-3 py-1.5 text-xs">
            {f}
          </Badge>
        ))}
      </div>
      <QuestionBank />
    </div>
  );
}
