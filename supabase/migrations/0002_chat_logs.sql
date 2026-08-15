-- Registro de peticiones al chat con IA (Álex y, más adelante, el tutor del
-- campus) — para poder ver métricas reales en /admin/ia.
-- Pegar en Supabase Dashboard → SQL Editor → New query → Run.

create table public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null default 'orientacion',
  success boolean not null,
  error_reason text,
  latency_ms integer,
  user_message_length integer,
  prompt_tokens integer,
  candidate_tokens integer
);

create index chat_logs_created_at_idx on public.chat_logs (created_at desc);

alter table public.chat_logs enable row level security;

-- Solo se escribe desde el server con el cliente admin (service_role), que
-- ya salta RLS — no hace falta policy de insert. Los administradores sí
-- necesitan poder leerlo desde /admin/ia.
create policy "Los administradores ven los logs del chat"
  on public.chat_logs for select
  using (public.is_admin());
