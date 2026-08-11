"use client";

import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tutorButtons, tutorIaChat, tutorIaWarning } from "@/lib/data/campus";

export function TutorIaChat() {
  return (
    <div className="max-w-2xl">
      <Card className="mb-4">
        <CardContent className="flex min-h-72 flex-col gap-3">
          {tutorIaChat.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm",
                m.role === "ai" ? "self-start bg-secondary text-secondary-foreground" : "self-end bg-primary text-white"
              )}
            >
              {m.text}
            </div>
          ))}
          <div className="flex items-start gap-1.5 self-start rounded-lg bg-warning-foreground px-3 py-2 text-xs font-semibold text-warning">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span>{tutorIaWarning}</span>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap gap-2">
        {tutorButtons.map((tb) => (
          <Button
            key={tb}
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => toast.info("El chat en vivo con el tutor de IA se conecta en la siguiente fase del proyecto.")}
          >
            {tb}
          </Button>
        ))}
      </div>
    </div>
  );
}
