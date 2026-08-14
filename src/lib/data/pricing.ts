import type { PricingPlan } from "@/lib/types/content";

// Ported verbatim from reference/prototipos/Academia Integra.dc.html (pricingPlans).
// The two semester prices come from the legacy site's real Colombia grade 10/11
// tariffs (see reference/prototipos/Matriz de Migracion.dc.html), flagged there
// as "requiere confirmación del propietario" for the next cycle.
export const pricingPlans: PricingPlan[] = [
  {
    name: "Clase individual",
    tagline: "Sesiones personalizadas por hora.",
    price: "Por confirmar",
    period: "Por hora",
    badge: null,
    features: ["1 estudiante por sesión", "Horario a convenir", "Reporte por sesión"],
    pendingValidation: true,
  },
  {
    name: "Microgrupo",
    tagline: "Grupos reducidos con seguimiento cercano.",
    price: "Por confirmar",
    period: "Mensual",
    badge: null,
    features: ["Hasta 3 estudiantes", "3 horas/semana en vivo", "Reportes quincenales"],
    pendingValidation: true,
  },
  {
    name: "Esquema grupal",
    tagline: "Clases en vivo en grupos de hasta 10.",
    price: "$555.000 COP",
    period: "Pago único · semestre (Colombia, 2026)",
    badge: "Más popular",
    features: ["Hasta 10 estudiantes", "3 horas/semana en vivo", "2 simulacros con reporte", "Soporte grupal"],
    pendingValidation: true,
  },
  {
    name: "Esquema personalizado",
    tagline: "Acompañamiento cercano en grupos de hasta 3.",
    price: "$695.000 COP",
    period: "Pago único · semestre (Colombia, 2026)",
    badge: "Recomendado",
    features: ["Hasta 3 estudiantes", "Horario flexible", "Seguimiento individual", "Soporte prioritario"],
    pendingValidation: true,
  },
];

export const pricingNote =
  "Precios de referencia para Colombia (ciclo 2026) — sujetos a confirmación del propietario para otros países y modalidades.";

export const institutionalPricingNote =
  "Tarifas y cupos para grupos de 25 estudiantes o más. Condiciones pendientes de confirmación con el propietario.";
