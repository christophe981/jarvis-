-- Phase 0 : isolation multi-tenant (RLS)

create function public.is_org_member(target_org uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from organization_members
    where org_id = target_org
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create function public.is_org_admin(target_org uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from organization_members
    where org_id = target_org
      and user_id = auth.uid()
      and status = 'active'
      and role in ('owner', 'admin')
  );
$$;

-- Crée une organisation et rattache son créateur comme owner, en une transaction
-- (contourne le problème d'œuf-et-poule des policies RLS sur organization_members)
create function public.create_organization(org_name text, org_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name, slug)
  values (org_name, org_slug)
  returning id into new_org_id;

  insert into organization_members (org_id, user_id, role, status)
  values (new_org_id, auth.uid(), 'owner', 'active');

  return new_org_id;
end;
$$;

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table organization_members enable row level security;
alter table clients enable row level security;
alter table chantiers enable row level security;
alter table chantier_updates enable row level security;

create policy organizations_select on organizations
  for select using (is_org_member(id));
create policy organizations_update on organizations
  for update using (is_org_admin(id)) with check (is_org_admin(id));

create policy profiles_select_self on profiles
  for select using (id = auth.uid());
create policy profiles_update_self on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy organization_members_select on organization_members
  for select using (is_org_member(org_id));
create policy organization_members_manage on organization_members
  for insert with check (is_org_admin(org_id));
create policy organization_members_update on organization_members
  for update using (is_org_admin(org_id)) with check (is_org_admin(org_id));
create policy organization_members_delete on organization_members
  for delete using (is_org_admin(org_id));

create policy clients_all on clients
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy chantiers_all on chantiers
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy chantier_updates_all on chantier_updates
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));
