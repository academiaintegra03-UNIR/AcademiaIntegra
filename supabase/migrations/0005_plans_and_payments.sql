-- Planes, pagos (Wompi) y suscripciones. Pegar en Supabase SQL Editor.
-- Requiere 0001..0004 ya aplicadas.

-- individual: comprador queda como estudiante (1 cupo, es él mismo).
-- grupal: comprador queda como acudiente; cupos extra = sus hijos, vía
--   guardian_students (ej. familia con varios estudiantes).
-- institucional: comprador queda como colegio; cupos extra = sus
--   estudiantes, vía profiles.colegio_id (ya existía desde 0003).
create type public.plan_type as enum ('individual', 'grupal', 'institucional');

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Frase corta bajo el nombre en la tarjeta pública (ej. "Clases en vivo
  -- grupales de alto rendimiento."), distinta de la lista de features.
  description text not null default '',
  type public.plan_type not null,
  price_cop integer not null check (price_cop >= 0),
  -- Cupo de estudiantes; null = individual (1, el propio comprador).
  -- Aplica tanto a grupal como a institucional.
  seat_limit integer check (seat_limit is null or seat_limit > 0),
  period text not null,
  badge text,
  features text[] not null default '{}',
  -- Agrupa planes relacionados para mostrarlos con pestañas en
  -- /planes-precios (ej. "Grado 10°" / "Grado 11°" para el mismo esquema
  -- con precios distintos). Null = no se agrupa, se muestra suelto.
  group_label text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger plans_set_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

alter table public.plans enable row level security;

-- Contenido de marketing — cualquiera (incluso sin sesión) puede leer los
-- planes activos. Escritura solo admin.
create policy "Cualquiera ve los planes activos"
  on public.plans for select
  using (active);

create policy "Los administradores gestionan los planes"
  on public.plans for all
  using (public.is_admin())
  with check (public.is_admin());

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  plan_id uuid not null references public.plans (id),
  email text not null,
  nombre text not null,
  wompi_transaction_id text unique,
  amount_cop integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'declined', 'error', 'voided')),
  raw_webhook jsonb,
  profile_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_profile_id_idx on public.payments (profile_id);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

-- Nadie escribe vía RLS: el checkout y el webhook usan el cliente admin
-- (service_role), que salta RLS por diseño. Solo lectura para admins.
create policy "Los administradores ven los pagos"
  on public.payments for select
  using (public.is_admin());

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans (id),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index subscriptions_profile_id_idx on public.subscriptions (profile_id);

alter table public.subscriptions enable row level security;

create policy "Los usuarios ven su propia suscripción"
  on public.subscriptions for select
  using (auth.uid() = profile_id);

create policy "Los administradores ven todas las suscripciones"
  on public.subscriptions for select
  using (public.is_admin());

-- Extiende check_colegio_id() (0003_relationships.sql): además de validar
-- el rol, aplica el cupo de la suscripción institucional activa del
-- colegio — pero SOLO si existe una. Sin suscripción registrada no hay
-- límite (mantiene funcionando el flujo gratuito de admin/usuarios que ya
-- usas hoy, sin depender de que exista un pago de por medio).
create or replace function public.check_colegio_id()
returns trigger
language plpgsql
as $$
declare
  v_seat_limit integer;
  v_current_count integer;
begin
  if new.colegio_id is not null then
    if new.role <> 'estudiante' then
      raise exception 'Solo un estudiante puede tener colegio_id.';
    end if;
    if not exists (
      select 1 from public.profiles where id = new.colegio_id and role = 'colegio'
    ) then
      raise exception 'colegio_id debe apuntar a un perfil con role = colegio.';
    end if;

    -- Si ya tenía este mismo colegio_id, no cuenta como una asignación
    -- nueva (permite editar otros campos del estudiante sin recontar).
    if tg_op = 'UPDATE' and old.colegio_id = new.colegio_id then
      return new;
    end if;

    select p.seat_limit into v_seat_limit
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.profile_id = new.colegio_id and s.status = 'active' and p.type = 'institucional'
    order by s.started_at desc
    limit 1;

    if v_seat_limit is not null then
      select count(*) into v_current_count
      from public.profiles
      where colegio_id = new.colegio_id and id <> new.id;

      if v_current_count >= v_seat_limit then
        raise exception 'El colegio ya alcanzó su cupo de % estudiantes.', v_seat_limit;
      end if;
    end if;
  end if;
  return new;
end;
$$;

-- Extiende check_guardian_students_roles() (0004_guardian_tutor_role_checks.sql)
-- con el mismo criterio: aplica el cupo del plan grupal activo del
-- acudiente solo si existe una suscripción; si no, sin límite (mismo
-- comportamiento gratuito de hoy).
create or replace function public.check_guardian_students_roles()
returns trigger
language plpgsql
as $$
declare
  v_seat_limit integer;
  v_current_count integer;
begin
  if not exists (select 1 from public.profiles where id = new.guardian_id and role = 'acudiente') then
    raise exception 'guardian_id debe apuntar a un perfil con role = acudiente.';
  end if;
  if not exists (select 1 from public.profiles where id = new.student_id and role = 'estudiante') then
    raise exception 'student_id debe apuntar a un perfil con role = estudiante.';
  end if;

  select p.seat_limit into v_seat_limit
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.profile_id = new.guardian_id and s.status = 'active' and p.type = 'grupal'
  order by s.started_at desc
  limit 1;

  if v_seat_limit is not null then
    select count(*) into v_current_count
    from public.guardian_students
    where guardian_id = new.guardian_id;

    if v_current_count >= v_seat_limit then
      raise exception 'Este acudiente ya alcanzó su cupo de % estudiantes.', v_seat_limit;
    end if;
  end if;

  return new;
end;
$$;
