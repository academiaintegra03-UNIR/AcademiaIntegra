import type { PlanType, PaymentStatus } from "@/lib/supabase/database.types";

export type { PlanType, PaymentStatus };

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
