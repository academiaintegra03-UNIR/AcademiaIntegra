import Link from "next/link";
import { heroContent } from "@/lib/data/home-content";
import { Button } from "@/components/ui/button";
import { TryAQuestionCard } from "@/features/marketing/try-a-question-card";

// The headline highlights one word with a hand-drawn-style underline instead
// of a generic gradient/badge — "matemáticas" is the word being marked up.
const HIGHLIGHT_WORD = "matemáticas";

function Headline({ text }: { text: string }) {
  const idx = text.toLowerCase().indexOf(HIGHLIGHT_WORD);
  if (idx === -1) return <>{text}</>;
  const before = text.slice(0, idx);
  const word = text.slice(idx, idx + HIGHLIGHT_WORD.length);
  const after = text.slice(idx + HIGHLIGHT_WORD.length);
  return (
    <>
      {before}
      <span className="relative inline-block whitespace-nowrap">
        {word}
        <svg
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          className="absolute -bottom-1.5 left-0 h-2.5 w-full text-[#F2954A]"
          aria-hidden="true"
        >
          <path
            d="M2 9 C40 2, 80 12, 100 6 C130 -2, 165 11, 198 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {after}
    </>
  );
}

/**
 * Static hero on the site's normal light background — no dark full-bleed
 * band, no carousel, no stock-photo placeholder. A graph-paper texture (a
 * notebook, not generic tech dots) and a hand-drawn underline give it a
 * warmer, student-facing feel; the practice question on the right is
 * something a visitor can actually try, not just look at.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <span className="h-px w-8 bg-secondary-foreground/60" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide text-secondary-foreground uppercase">
              {heroContent.eyebrow}
            </span>
          </div>
          <h1 className="mb-5 text-3xl leading-tight font-extrabold text-primary sm:text-4xl lg:text-5xl">
            <Headline text={heroContent.title} />
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-foreground/70">{heroContent.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="bg-[#F2954A] text-white hover:bg-[#e8863a]" asChild>
              <Link href="/diagnostico">Realizar diagnóstico gratuito</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/programas">Explorar programas</Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-center py-4 lg:justify-end lg:py-0">
          <TryAQuestionCard className="-rotate-2" />
        </div>
      </div>
    </section>
  );
}
