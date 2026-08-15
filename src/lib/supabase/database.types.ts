/**
 * Hand-written to match web/supabase/migrations/*.sql, following the shape
 * `supabase gen types typescript` would produce (Views/Functions/Enums/
 * CompositeTypes and each table's Relationships are required by
 * @supabase/supabase-js's generics — omitting them collapses query results
 * to `never`). Once `supabase login` is set up locally, replace with:
 *   pnpm dlx supabase gen types typescript --project-id <ref> > src/lib/supabase/database.types.ts
 */
export type UserRole =
  | "estudiante"
  | "acudiente"
  | "colegio"
  | "tutor"
  | "administrador";

export type PlanType = "individual" | "grupal" | "institucional";
export type PaymentStatus = "pending" | "approved" | "declined" | "error" | "voided";
export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          nombre: string;
          colegio_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          nombre: string;
          colegio_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          nombre?: string;
          colegio_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      guardian_students: {
        Row: { guardian_id: string; student_id: string; created_at: string };
        Insert: { guardian_id: string; student_id: string; created_at?: string };
        Update: { guardian_id?: string; student_id?: string; created_at?: string };
        Relationships: [];
      };
      tutor_students: {
        Row: { tutor_id: string; student_id: string; created_at: string };
        Insert: { tutor_id: string; student_id: string; created_at?: string };
        Update: { tutor_id?: string; student_id?: string; created_at?: string };
        Relationships: [];
      };
      chat_logs: {
        Row: {
          id: string;
          created_at: string;
          source: string;
          success: boolean;
          error_reason: string | null;
          latency_ms: number | null;
          user_message_length: number | null;
          prompt_tokens: number | null;
          candidate_tokens: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          source?: string;
          success: boolean;
          error_reason?: string | null;
          latency_ms?: number | null;
          user_message_length?: number | null;
          prompt_tokens?: number | null;
          candidate_tokens?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          source?: string;
          success?: boolean;
          error_reason?: string | null;
          latency_ms?: number | null;
          user_message_length?: number | null;
          prompt_tokens?: number | null;
          candidate_tokens?: number | null;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: PlanType;
          price_cop: number;
          seat_limit: number | null;
          period: string;
          badge: string | null;
          features: string[];
          group_label: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          type: PlanType;
          price_cop: number;
          seat_limit?: number | null;
          period: string;
          badge?: string | null;
          features?: string[];
          group_label?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          type?: PlanType;
          price_cop?: number;
          seat_limit?: number | null;
          period?: string;
          badge?: string | null;
          features?: string[];
          group_label?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          reference: string;
          plan_id: string;
          email: string;
          nombre: string;
          wompi_transaction_id: string | null;
          amount_cop: number;
          status: PaymentStatus;
          raw_webhook: unknown;
          profile_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference: string;
          plan_id: string;
          email: string;
          nombre: string;
          wompi_transaction_id?: string | null;
          amount_cop: number;
          status?: PaymentStatus;
          raw_webhook?: unknown;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference?: string;
          plan_id?: string;
          email?: string;
          nombre?: string;
          wompi_transaction_id?: string | null;
          amount_cop?: number;
          status?: PaymentStatus;
          raw_webhook?: unknown;
          profile_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          plan_id: string;
          profile_id: string;
          status: SubscriptionStatus;
          started_at: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          profile_id: string;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          profile_id?: string;
          status?: SubscriptionStatus;
          started_at?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      plan_type: PlanType;
    };
    CompositeTypes: Record<string, never>;
  };
}
