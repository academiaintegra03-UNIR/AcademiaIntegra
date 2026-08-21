-- Tipo de cobro y duración por plan, y vencimiento automático de
-- suscripciones (sin necesitar un cron: se compara la fecha en cada
-- consulta). Pegar en Supabase SQL Editor. Requiere 0001..0013 ya
-- aplicadas.

create type public.plan_billing_type as enum ('pago_unico', 'mensual', 'prueba_gratis');

alter table public.plans add column billing_type public.plan_billing_type not null default 'pago_unico';
-- Días desde que se activa hasta que vence; null = no vence (solo tiene
-- sentido en pago único, ej. "acceso de por vida").
alter table public.plans add column duration_days integer check (duration_days is null or duration_days > 0);

-- check_colegio_id (0003, redefinida en 0005 y 0013): ahora además exige
-- que la suscripción no esté vencida.
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

    if tg_op = 'UPDATE' and old.colegio_id = new.colegio_id then
      return new;
    end if;

    select coalesce(s.seat_limit_override, p.seat_limit) into v_seat_limit
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.profile_id = new.colegio_id
      and s.status = 'active'
      and (s.expires_at is null or s.expires_at > now())
      and p.type = 'institucional'
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

-- check_guardian_students_roles (0004, redefinida en 0005 y 0013): mismo
-- criterio de vencimiento para planes grupales/familiares.
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

  select coalesce(s.seat_limit_override, p.seat_limit) into v_seat_limit
  from public.subscriptions s
  join public.plans p on p.id = s.plan_id
  where s.profile_id = new.guardian_id
    and s.status = 'active'
    and (s.expires_at is null or s.expires_at > now())
    and p.type = 'grupal'
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
