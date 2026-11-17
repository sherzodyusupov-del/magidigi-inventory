-- Magidigi Inventory: demo storage.
-- The whole app state (items, zones, sites, movement ledger, logbook) is one JSON row.
-- Replace with proper tables and per-user logins before real operational use.

create table if not exists public.app_state (
  id          int primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create or replace function public.touch_app_state() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists app_state_touch on public.app_state;
create trigger app_state_touch before update on public.app_state
  for each row execute function public.touch_app_state();

alter table public.app_state enable row level security;

-- DEMO ONLY: anyone holding the public anon key can read and write this table.
-- Safe for made-up stock numbers. Do not store real data until Supabase Auth is added.
drop policy if exists "demo anon read"   on public.app_state;
drop policy if exists "demo anon insert" on public.app_state;
drop policy if exists "demo anon update" on public.app_state;
create policy "demo anon read"   on public.app_state for select to anon using (true);
create policy "demo anon insert" on public.app_state for insert to anon with check (id = 1);
create policy "demo anon update" on public.app_state for update to anon using (id = 1) with check (id = 1);
