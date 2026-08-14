/**
 * Hand-written to match web/supabase/migrations/0001_profiles.sql, following
 * the shape `supabase gen types typescript` would produce (Views/Functions/
 * Enums/CompositeTypes and each table's Relationships are required by
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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          nombre: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: UserRole;
          nombre: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          nombre?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
