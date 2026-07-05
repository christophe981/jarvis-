-- Phase 2 : devis et lignes de devis
create type devis_status as enum ('brouillon', 'envoye', 'accepte', 'refuse', 'expire');

create table devis (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  chantier_id uuid references chantiers(id) on delete set null,
  number text not null,
  status devis_status not null default 'brouillon',
  amount_ht numeric(12, 2) not null default 0,
  tva_rate numeric(5, 2) not null default 20,
  amount_ttc numeric(12, 2) not null default 0,
  issued_date date not null default current_date,
  valid_until date,
  sent_at timestamptz,
  responded_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);

create table devis_lines (
  id uuid primary key default uuid_generate_v4(),
  devis_id uuid not null references devis(id) on delete cascade,
  position int not null default 0,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit text,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0
);

create index devis_org_id_idx on devis(org_id);
create index devis_client_id_idx on devis(client_id);
create index devis_chantier_id_idx on devis(chantier_id);
create index devis_lines_devis_id_idx on devis_lines(devis_id);

alter table devis enable row level security;
alter table devis_lines enable row level security;

create policy devis_all on devis
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy devis_lines_all on devis_lines
  for all using (
    exists (select 1 from devis d where d.id = devis_lines.devis_id and is_org_member(d.org_id))
  ) with check (
    exists (select 1 from devis d where d.id = devis_lines.devis_id and is_org_member(d.org_id))
  );
