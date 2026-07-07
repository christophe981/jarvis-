-- Phase 4 : relances automatiques (devis sans reponse, factures en retard)
create type relance_target_type as enum ('devis', 'facture');
create type relance_status as enum ('planifiee', 'envoyee', 'echec', 'annulee');
create type relance_trigger as enum ('devis_sans_reponse', 'facture_en_retard');

create table relances (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  target_type relance_target_type not null,
  target_id uuid not null,
  recipient_email text not null,
  status relance_status not null default 'planifiee',
  scheduled_for timestamptz not null default now(),
  sent_at timestamptz,
  message_content text,
  error_message text,
  created_at timestamptz not null default now()
);

create table relance_rules (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  trigger relance_trigger not null,
  delay_days int not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (org_id, trigger)
);

create index relances_org_id_idx on relances(org_id);
create index relances_target_idx on relances(target_type, target_id);
create index relance_rules_org_id_idx on relance_rules(org_id);

alter table relances enable row level security;
alter table relance_rules enable row level security;

create policy relances_all on relances
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

create policy relance_rules_all on relance_rules
  for all using (is_org_member(org_id)) with check (is_org_member(org_id));

-- Secret partage : reutilise la meme valeur que SUPABASE_RPC_SHARED_SECRET
-- (deja utilisee pour le webhook Stripe, voir 20260707000001_subscriptions.sql).
-- La ligne app_secrets('relances_shared_secret', ...) est seedee separement
-- par le script d'application des migrations (jamais ecrite en clair dans un
-- fichier de migration versionne).

create function public.get_devis_relances_dues(p_shared_secret text, p_org_id uuid default null)
returns table (
  devis_id uuid,
  org_id uuid,
  client_email text,
  client_name text,
  number text,
  amount_ttc numeric,
  sent_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_shared_secret is distinct from (
    select value from app_secrets where key = 'relances_shared_secret'
  ) then
    raise exception 'unauthorized';
  end if;

  return query
  select d.id, d.org_id, c.email, c.name, d.number, d.amount_ttc, d.sent_at
  from devis d
  join clients c on c.id = d.client_id
  left join relance_rules rr on rr.org_id = d.org_id and rr.trigger = 'devis_sans_reponse'
  where d.status = 'envoye'
    and c.email is not null
    and (p_org_id is null or d.org_id = p_org_id)
    and coalesce(rr.active, true)
    and d.sent_at <= now() - (coalesce(rr.delay_days, 7) || ' days')::interval
    and not exists (
      select 1 from relances r
      where r.target_type = 'devis' and r.target_id = d.id and r.status = 'envoyee'
    );
end;
$$;

create function public.get_factures_relances_dues(p_shared_secret text, p_org_id uuid default null)
returns table (
  facture_id uuid,
  org_id uuid,
  client_email text,
  client_name text,
  number text,
  amount_ttc numeric,
  due_date date
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_shared_secret is distinct from (
    select value from app_secrets where key = 'relances_shared_secret'
  ) then
    raise exception 'unauthorized';
  end if;

  return query
  select f.id, f.org_id, c.email, c.name, f.number, f.amount_ttc, f.due_date
  from factures f
  join clients c on c.id = f.client_id
  left join relance_rules rr on rr.org_id = f.org_id and rr.trigger = 'facture_en_retard'
  where f.status in ('envoyee', 'en_retard')
    and c.email is not null
    and (p_org_id is null or f.org_id = p_org_id)
    and coalesce(rr.active, true)
    and f.due_date < current_date
    and coalesce((select sum(p.amount) from paiements p where p.facture_id = f.id), 0) < f.amount_ttc
    and not exists (
      select 1 from relances r
      where r.target_type = 'facture' and r.target_id = f.id and r.status = 'envoyee'
        and r.sent_at > now() - (coalesce(rr.delay_days, 5) || ' days')::interval
    );
end;
$$;

create function public.record_relance(
  p_shared_secret text,
  p_org_id uuid,
  p_target_type relance_target_type,
  p_target_id uuid,
  p_recipient_email text,
  p_status relance_status,
  p_message_content text,
  p_error_message text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if p_shared_secret is distinct from (
    select value from app_secrets where key = 'relances_shared_secret'
  ) then
    raise exception 'unauthorized';
  end if;

  insert into relances (org_id, target_type, target_id, recipient_email, status, sent_at, message_content, error_message)
  values (p_org_id, p_target_type, p_target_id, p_recipient_email, p_status,
          case when p_status = 'envoyee' then now() else null end,
          p_message_content, p_error_message)
  returning id into new_id;

  if p_target_type = 'facture' and p_status = 'envoyee' then
    update factures set status = 'en_retard' where id = p_target_id and status = 'envoyee';
  end if;

  return new_id;
end;
$$;
