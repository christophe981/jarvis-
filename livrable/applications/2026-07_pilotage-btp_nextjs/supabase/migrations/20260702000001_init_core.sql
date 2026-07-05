-- Phase 0 : organisations, profils, appartenance
create extension if not exists "uuid-ossp";

create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  siret text,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create type member_role as enum ('owner', 'admin', 'member');
create type member_status as enum ('invited', 'active');

create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  invited_email text,
  role member_role not null default 'member',
  status member_status not null default 'invited',
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (org_id, user_id),
  check (user_id is not null or invited_email is not null)
);

-- Crée automatiquement un profil à l'inscription d'un utilisateur Supabase Auth
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
