import type { Country, CountryId } from "@/lib/types/content";

// Ported verbatim from reference/prototipos/Academia Integra.dc.html (this.countries).
export const countries: Record<CountryId, Country> = {
  colombia: {
    id: "colombia",
    name: "Colombia",
    flag: "🇨🇴",
    exam: "Saber 11° / Admisión Universidad Nacional",
    description:
      "Preparación para el examen ICFES Saber 11° y para exámenes de admisión de universidades como la Nacional, con foco en razonamiento y comprensión, no en memorización.",
    audience: "Estudiantes de grado 10° y 11°, y aspirantes a universidades públicas y privadas.",
    areas: ["Razonamiento cuantitativo", "Lectura crítica", "Ciencias naturales", "Ciencias sociales", "Inglés"],
    modality: "Virtual (todo el país) o presencial en Bogotá",
    duration: "Semestral, Calendario A o B",
    simulations: "Simulacros completos periódicos",
    tracking: "Reportes quincenales a acudientes",
    plans: ["Esquema grupal (grupos de hasta 10)", "Esquema personalizado (grupos de hasta 3)"],
    faqs: [
      {
        q: "¿Cuándo inicia el próximo ciclo?",
        a: "Las fechas se administran desde el panel y se confirman según calendario A o B — pendiente de validación con el propietario para el ciclo vigente.",
      },
      { q: "¿Ofrecen clases presenciales?", a: "Sí, en Bogotá; para el resto del país la modalidad es virtual." },
    ],
  },
  chile: {
    id: "chile",
    name: "Chile",
    flag: "🇨🇱",
    exam: "PAES",
    description:
      "Preparación para la Prueba de Acceso a la Educación Superior (PAES), bajo la escala de puntajes definida por el sistema de admisión chileno.",
    audience: "Estudiantes de enseñanza media que buscan ingresar a la educación superior en Chile.",
    areas: ["Competencia Lectora", "Matemática M1", "Matemática M2", "Ciencias", "Historia y Ciencias Sociales"],
    modality: "Virtual (internacional)",
    duration: "Según calendario oficial PAES",
    simulations: "Simulacros por módulo",
    tracking: "Reportes periódicos a acudientes",
    plans: ["Esquema grupal", "Esquema personalizado"],
    faqs: [
      {
        q: "¿Qué módulos se pueden preparar?",
        a: "Competencia Lectora, Matemática M1 y M2, con opción de Ciencias e Historia según necesidad.",
      },
    ],
  },
  mexico: {
    id: "mexico",
    name: "México",
    flag: "🇲🇽",
    exam: "EXANI-II",
    description:
      "Preparación para el EXANI-II (Ceneval), utilizado como examen de admisión por múltiples universidades mexicanas.",
    audience: "Aspirantes a educación superior en instituciones que solicitan EXANI-II.",
    areas: ["Pensamiento matemático", "Comprensión lectora", "Redacción indirecta", "Módulos específicos"],
    modality: "Virtual (internacional)",
    duration: "Según fecha de examen elegida",
    simulations: "Simulacros por área",
    tracking: "Reportes periódicos a acudientes",
    plans: ["Esquema grupal", "Esquema personalizado"],
    faqs: [
      {
        q: "¿Incluye módulos específicos de carrera?",
        a: "Sí, según la universidad de destino — el detalle exacto está pendiente de confirmación con el propietario.",
      },
    ],
  },
  costa_rica: {
    id: "costa_rica",
    name: "Costa Rica",
    flag: "🇨🇷",
    exam: "PAA",
    description:
      "Preparación para la Prueba de Aptitud Académica (PAA) utilizada por universidades como UCR, TEC y UNA.",
    audience: "Estudiantes de último año de secundaria y aspirantes a universidades públicas costarricenses.",
    areas: ["Razonamiento matemático", "Razonamiento verbal", "Comprensión de lectura"],
    modality: "Virtual (internacional)",
    duration: "Según calendario de cada universidad",
    simulations: "Simulacros de práctica",
    tracking: "Reportes periódicos a acudientes",
    plans: ["Esquema grupal", "Esquema personalizado"],
    faqs: [
      {
        q: "¿Sirve para UCR, TEC y UNA por igual?",
        a: "La estructura general aplica a las tres; las particularidades de cada universidad están pendientes de confirmación.",
      },
    ],
  },
};

export const countryOrder: CountryId[] = ["colombia", "chile", "mexico", "costa_rica"];
