import type { Metadata } from "next";
import { DiagnosticTeaser } from "@/features/diagnostico/diagnostic-teaser";

export const metadata: Metadata = { title: "Diagnóstico académico" };

export default function DiagnosticPage() {
  return <DiagnosticTeaser />;
}
