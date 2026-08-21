-- Grupos y asignación de tutor. Pegar en Supabase SQL Editor.
-- Requiere 0001..0007 ya aplicadas.

-- tutor_students (0003_relationships.sql) nunca se usó en la app (solo
-- vivía en los tipos) — se reemplaza por grupos + grupo_estudiantes, que
-- cubre asignación individual (grupo de 1), familiar, por colegio
-- (con subdivisión), o libre/mezclada.
drop policy if exists "Los tutores ven sus propios enlaces" on public.tutor_students;
drop policy if exists "Los estudiantes ven quién es su tutor" on public.tutor_students;
drop policy if exists "Los administradores ven todos los enlaces de tutores" on public.tutor_students;
drop trigger if exists tutor_students_check_roles on public.tutor_students;
drop function if exists public.check_tutor_students_roles();
drop table if exists public.tutor_students;

create table public.grupos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- Contexto opcional: un subgrupo de un colegio (ej. "8A") o el grupo
  -- automático de todos sus estudiantes. Null = familiar/individual/libre.
  colegio_id uuid references public.profiles (id) on delete cascade,
  tutor_id uuid references public.profiles (id) on delete set null,
  -- Marca el grupo "todos los estudiantes de este colegio", mantenido
  -- automáticamente por el trigger de abajo. Los subgrupos manuales
  -- (8A, 8B, "Aritmética", familiar, individual) siempre quedan en false.
  es_default_colegio boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grupos_default_requiere_colegio
    check (not es_default_colegio or colegio_id is not null)
);

-- Un solo grupo default por colegio.
create unique index grupos_default_colegio_uidx
  on public.grupos (colegio_id)
  where es_default_colegio;

create index grupos_colegio_id_idx on public.grupos (colegio_id);
create index grupos_tutor_id_idx on public.grupos (tutor_id);

create trigger grupos_set_updated_at
  before update on public.grupos
  for each row execute function public.set_updated_at();

alter table public.grupos enable row level security;

create policy "Los administradores gestionan los grupos"
  on public.grupos for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Los tutores ven sus grupos"
  on public.grupos for select
  using (tutor_id = auth.uid());

create policy "Los colegios ven sus grupos"
  on public.grupos for select
  using (colegio_id = auth.uid());

create table public.grupo_estudiantes (
  grupo_id uuid not null references public.grupos (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (grupo_id, student_id)
);

create index grupo_estudiantes_student_id_idx on public.grupo_estudiantes (student_id);

alter table public.grupo_estudiantes enable row level security;

create policy "Los administradores gestionan la membresía de grupos"
  on public.grupo_estudiantes for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Los estudiantes ven sus propios grupos"
  on public.grupo_estudiantes for select
  using (student_id = auth.uid());

create policy "Los tutores ven la membresía de sus grupos"
  on public.grupo_estudiantes for select
  using (exists (
    select 1 from public.grupos g where g.id = grupo_id and g.tutor_id = auth.uid()
  ));

create policy "Los colegios ven la membresía de sus grupos"
  on public.grupo_estudiantes for select
  using (exists (
    select 1 from public.grupos g where g.id = grupo_id and g.colegio_id = auth.uid()
  ));

-- Mantiene el grupo default de cada colegio en sincronía con
-- profiles.colegio_id: al asignar un estudiante a un colegio lo agrega
-- (creando el grupo default si hace falta); al quitárselo, lo saca solo
-- de ese grupo default (los subgrupos manuales los cura el admin/colegio
-- a mano). Corre AFTER porque necesita insertar/borrar en otra tabla.
create function public.sync_colegio_default_grupo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grupo_id uuid;
begin
  if new.role <> 'estudiante' then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.colegio_id is not distinct from new.colegio_id then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.colegio_id is not null then
    delete from public.grupo_estudiantes ge
      using public.grupos g
      where ge.grupo_id = g.id
        and g.colegio_id = old.colegio_id
        and g.es_default_colegio
        and ge.student_id = new.id;
  end if;

  if new.colegio_id is not null then
    select id into v_grupo_id from public.grupos
      where colegio_id = new.colegio_id and es_default_colegio;

    if v_grupo_id is null then
      insert into public.grupos (name, colegio_id, es_default_colegio)
      select p.nombre || ' — Todos', new.colegio_id, true
      from public.profiles p where p.id = new.colegio_id
      returning id into v_grupo_id;
    end if;

    insert into public.grupo_estudiantes (grupo_id, student_id)
    values (v_grupo_id, new.id)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create trigger profiles_sync_colegio_default_grupo
  after insert or update of colegio_id on public.profiles
  for each row execute function public.sync_colegio_default_grupo();
