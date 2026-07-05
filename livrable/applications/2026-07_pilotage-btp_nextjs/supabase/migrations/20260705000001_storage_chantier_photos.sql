-- Phase 1 : bucket Storage prive pour les photos d'avancement de chantier
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chantier-photos',
  'chantier-photos',
  false,
  10485760, -- 10 Mo
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

-- Convention de chemin : <org_id>/<chantier_id>/<fichier>
create policy chantier_photos_select on storage.objects
  for select using (
    bucket_id = 'chantier-photos'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy chantier_photos_insert on storage.objects
  for insert with check (
    bucket_id = 'chantier-photos'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy chantier_photos_update on storage.objects
  for update using (
    bucket_id = 'chantier-photos'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );

create policy chantier_photos_delete on storage.objects
  for delete using (
    bucket_id = 'chantier-photos'
    and public.is_org_member((storage.foldername(name))[1]::uuid)
  );
