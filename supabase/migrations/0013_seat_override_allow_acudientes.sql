-- Dos cosas: (1) permite al admin darle a UNA suscripción puntual un cupo
-- distinto al de su plan (ej. "compró el plan de 10, pero le subo a 15"
-- sin crear un plan nuevo ni afectar a los demás en ese plan). (2) permite
-- configurar, por plan, si el colegio puede invitar acudientes para sus
-- estudiantes. Pegar en Supabase SQL Editor. Requiere 0001..0012 ya
-- aplicadas.

alter table public.plans add column allow_acudientes boolean not null default true;

alter table public.subscriptions
  add column seat_limit_override integer check (seat_limit_override is null or seat_limit_override > 0);

-- check_colegio_id (0003, redefinida en 0005): usa el cupo personalizado
-- de la suscripción si el admin puso uno; si no, el del plan de siempre.
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

-- check_guardian_students_roles (0004, redefinida en 0005): mismo criterio
-- para planes grupales/familiares.
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
