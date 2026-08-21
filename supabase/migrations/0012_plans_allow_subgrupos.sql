-- Permite configurar, por plan, si un colegio institucional puede crear
-- sus propios subgrupos. Pegar en Supabase SQL Editor. Requiere 0001..0011
-- ya aplicadas.

-- Default true: los planes institucionales existentes no pierden de
-- golpe una capacidad que ya tenían (mismo criterio que seat_limit y
-- colegio_id — nunca romper el flujo ya en marcha).
alter table public.plans add column allow_subgrupos boolean not null default true;
