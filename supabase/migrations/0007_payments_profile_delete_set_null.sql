-- Corrige la FK payments.profile_id, que hoy bloquea el borrado de
-- usuarios. Pegar en Supabase SQL Editor.

-- 0005_plans_and_payments.sql creó `profile_id uuid references
-- public.profiles (id)` sin ON DELETE explícito → Postgres usa NO ACTION
-- por defecto, así que borrar un perfil con al menos un pago (incluso
-- "pending" o "declined") falla con un error de llave foránea. El
-- historial de pagos es contable y debe sobrevivir al borrado del
-- usuario, así que se desvincula (SET NULL) en vez de arrastrarlo en
-- cascada.
alter table public.payments
  drop constraint payments_profile_id_fkey,
  add constraint payments_profile_id_fkey
    foreign key (profile_id) references public.profiles (id) on delete set null;
