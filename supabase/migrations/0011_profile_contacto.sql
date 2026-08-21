-- Teléfono y documento de identidad, en tabla aparte. Pegar en Supabase
-- SQL Editor. Requiere 0001..0010 ya aplicadas.

-- Aparte de `profiles` a propósito: profiles.for select ya tiene policies
-- que exponen la fila completa a compañeros de grupo y al colegio propio
-- (0003, 0010) — datos como el número de documento no deben viajar por
-- esas policies. Aquí solo puede leer el propio dueño o un administrador.
create table public.profile_contacto (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  telefono text,
  tipo_documento text check (tipo_documento is null or tipo_documento in ('CC', 'TI', 'CE', 'PA', 'NIT')),
  numero_documento text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profile_contacto_set_updated_at
  before update on public.profile_contacto
  for each row execute function public.set_updated_at();

alter table public.profile_contacto enable row level security;

create policy "Los usuarios ven su propio contacto"
  on public.profile_contacto for select
  using (auth.uid() = profile_id);

create policy "Los administradores gestionan el contacto"
  on public.profile_contacto for all
  using (public.is_admin())
  with check (public.is_admin());

-- handle_new_user (0001, redefinida en 0003) también guarda teléfono y
-- documento si vienen en el metadata — así la creación desde admin/usuarios
-- y desde el checkout público quedan completas en un solo insert atómico.
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

  if nullif(new.raw_user_meta_data->>'telefono', '') is not null
    or nullif(new.raw_user_meta_data->>'tipo_documento', '') is not null
    or nullif(new.raw_user_meta_data->>'numero_documento', '') is not null
  then
    insert into public.profile_contacto (profile_id, telefono, tipo_documento, numero_documento)
    values (
      new.id,
      nullif(new.raw_user_meta_data->>'telefono', ''),
      nullif(new.raw_user_meta_data->>'tipo_documento', ''),
      nullif(new.raw_user_meta_data->>'numero_documento', '')
    );
  end if;

  return new;
end;
$$;
