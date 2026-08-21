-- Permite que un estudiante vea su(s) propio(s) grupo(s), a sus
-- compañeros de grupo y al tutor asignado. Pegar en Supabase SQL Editor.
-- Requiere 0001..0008 ya aplicadas.

create policy "Los estudiantes ven sus grupos"
  on public.grupos for select
  using (exists (
    select 1 from public.grupo_estudiantes ge
    where ge.grupo_id = grupos.id and ge.student_id = auth.uid()
  ));

-- Ver la membresía completa de un grupo (no solo la propia fila) — hace
-- falta para listar compañeros. No es recursivo: la policy "Los
-- estudiantes ven sus propios grupos" (0008) ya resuelve por sí sola el
-- acceso a la subconsulta `mine`, sin depender de esta policy.
create policy "Los estudiantes ven la membresía de sus grupos"
  on public.grupo_estudiantes for select
  using (exists (
    select 1 from public.grupo_estudiantes mine
    where mine.grupo_id = grupo_estudiantes.grupo_id and mine.student_id = auth.uid()
  ));

create policy "Los estudiantes ven a sus compañeros de grupo"
  on public.profiles for select
  using (exists (
    select 1 from public.grupo_estudiantes mine
    join public.grupo_estudiantes theirs on theirs.grupo_id = mine.grupo_id
    where mine.student_id = auth.uid() and theirs.student_id = profiles.id
  ));

create policy "Los estudiantes ven al tutor de su grupo"
  on public.profiles for select
  using (exists (
    select 1 from public.grupos g
    join public.grupo_estudiantes ge on ge.grupo_id = g.id
    where g.tutor_id = profiles.id and ge.student_id = auth.uid()
  ));
