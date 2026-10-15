-- Rulează în Supabase: SQL Editor -> New query -> Run
-- Vizitatorii doar citesc; doar utilizatorul autentificat (tu) poate scrie.
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
