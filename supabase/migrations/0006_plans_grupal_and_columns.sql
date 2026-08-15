-- Ajusta lo que dejó la primera corrida de 0005_plans_and_payments.sql
-- (antes de que agregara el tipo "grupal", description y group_label).
-- Pegar en Supabase SQL Editor.
--
-- IMPORTANTE: corre primero el bloque 1 solo, dale Run, y RECIÉN DESPUÉS
-- corre el resto (bloque 2) en otra consulta. Postgres no deja usar un
-- valor de enum nuevo en la misma transacción en la que se agregó, así
-- que hay que separarlo en dos pasos.

-- ============ BLOQUE 1 — correr y dar Run primero, solo esto ============
alter type public.plan_type add value if not exists 'grupal';


-- ============ BLOQUE 2 — correr después, en una consulta nueva ============
alter table public.plans
  add column if not exists description text not null default '';

alter table public.plans
  add column if not exists group_label text;

-- Mismo fix de 0005 original: sin suscripción registrada, sin límite (no
-- bloquea el flujo gratuito de admin/usuarios).
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

-- Agrega el cupo de planes grupales (no existía en la versión de
-- 0004_guardian_tutor_role_checks.sql, que solo validaba roles).
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
