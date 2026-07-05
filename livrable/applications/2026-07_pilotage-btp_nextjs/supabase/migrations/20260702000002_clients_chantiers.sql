-- Phase 1 : clients, chantiers, avancement de chantier
create table clients (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  company_name text,
  email text,
  phone text,
  address text,
  siret text,
  notes text,
  created_at timestamptz not null default now()
);

create type chantier_status as enum ('a_venir', 'en_cours', 'termine', 'archive');

create table chantiers (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  name text not null,
  address text,
  status chantier_status not null default 'a_venir',
  start_date date,
  end_date_estimated date,
  end_date_actual date,
  budget_estimated numeric(12, 2),
  description text,
  created_at timestamptz not null default now()
);

create table chantier_updates (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  chantier_id uuid not null references chantiers(id) on delete cascade,
  author_id uuid references auth.users(id),
  progress_percent int check (progress_percent between 0 and 100),
  note text,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index clients_org_id_idx on clients(org_id);
create index chantiers_org_id_idx on chantiers(org_id);
create index chantiers_client_id_idx on chantiers(client_id);
create index chantier_updates_chantier_id_idx on chantier_updates(chantier_id);
