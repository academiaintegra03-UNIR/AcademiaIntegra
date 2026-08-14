-- Academia Integra — perfiles y roles
-- Pegar en Supabase Dashboard → SQL Editor → New query → Run.
-- Fuente de verdad versionada; no se aplica con `supabase db push` todavía
-- (requiere `supabase login` interactivo, ver README de este directorio).

create type public.user_role as enum (
  'estudiante',
  'acudiente',
  'colegio',
  'tutor',
  'administrador'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  nombre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

-- security definer: evita que la policy de "admins ven todo" se llame a sí
-- misma en bucle al hacer el select interno sobre profiles.
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'administrador'
  );
$$;

create policy "Los usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Los administradores ven todos los perfiles"
  on public.profiles for select
  using (public.is_admin());

-- Crea automáticamente la fila de profiles cuando se crea un usuario en
-- auth.users. `role` y `nombre` se leen del user_metadata que se pasa al
-- crear el usuario (dashboard "Add user" o supabase.auth.admin.createUser).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nombre)
  values (
    new.id,
    (new.raw_user_meta_data->>'role')::public.user_role,
    coalesce(new.raw_user_meta_data->>'nombre', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
