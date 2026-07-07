-- Phase 3 : factures, lignes de facture, paiements
create type facture_status as enum (
  'brouillon', 'envoyee', 'payee_partielle', 'payee', 'en_retard', 'annulee'
);
create type paiement_method as enum ('virement', 'cheque', 'especes', 'cb', 'autre');

create table factures (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null references clients(id) on delete restrict,
  chantier_id uuid references chantiers(id) on delete set null,
  devis_id uuid references devis(id) on delete set null,
  number text not null,
  status facture_status not null default 'brouillon',
  amount_ht numeric(12, 2) not null default 0,
  tva_rate numeric(5, 2) not null default 20,
  amount_ttc numeric(12, 2) not null default 0,
  issued_date date not null default current_date,
  due_date date,
  sent_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);

create table facture_lines (
  id uuid primary key default uuid_generate_v4(),
  facture_id uuid not null references factures(id) on delete cascade,
  position int not null default 0,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit text,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0
);

create table paiements (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  facture_id uuid not null references factures(id) on delete cascade,
  amount numeric(12, 2) not null,
  method paiement_method not null default 'virement',
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index factures_org_id_idx on factures(org_id);
create index factures_client_id_idx on factures(client_id);
create index factures_chantier_id_idx on factures(chantier_id);
create index factures_devis_id_idx on factures(devis_id);
create index facture_lines_facture_id_idx on facture_lines(facture_id);
create index paiements_facture_id_idx on paiements(facture_id);
create index paiements_org_id_idx on paiements(org_id);

alter table factures enable row level security;
alter table facture_lines enable row level security;
alter table paiements enable row level security;

create policy factures_all on factures
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy facture_lines_all on facture_lines
  for all using (
    exists (select 1 from factures f where f.id = facture_lines.facture_id and is_org_member(f.org_id))
  ) with check (
    exists (select 1 from factures f where f.id = facture_lines.facture_id and is_org_member(f.org_id))
  );

create policy paiements_all on paiements
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));
