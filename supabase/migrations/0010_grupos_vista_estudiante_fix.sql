-- Corrige las políticas de 0009: usaban subconsultas cruzadas entre
-- profiles ↔ grupo_estudiantes ↔ grupos, cada una con su propia RLS —
-- una cadena de políticas entre tablas, el mismo tipo de riesgo por el
-- que ya existe is_admin() como función security definer en vez de
-- resolverlo con subconsultas directas. Se reemplaza con el mismo patrón:
-- funciones security definer que resuelven el lookup una sola vez, sin
-- volver a disparar RLS. Pegar en Supabase SQL Editor (después de 0009).

drop policy if exists "Los estudiantes ven sus grupos" on public.grupos;
drop policy if exists "Los estudiantes ven la membresía de sus grupos" on public.grupo_estudiantes;
drop policy if exists "Los estudiantes ven a sus compañeros de grupo" on public.profiles;
drop policy if exists "Los estudiantes ven al tutor de su grupo" on public.profiles;

create function public.grupo_ids_for_student(p_student_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select grupo_id from public.grupo_estudiantes where student_id = p_student_id;
$$;

create function public.companero_profile_ids(p_student_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select distinct theirs.student_id
  from public.grupo_estudiantes mine
  join public.grupo_estudiantes theirs on theirs.grupo_id = mine.grupo_id
  where mine.student_id = p_student_id;
$$;

create function public.tutor_profile_ids_for_student(p_student_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select distinct g.tutor_id
  from public.grupos g
  join public.grupo_estudiantes ge on ge.grupo_id = g.id
  where ge.student_id = p_student_id and g.tutor_id is not null;
$$;

create policy "Los estudiantes ven sus grupos"
  on public.grupos for select
  using (id in (select public.grupo_ids_for_student(auth.uid())));

create policy "Los estudiantes ven la membresía de sus grupos"
  on public.grupo_estudiantes for select
  using (grupo_id in (select public.grupo_ids_for_student(auth.uid())));

create policy "Los estudiantes ven a sus compañeros de grupo"
  on public.profiles for select
  using (id in (select public.companero_profile_ids(auth.uid())));

create policy "Los estudiantes ven al tutor de su grupo"
  on public.profiles for select
  using (id in (select public.tutor_profile_ids_for_student(auth.uid())));
