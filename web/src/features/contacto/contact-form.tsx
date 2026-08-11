"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialForm = { name: "", email: "", phone: "", message: "" };

export function ContactForm() {
  const [form, setForm] = React.useState(initialForm);
  const [sent, setSent] = React.useState(false);

  function update<K extends keyof typeof initialForm>(field: K, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Mensaje enviado (simulado)", {
      description: "Te contactaremos pronto.",
    });
  }

  if (sent) {
    return (
      <Alert className="border-none bg-success-foreground">
        <AlertDescription className="font-semibold text-success">
          ¡Gracias! Recibimos tu mensaje y te contactaremos pronto. (Formulario simulado para esta
          maqueta.)
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">Nombre completo</Label>
        <Input
          id="contact-name"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">Correo electrónico</Label>
        <Input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-phone">WhatsApp</Label>
        <Input id="contact-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Mensaje</Label>
        <Textarea
          id="contact-message"
          rows={4}
          required
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>
      <Button type="submit">Enviar mensaje</Button>
    </form>
  );
}
