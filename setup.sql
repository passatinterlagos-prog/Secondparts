-- Rulează în Supabase: SQL Editor -> New query -> Run
-- Vizitatorii doar citesc; doar utilizatorul autentificat (tu) poate scrie.
create table if not exists piese (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data jsonb not null
);
alter table piese enable row level security;
drop policy if exists "citire publica" on piese;
create policy "citire publica" on piese for select to anon, authenticated using (true);
drop policy if exists "adaugare publica" on piese;
drop policy if exists "admin adauga" on piese;
drop policy if exists "admin modifica" on piese;
drop policy if exists "admin sterge" on piese;
create policy "admin adauga" on piese for insert to authenticated with check (true);
create policy "admin modifica" on piese for update to authenticated using (true) with check (true);
create policy "admin sterge" on piese for delete to authenticated using (true);

-- Poze: bucket public, scriere doar pentru admin
insert into storage.buckets (id,name,public) values ('poze','poze',true) on conflict (id) do nothing;
drop policy if exists "poze citire" on storage.objects;
drop policy if exists "poze upload" on storage.objects;
drop policy if exists "poze stergere" on storage.objects;
create policy "poze citire" on storage.objects for select using (bucket_id='poze');
create policy "poze upload" on storage.objects for insert to authenticated with check (bucket_id='poze');
create policy "poze stergere" on storage.objects for delete to authenticated using (bucket_id='poze');

-- COMENZI: oricine poate trimite o comanda, doar tu le poti vedea
create table if not exists comenzi (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data jsonb not null
);
alter table comenzi enable row level security;
drop policy if exists "comanda publica" on comenzi;
drop policy if exists "admin citeste comenzi" on comenzi;
drop policy if exists "admin modifica comenzi" on comenzi;
drop policy if exists "admin sterge comenzi" on comenzi;
create policy "comanda publica" on comenzi for insert to anon, authenticated with check (pg_column_size(data) < 6000);
create policy "admin citeste comenzi" on comenzi for select to authenticated using (true);
create policy "admin modifica comenzi" on comenzi for update to authenticated using (true) with check (true);
create policy "admin sterge comenzi" on comenzi for delete to authenticated using (true);

-- STATISTICI: vizitatorii trimit evenimente (vizualizare, apel, whatsapp), doar tu le poti citi
create table if not exists evenimente (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  data jsonb not null
);
alter table evenimente enable row level security;
drop policy if exists "eveniment public" on evenimente;
drop policy if exists "admin citeste evenimente" on evenimente;
drop policy if exists "admin sterge evenimente" on evenimente;
create policy "eveniment public" on evenimente for insert to anon, authenticated with check (pg_column_size(data) < 600);
create policy "admin citeste evenimente" on evenimente for select to authenticated using (true);
create policy "admin sterge evenimente" on evenimente for delete to authenticated using (true);
