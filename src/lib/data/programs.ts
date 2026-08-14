import type { Program, ProgramLevel } from "@/lib/types/content";

// Ported verbatim from reference/prototipos/Academia Integra.dc.html (this.programs).
export const programs: Program[] = [
  {
    id: "primaria-fundamentos",
    level: "Primaria",
    name: "Fundamentos matemáticos",
    blurb: "Aritmética, resolución de problemas y confianza en los primeros años.",
    description:
      "Construye bases sólidas en aritmética y razonamiento lógico, con actividades que fortalecen la confianza del estudiante desde los primeros grados.",
    topics: ["Aritmética", "Resolución de problemas", "Razonamiento lógico", "Confianza académica"],
    methodology:
      "Clases en grupos pequeños con práctica guiada y retroalimentación constante del tutor, apoyadas en el banco de preguntas y actividades cortas.",
    includes: ["Clases en vivo", "Material de práctica", "Seguimiento a padres", "Actividades semanales"],
    modality: "Virtual o presencial (Bogotá)",
    duration: "3 meses (renovable)",
    tutor: "Por asignar según disponibilidad",
  },
  {
    id: "bachillerato-algebra",
    level: "Bachillerato",
    name: "Álgebra y geometría",
    blurb: "Álgebra, geometría, trigonometría y nivelación académica.",
    description:
      "Refuerza los temas clave de bachillerato con un enfoque en comprensión profunda, no en memorización de fórmulas.",
    topics: ["Álgebra", "Geometría", "Trigonometría", "Estadística", "Nivelación"],
    methodology:
      "Sesiones semanales con ejercicios progresivos, evaluaciones cortas y explicación paso a paso de cada concepto.",
    includes: ["Clases en vivo", "Banco de preguntas", "Simulacros parciales", "Reporte de avance"],
    modality: "Virtual o presencial (Bogotá)",
    duration: "4 meses (renovable)",
    tutor: "Por asignar según disponibilidad",
  },
  {
    id: "saber11",
    level: "Preparación de exámenes",
    name: "Preparación Saber 11",
    blurb: "Plan de choque para el examen ICFES y admisión universitaria.",
    description:
      "Preparación estructurada para Saber 11°, con énfasis en las competencias evaluadas y simulacros bajo condiciones reales de tiempo.",
    topics: ["Razonamiento cuantitativo", "Lectura crítica aplicada", "Estrategia de examen", "Manejo del tiempo"],
    methodology:
      "Grupos reducidos, simulacros periódicos con reporte por área y sesiones de refuerzo según resultados.",
    includes: ["Clases en vivo", "Simulacros completos", "Reporte por área", "Acompañamiento a acudientes"],
    modality: "Virtual (toda Colombia) o presencial (Bogotá)",
    duration: "Semestral (Calendario A o B)",
    tutor: "Por asignar según disponibilidad",
  },
  {
    id: "admision-unal",
    level: "Preparación de exámenes",
    name: "Admisión Universidad Nacional",
    blurb: "Preparación específica para el examen de admisión UNAL.",
    description:
      "Ruta enfocada en el examen de admisión de la Universidad Nacional, con práctica dirigida a su estructura y nivel de exigencia.",
    topics: ["Matemáticas", "Lectura crítica", "Ciencias", "Estrategia de examen UNAL"],
    methodology:
      "Clases en vivo, simulacros con formato UNAL y retroalimentación individual sobre errores frecuentes.",
    includes: ["Clases en vivo", "Simulacros UNAL", "Banco de preguntas", "Tutorías de refuerzo"],
    modality: "Virtual o presencial (Bogotá)",
    duration: "Semestral",
    tutor: "Por asignar según disponibilidad",
  },
  {
    id: "precalculo",
    level: "Universidad",
    name: "Precálculo y cálculo diferencial",
    blurb: "Bases para el primer semestre universitario.",
    description:
      "Prepara el ingreso a la universidad reforzando precálculo y cálculo diferencial, los cursos donde más se concentra la deserción temprana.",
    topics: ["Funciones", "Límites", "Derivadas", "Aplicaciones"],
    methodology:
      "Sesiones de resolución de problemas con enfoque conceptual y acompañamiento en tareas del curso universitario.",
    includes: ["Clases en vivo", "Asesorías de tareas", "Banco de ejercicios", "Simulacros de parcial"],
    modality: "Virtual",
    duration: "Por semestre académico",
    tutor: "Por asignar según disponibilidad",
  },
  {
    id: "internacional",
    level: "Preparación de exámenes",
    name: "Preparación internacional",
    blurb: "PAES (Chile), EXANI-II (México) y PAA (Costa Rica).",
    description:
      "Rutas adaptadas a los exámenes de admisión de Chile, México y Costa Rica, con simulacros bajo el formato de cada prueba.",
    topics: ["Matemática M1/M2", "Pensamiento matemático", "Comprensión lectora", "Estrategia según país"],
    methodology:
      "Grupos por país con simulacros específicos y reporte comparado con intentos anteriores.",
    includes: ["Clases en vivo", "Simulacros por país", "Reporte de resultados", "Acompañamiento a acudientes"],
    modality: "Virtual (internacional)",
    duration: "Según calendario de cada país",
    tutor: "Por asignar según disponibilidad",
  },
];

export const programLevels: ProgramLevel[] = [
  "Primaria",
  "Bachillerato",
  "Preparación de exámenes",
  "Universidad",
];

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}
