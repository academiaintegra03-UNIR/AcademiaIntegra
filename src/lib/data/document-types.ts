import type { DocumentType } from "@/lib/supabase/database.types";

export const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "TI", label: "Tarjeta de identidad" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "PA", label: "Pasaporte" },
  { value: "NIT", label: "NIT (colegio / institución)" },
];

export function documentTypeLabel(value: DocumentType | null): string {
  return documentTypes.find((d) => d.value === value)?.label ?? "—";
}
