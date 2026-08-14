"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MessageCircle, SendHorizontal, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  orientationAssistantName,
  orientationAssistantRole,
  orientationGreeting,
  orientationQuickReplies,
  orientationWarning,
} from "@/lib/data/orientation-chat";

/**
 * Public orientation/admissions assistant — design only, matching how
 * tutor-ia-chat.tsx in the campus already handles "not wired up yet": quick
 * replies that lead somewhere real (programs, pricing, contact) work today;
 * free-text input is honestly disclosed as not connected.
 */
export function OrientationChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setDraft("");
    toast.info(
      "La conversación con Álex se conecta en la siguiente fase del proyecto. Mientras tanto, escríbenos por WhatsApp o el formulario de Contacto."
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open ? (
        <div className="mb-3 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2.5 border-b border-border bg-primary px-4 py-3">
            <Avatar className="size-9 shrink-0">
              <AvatarFallback className="bg-[#F2954A] font-bold text-white">
                {orientationAssistantName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">{orientationAssistantName}</div>
              <div className="truncate text-xs text-[#D7E4F0]">{orientationAssistantRole}</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto px-4 py-4">
            <div className="max-w-[85%] self-start rounded-xl bg-secondary px-3.5 py-2.5 text-sm text-secondary-foreground">
              {orientationGreeting}
            </div>
            <div className="flex items-start gap-1.5 self-start rounded-lg bg-warning-foreground px-3 py-2 text-xs font-semibold text-warning">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              <span>{orientationWarning}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-3">
            {orientationQuickReplies.map((q) => (
              <Button key={q.href} variant="outline" size="sm" className="rounded-full" asChild>
                <Link href={q.href}>{q.label}</Link>
              </Button>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Mensaje para Álex"
              className="h-9"
            />
            <Button type="submit" size="icon" className="size-9 shrink-0 bg-[#F2954A] hover:bg-[#e8863a]">
              <SendHorizontal className="size-4" aria-hidden="true" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat de orientación" : "Abrir chat de orientación con Álex"}
        aria-expanded={open}
        className="ml-auto flex size-14 items-center justify-center rounded-full bg-[#F2954A] text-white shadow-lg hover:bg-[#e8863a]"
      >
        {open ? <X className="size-6" aria-hidden="true" /> : <MessageCircle className="size-6" aria-hidden="true" />}
      </button>
    </div>
  );
}
