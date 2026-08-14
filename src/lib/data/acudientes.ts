// Ported verbatim from reference/prototipos/Panel Acudientes.dc.html (mock/demo data).
import type { Invoice, InboxMessage, ProgressItem, Stat, StudentReport } from "@/lib/types/panels";

export const guardianName = "Luisa Gómez";
export const guardianMeta = "Acudiente de Mariana";

export const studentSummary = {
  name: "Mariana Gómez",
  meta: "Grado 11° · Plan: Esquema personalizado",
  status: "Al día",
};

export const statCards: Stat[] = [
  { label: "Avance general", value: "64%" },
  { label: "Asistencia", value: "95%" },
  { label: "Actividades completadas", value: "22/26" },
  { label: "Simulacros realizados", value: "5" },
];

export const nextClass = {
  title: "Álgebra: sistemas de ecuaciones",
  meta: "Hoy · 4:00 p.m. · Profesor Andrés Rojas",
};

export const recentTutorMessage =
  "Mariana avanza bien en geometría. Vamos a reforzar trigonometría antes del próximo simulacro.";

export const areaPerformance: ProgressItem[] = [
  { name: "Razonamiento cuantitativo", pct: 78 },
  { name: "Lectura crítica", pct: 65 },
  { name: "Ciencias naturales", pct: 58 },
  { name: "Ciencias sociales", pct: 71 },
  { name: "Inglés", pct: 84 },
];

export const masteredTopics = ["Ecuaciones lineales", "Perímetro y área", "Proporciones"];
export const weakTopics = ["Factorización", "Trigonometría"];

export const reports: StudentReport[] = [
  { title: "Reporte quincenal — 1 al 15 de agosto", date: "Enviado 16 ago 2026", status: "Entregado", tone: "success" },
  { title: "Reporte quincenal — 16 al 31 de julio", date: "Enviado 1 ago 2026", status: "Entregado", tone: "success" },
  { title: "Reporte mensual — Julio 2026", date: "Enviado 1 ago 2026", status: "Entregado", tone: "success" },
  { title: "Reporte quincenal — próximo", date: "Programado 1 sep 2026", status: "Programado", tone: "info" },
];

export const planSummary = {
  name: "Esquema personalizado",
  amount: "$695.000 COP / semestre",
  nextPayment: "Próximo pago: 22 de enero",
};

export const invoices: Invoice[] = [
  { desc: "Matrícula semestral — Esquema personalizado", date: "22 ene 2026", amount: "$695.000 COP", status: "Pagado", tone: "success" },
  { desc: "Material de simulacro adicional", date: "10 mar 2026", amount: "$45.000 COP", status: "Pagado", tone: "success" },
  { desc: "Renovación semestral", date: "22 jul 2026", amount: "Por confirmar", status: "Pendiente", tone: "warning" },
];

export const messages: InboxMessage[] = [
  { from: "Prof. Andrés Rojas", date: "hace 1 día", text: "Buen avance en geometría esta semana. Repasemos trigonometría antes del simulacro del viernes." },
  { from: "Coordinación académica", date: "hace 5 días", text: "Recuerda que el próximo simulacro completo es el 22 de agosto." },
];

export const messagesPrivacyNote =
  "Por seguridad, las conversaciones del estudiante con el tutor de IA no se muestran aquí, salvo alertas previamente informadas.";
