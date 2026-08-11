import { FileText, Video, PencilLine, Timer, Calculator, Newspaper } from "lucide-react";
import type { Resource } from "@/lib/types/content";

// Ported verbatim from reference/prototipos/Academia Integra.dc.html (resourcesData).
export const resources: Resource[] = [
  { id: 1, title: "Guía: 5 retos de razonamiento lógico", type: "Guía descargable", level: "Primaria", icon: FileText, tag: "Gratis" },
  { id: 2, title: "Mini-clase: fracciones sin miedo", type: "Video", level: "Primaria", icon: Video, tag: "Gratis" },
  { id: 3, title: "Ejercicios de álgebra resueltos", type: "Ejercicios", level: "Bachillerato", icon: PencilLine, tag: "Gratis" },
  { id: 4, title: "Simulacro corto Saber 11 — Matemáticas", type: "Simulacro", level: "Preparación exámenes", icon: Timer, tag: "Exclusivo" },
  { id: 5, title: "Calculadora de fracciones paso a paso", type: "Calculadora", level: "Todos", icon: Calculator, tag: "Gratis" },
  { id: 6, title: "Errores frecuentes en cálculo diferencial", type: "Artículo", level: "Universidad", icon: Newspaper, tag: "Gratis" },
];
