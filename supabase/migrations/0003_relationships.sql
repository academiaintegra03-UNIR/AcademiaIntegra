-- Relaciones entre perfiles: estudiante↔colegio, acudiente↔estudiante,
-- tutor↔estudiante. Pegar en Supabase Dashboard → SQL Editor → New query → Run.
-- Requiere que 0001_profiles.sql ya esté aplicada.

-- Un estudiante pertenece a un colegio (o a ninguno — independiente).
alter table public.profiles
  add column colegio_id uuid references public.profiles (id) on delete set null;

create index profiles_colegio_id_idx on public.profiles (colegio_id);

-- Solo un perfil con role = 'estudiante' puede tener colegio_id, y solo puede
-- apuntar a un perfil con role = 'colegio'. Un check constraint no puede
-- consultar otra fila, así que se valida con un trigger.
create function public.check_colegio_id()
returns trigger
language plpgsql
as $$
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
  end if;
  return new;
end;
$$;

create trigger profiles_check_colegio_id
  before insert or update on public.profiles
  for each row execute function public.check_colegio_id();

-- Acudiente ↔ estudiante (varios-a-varios: un acudiente puede tener más de
-- un hijo; un estudiante, más de un acudiente).
create table public.guardian_students (
  guardian_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (guardian_id, student_id)
);

create index guardian_students_student_id_idx on public.guardian_students (student_id);

alter table public.guardian_students enable row level security;

create policy "Los acudientes ven sus propios enlaces"
  on public.guardian_students for select
  using (auth.uid() = guardian_id);

create policy "Los estudiantes ven quién es su acudiente"
  on public.guardian_students for select
  using (auth.uid() = student_id);

create policy "Los administradores ven todos los enlaces de acudientes"
  on public.guardian_students for select
  using (public.is_admin());

-- Tutor ↔ estudiante (varios-a-varios: un tutor puede tener varios
-- estudiantes asignados).
create table public.tutor_students (
  tutor_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tutor_id, student_id)
);

create index tutor_students_student_id_idx on public.tutor_students (student_id);

alter table public.tutor_students enable row level security;

create policy "Los tutores ven sus propios enlaces"
  on public.tutor_students for select
  using (auth.uid() = tutor_id);

create policy "Los estudiantes ven quién es su tutor"
  on public.tutor_students for select
  using (auth.uid() = student_id);

create policy "Los administradores ven todos los enlaces de tutores"
  on public.tutor_students for select
  using (public.is_admin());

-- Los colegios necesitan ver el perfil de sus propios estudiantes (además de
-- la policy existente de "cada quien ve su propio perfil").
create policy "Los colegios ven a sus estudiantes"
  on public.profiles for select
  using (colegio_id = auth.uid());

-- handle_new_user (de 0001_profiles.sql) solo leía role/nombre del metadata.
-- Se reemplaza para también aceptar colegio_id, así la creación del
-- estudiante y su asignación a un colegio quedan en un solo insert atómico.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nombre, colegio_id)
  values (
    new.id,
    (new.raw_user_meta_data->>'role')::public.user_role,
    coalesce(new.raw_user_meta_data->>'nombre', new.email),
    nullif(new.raw_user_meta_data->>'colegio_id', '')::uuid
  );
  return new;
end;
$$;
