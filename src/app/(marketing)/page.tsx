import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Hero } from "@/features/marketing/hero";
import { ProgramCard } from "@/features/programas/program-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { PendingBadge } from "@/components/shared/pending-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { programs } from "@/lib/data/programs";
import { resources } from "@/lib/data/resources";
import { homeFaqs } from "@/lib/data/faqs";
import {
  aiResponsibleUseNote,
  diagnosticSteps,
  methodologyPoints,
  needCards,
  parentBenefits,
  studentBenefits,
  trustItems,
} from "@/lib/data/home-content";

export default function HomePage() {
  const featuredPrograms = programs.slice(0, 3);
  const homeResources = resources.slice(0, 3);

  return (
    <div>
      <Hero />

      {/* Trust items */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-7 sm:px-8 lg:grid-cols-4">
        {trustItems.map((t) => (
          <Card key={t.label} className="text-center">
            <CardContent>
              <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <t.icon className="size-4.5" aria-hidden="true" />
              </div>
              <div className="text-sm font-bold text-primary">{t.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ¿Qué necesitas aprender? */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <SectionHeading
          title="¿Qué necesitas aprender?"
          description="Elige tu punto de partida y te mostramos la ruta adecuada."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needCards.map((n) => (
            <Link key={n.title} href={`/programas/${n.programId}`}>
              <Card className="h-full transition-colors hover:ring-primary">
                <CardContent>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                    <n.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="mb-1 text-base font-bold text-primary">{n.title}</div>
                  <div className="text-sm text-muted-foreground">{n.desc}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Diagnóstico académico gratuito */}
      <section className="bg-secondary px-4 py-12 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="mb-2.5 text-2xl font-extrabold text-primary sm:text-3xl">
              Diagnóstico académico gratuito
            </h2>
            <p className="mb-4.5 max-w-lg text-base leading-relaxed text-foreground/80">
              Responde una serie breve de preguntas por pantalla. Recibirás tus fortalezas, tus áreas por
              mejorar y una recomendación de programa — sin compromiso.
            </p>
            <Button className="bg-[#2FA6A1] hover:bg-[#238984]" asChild>
              <Link href="/diagnostico">Comenzar diagnóstico</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2.5">
            {diagnosticSteps.map((s) => (
              <div key={s.n} className="flex items-center gap-3 rounded-[10px] bg-card px-4 py-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                  {s.n}
                </div>
                <div className="text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programas destacados */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">Programas destacados</h2>
          <Link href="/programas" className="flex items-center gap-1 text-sm font-bold text-secondary-foreground">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrograms.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>
      </section>

      {/* Metodología */}
      <section className="border-y border-border bg-card px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center text-2xl font-extrabold text-primary sm:text-3xl">
            Nuestra metodología
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methodologyPoints.map((m) => (
              <div key={m.title} className="px-2 text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <m.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="mb-1.5 text-sm font-bold text-primary">{m.title}</div>
                <div className="text-sm leading-relaxed text-muted-foreground">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uso responsable de IA */}
      <section className="mx-auto my-10 max-w-6xl rounded-2xl bg-accent px-4 py-9 sm:px-8">
        <div className="flex gap-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-primary">
            <ShieldCheck className="size-5.5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-extrabold text-primary">
              Uso responsable de inteligencia artificial
            </h3>
            <p className="max-w-3xl text-sm leading-relaxed text-foreground/80">{aiResponsibleUseNote}</p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-12 sm:px-8 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-lg font-extrabold text-primary">Para estudiantes</h3>
            {studentBenefits.map((b) => (
              <div key={b} className="mb-2.5 flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                <span className="text-sm text-foreground/80">{b}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-3.5 text-lg font-extrabold text-primary">Para padres y acudientes</h3>
            {parentBenefits.map((b) => (
              <div key={b} className="mb-2.5 flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                <span className="text-sm text-foreground/80">{b}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Colegios CTA */}
      <section className="bg-muted px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="mb-2 text-xl font-extrabold text-primary">¿Eres colegio o institución?</h3>
            <p className="max-w-lg text-sm text-foreground/80">
              Gestiona grupos, resultados agregados y simulacros institucionales desde un solo panel.
            </p>
          </div>
          <Button className="shrink-0" size="lg" asChild>
            <Link href="/colegios">Conocer servicios para colegios</Link>
          </Button>
        </div>
      </section>

      {/* Testimonios (vacío, pendiente) */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-8">
        <h2 className="mb-2 text-2xl font-extrabold text-primary">Testimonios</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Aún no publicamos testimonios en esta sección — solo mostraremos historias reales una vez
          autorizadas por los estudiantes y familias que las compartan.
        </p>
        <PendingBadge className="mx-auto" />
      </section>

      {/* Recursos gratuitos */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-8">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold text-primary sm:text-2xl">Recursos gratuitos</h2>
          <Link href="/recursos" className="flex items-center gap-1 text-sm font-bold text-secondary-foreground">
            Ver biblioteca <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {homeResources.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <r.icon className="size-4.5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.type}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-12 sm:px-8">
        <h2 className="mb-5 text-center text-xl font-extrabold text-primary sm:text-2xl">
          Preguntas frecuentes
        </h2>
        {homeFaqs.map((f) => (
          <div key={f.q} className="border-b border-border py-3.5">
            <div className="text-sm font-bold text-primary">{f.q}</div>
            <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
          </div>
        ))}
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-primary px-4 py-14 text-center sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <h2 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl">Da el primer paso hoy</h2>
          <p className="mx-auto mb-6 max-w-md text-base text-[#D7E4F0]">
            Realiza tu diagnóstico gratuito o habla con un asesor para encontrar tu ruta ideal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/diagnostico">Realizar diagnóstico</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/contacto">Hablar con un asesor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
