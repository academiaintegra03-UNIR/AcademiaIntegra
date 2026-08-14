// Ported verbatim from reference/prototipos/Panel Administrativo.dc.html (mock/demo data).
import { AlertTriangle, MessageSquare, TrendingDown, SendHorizontal } from "lucide-react";
import type {
  AdminAlert,
  AdminEnrollmentRow,
  AdminPaymentRow,
  AdminProgramRow,
  AdminScheduledReport,
  Stat,
  WeekBar,
} from "@/lib/types/panels";

export const adminName = "Sofía Arango";
export const adminMeta = "Administradora";

export const kpis: Stat[] = [
  { label: "Usuarios activos", value: "412" },
  { label: "Nuevos registros (mes)", value: "38" },
  { label: "Matrículas pendientes", value: "7" },
  { label: "Ingresos del mes", value: "$18,4M COP" },
  { label: "Cursos activos", value: "14" },
];

export const enrollTrend: WeekBar[] = [12, 18, 15, 22, 19, 27].map((v, i) => ({
  label: ["Mar", "Abr", "May", "Jun", "Jul", "Ago"][i],
  value: v,
}));

export const alerts: AdminAlert[] = [
  { icon: AlertTriangle, text: "7 matrículas con pago pendiente hace más de 5 días", tone: "warning" },
  { icon: MessageSquare, text: "5 mensajes de foro por moderar", tone: "info" },
  { icon: TrendingDown, text: "3 estudiantes con avance por debajo del 20%", tone: "error" },
  { icon: SendHorizontal, text: "2 reportes quincenales con envío fallido", tone: "error" },
];

export const programsAdmin: AdminProgramRow[] = [
  { name: "Fundamentos matemáticos", level: "Primaria", seats: "32/40", status: "Publicado", tone: "success" },
  { name: "Álgebra y geometría", level: "Bachillerato", seats: "58/60", status: "Publicado", tone: "success" },
  { name: "Preparación Saber 11", level: "Preparación exámenes", seats: "90/100", status: "Publicado", tone: "success" },
  { name: "Admisión Universidad Nacional", level: "Preparación exámenes", seats: "24/40", status: "Publicado", tone: "success" },
  { name: "Precálculo y cálculo diferencial", level: "Universidad", seats: "12/30", status: "Borrador", tone: "warning" },
  { name: "Preparación PAES / EXANI-II / PAA", level: "Preparación exámenes", seats: "6/40", status: "Borrador", tone: "warning" },
];

export const enrollments: AdminEnrollmentRow[] = [
  { student: "Mariana Gómez", program: "Preparación Saber 11", plan: "Personalizado", status: "Confirmada", tone: "success" },
  { student: "Camilo Andrés Pardo", program: "Preparación Saber 11", plan: "Grupal", status: "Confirmada", tone: "success" },
  { student: "Nuevo estudiante — sin nombre", program: "Álgebra y geometría", plan: "Grupal", status: "Pago pendiente", tone: "warning" },
  { student: "Sara Valentina Cruz", program: "Fundamentos matemáticos", plan: "Personalizado", status: "Confirmada", tone: "success" },
  { student: "Nuevo estudiante — sin nombre", program: "Precálculo", plan: "Grupal", status: "Incompleta", tone: "error" },
];

export const payments: AdminPaymentRow[] = [
  { desc: "Matrícula — Mariana Gómez", amount: "$695.000 COP", method: "Wompi", status: "Pagado", tone: "success" },
  { desc: "Matrícula — Camilo Andrés Pardo", amount: "$555.000 COP", method: "Wompi", status: "Pagado", tone: "success" },
  { desc: "Matrícula — grupo institucional (12)", amount: "Por confirmar", method: "Transferencia", status: "Pendiente", tone: "warning" },
  { desc: "Renovación — Sara Valentina Cruz", amount: "$555.000 COP", method: "Wompi", status: "Fallido", tone: "error" },
];

export const scheduledReports: AdminScheduledReport[] = [
  { title: "Reporte quincenal — Grado 11°", to: "Acudientes 11°", when: "1 sep 2026", status: "Programado", tone: "info" },
  { title: "Reporte mensual — Colegio San Rafael", to: "Coordinación", when: "1 sep 2026", status: "Programado", tone: "info" },
  { title: "Reporte quincenal — Grado 10°", to: "Acudientes 10°", when: "Enviado 16 ago 2026", status: "Entregado", tone: "success" },
  { title: "Reporte de simulacro institucional", to: "Colegio San Rafael", when: "Enviado 19 jul 2026", status: "Fallido", tone: "error" },
];
