import "server-only";
import { documentTypes } from "@/lib/data/document-types";
import type { DocumentType } from "@/lib/supabase/database.types";

const VALID_DOCUMENT_TYPES = new Set(documentTypes.map((d) => d.value));

export interface ContactoFormData {
  telefono: string | null;
  tipoDocumento: DocumentType | null;
  numeroDocumento: string | null;
}

/** Ambos —tipo y número de documento— son opcionales, pero si uno viene el
 * otro también: un tipo de documento sin número (o viceversa) es un dato a
 * medias que no sirve para nada. */
export function readContactoForm(formData: FormData): { error: string } | { data: ContactoFormData } {
  const telefono = String(formData.get("telefono") ?? "").trim();
  const tipoDocumento = String(formData.get("tipo_documento") ?? "").trim();
  const numeroDocumento = String(formData.get("numero_documento") ?? "").trim();

  if (tipoDocumento && !VALID_DOCUMENT_TYPES.has(tipoDocumento as DocumentType)) {
    return { error: "Selecciona un tipo de documento válido." };
  }
  if (tipoDocumento && !numeroDocumento) return { error: "Ingresa el número de documento." };
  if (numeroDocumento && !tipoDocumento) return { error: "Selecciona el tipo de documento." };

  return {
    data: {
      telefono: telefono || null,
      tipoDocumento: (tipoDocumento || null) as DocumentType | null,
      numeroDocumento: numeroDocumento || null,
    },
  };
}
