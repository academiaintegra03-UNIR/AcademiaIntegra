import type { PlanType, PaymentStatus, PlanBillingType } from "@/lib/supabase/database.types";

export type { PlanType, PaymentStatus, PlanBillingType };

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: PlanType;
  priceCop: number;
  seatLimit: number | null;
  period: string;
  badge: string | null;
  features: string[];
  groupLabel: string | null;
  active: boolean;
  /** Solo aplica a institucional: si el colegio puede crear subgrupos
   * propios en /colegios-panel/grupos. */
  allowSubgrupos: boolean;
  /** Solo aplica a institucional: si el colegio puede invitar acudientes
   * para sus estudiantes en /colegios-panel/estudiantes. */
  allowAcudientes: boolean;
  billingType: PlanBillingType;
  /** Días desde que se activa hasta que vence; null = no vence. */
  durationDays: number | null;
}

export interface AdminPaymentRow {
  id: string;
  reference: string;
  planName: string;
  email: string;
  nombre: string;
  amountCop: number;
  status: PaymentStatus;
  createdAt: string;
}
