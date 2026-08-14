// Ported verbatim from reference/prototipos/Panel Colegios.dc.html (mock/demo data).
import type {
  AttentionStudent,
  ProgressItem,
  SchoolReport,
  SchoolSimulation,
  SchoolStudentRow,
  Stat,
} from "@/lib/types/panels";

export const schoolName = "Colegio San Rafael";
export const schoolMeta = "Coordinación académica";

export const kpis: Stat[] = [
  { label: "Estudiantes activos", value: "148" },
  { label: "Cursos activos", value: "9" },
  { label: "Participación en simulacros", value: "87%" },
  { label: "Avance promedio", value: "61%" },
];

export const courseAvg: ProgressItem[] = [
  { name: "10°A", pct: 58 },
  { name: "10°B", pct: 64 },
  { name: "11°A", pct: 70 },
  { name: "11°B", pct: 55 },
];

export const needsAttention: AttentionStudent[] = [
  { name: "Juan Pablo Rincón — 11°B", reason: "Bajo avance" },
  { name: "Sara Valentina Cruz — 10°A", reason: "Inasistencia" },
  { name: "Camilo Andrés Pardo — 11°A", reason: "Simulacro bajo" },
];

export const students: SchoolStudentRow[] = [
  { name: "Mariana Gómez", group: "11°A", pct: 64, status: "Al día", tone: "success" },
  { name: "Juan Pablo Rincón", group: "11°B", pct: 31, status: "Requiere apoyo", tone: "error" },
  { name: "Sara Valentina Cruz", group: "10°A", pct: 45, status: "Requiere apoyo", tone: "error" },
  { name: "Camilo Andrés Pardo", group: "11°A", pct: 58, status: "Al día", tone: "success" },
  { name: "Daniela Fernanda Ríos", group: "10°B", pct: 72, status: "Al día", tone: "success" },
  { name: "Andrés Felipe Torres", group: "11°B", pct: 66, status: "Al día", tone: "success" },
];

export const areaResults: ProgressItem[] = [
  { name: "Razonamiento cuantitativo", pct: 63 },
  { name: "Lectura crítica", pct: 71 },
  { name: "Ciencias naturales", pct: 55 },
  { name: "Ciencias sociales", pct: 68 },
  { name: "Inglés", pct: 74 },
];

export const schoolSims: SchoolSimulation[] = [
  { name: "Simulacro institucional Saber 11 — Agosto", date: "Programado 20 ago 2026", participation: "92%" },
  { name: "Simulacro institucional Saber 11 — Julio", date: "Realizado 18 jul 2026", participation: "87%" },
  { name: "Simulacro corto — Grado 10°", date: "Realizado 5 jul 2026", participation: "81%" },
];

export const schoolReports: SchoolReport[] = [
  { title: "Informe institucional — Julio 2026" },
  { title: "Comparativo de diagnósticos — Grado 10° y 11°" },
  { title: "Participación y asistencia — Semestre 1" },
];
