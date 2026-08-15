-- Integridad de rol para las tablas de enlace creadas en 0003_relationships.sql
-- (igual que check_colegio_id: un check constraint no puede consultar otra
-- fila, así que se valida con un trigger). Pegar en Supabase SQL Editor.

create function public.check_guardian_students_roles()
returns trigger
language plpgsql
as $$
begin
  if not exists (select 1 from public.profiles where id = new.guardian_id and role = 'acudiente') then
    raise exception 'guardian_id debe apuntar a un perfil con role = acudiente.';
  end if;
  if not exists (select 1 from public.profiles where id = new.student_id and role = 'estudiante') then
    raise exception 'student_id debe apuntar a un perfil con role = estudiante.';
  end if;
  return new;
end;
$$;

create trigger guardian_students_check_roles
  before insert or update on public.guardian_students
  for each row execute function public.check_guardian_students_roles();

create function public.check_tutor_students_roles()
returns trigger
language plpgsql
as $$
begin
  if not exists (select 1 from public.profiles where id = new.tutor_id and role = 'tutor') then
    raise exception 'tutor_id debe apuntar a un perfil con role = tutor.';
  end if;
  if not exists (select 1 from public.profiles where id = new.student_id and role = 'estudiante') then
    raise exception 'student_id debe apuntar a un perfil con role = estudiante.';
  end if;
  return new;
end;
$$;

create trigger tutor_students_check_roles
  before insert or update on public.tutor_students
  for each row execute function public.check_tutor_students_roles();
