import type { FaqItem } from "@/lib/types/content";

// Ported verbatim from reference/prototipos/Academia Integra.dc.html.
export const homeFaqs: FaqItem[] = [
  {
    q: "¿Necesito experiencia previa para empezar?",
    a: "No. Empezamos con un diagnóstico gratuito para ubicarte en el nivel adecuado.",
  },
  {
    q: "¿Las clases son en vivo o grabadas?",
    a: "Son en vivo, con material de apoyo grabado disponible para repasar.",
  },
  {
    q: "¿Ofrecen becas o descuentos?",
    a: "Los descuentos vigentes se confirman con el equipo de admisiones — pendiente de validación con el propietario.",
  },
];

export const allFaqs: FaqItem[] = [
  ...homeFaqs,
  {
    q: "¿Cómo funciona el tutor con inteligencia artificial?",
    a: "Ofrece pistas y preguntas guía para que el estudiante razone por sí mismo, y remite al tutor humano cuando es necesario. Puede cometer errores.",
  },
  {
    q: "¿Qué pasa si mi hijo es menor de edad?",
    a: "Se solicita el consentimiento del acudiente antes de crear la cuenta y antes del diagnóstico.",
  },
  {
    q: "¿Puedo cambiar de plan después de matricularme?",
    a: "Sí, puedes solicitar el cambio de plan desde tu panel o contactando al equipo de admisiones.",
  },
  {
    q: "¿Los colegios pueden inscribir grupos completos?",
    a: "Sí, mediante el panel de colegios, con tarifas institucionales pendientes de confirmación.",
  },
  {
    q: "¿Garantizan un puntaje o la admisión a una universidad?",
    a: "No. Ofrecemos acompañamiento y una ruta de estudio seria, pero no garantizamos resultados de exámenes ni admisiones.",
  },
];
