-- Phase 7 (avancee) : abonnement Stripe par organisation
create type subscription_status as enum (
  'incomplete', 'trialing', 'active', 'past_due', 'canceled', 'unpaid'
);

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status subscription_status not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id),
  unique (stripe_customer_id)
);

create index subscriptions_org_id_idx on subscriptions(org_id);
create index subscriptions_stripe_subscription_id_idx on subscriptions(stripe_subscription_id);

alter table subscriptions enable row level security;

-- Lecture seule pour les membres de l'org (le statut d'abonnement s'affiche
-- dans l'UI). Aucune policy insert/update/delete : toute ecriture passe par
-- les deux RPC SECURITY DEFINER ci-dessous, appelees avec la cle anon (pas de
-- cle service_role disponible dans ce projet) — meme pattern que
-- create_organization pour la creation d'organisation.
create policy subscriptions_select on subscriptions
  for select using (is_org_member(org_id));

-- Table interne pour un secret partage (voir sync_subscription_status).
-- Pas de "alter database set" possible sur ce projet Supabase manage (le role
-- postgres n'a pas le privilege pour des GUC personnalisees) : on stocke donc
-- le secret dans une table normale. RLS active sans aucune policy = illisible
-- via PostgREST (anon/authenticated), seule une fonction SECURITY DEFINER
-- peut la lire.
create table app_secrets (
  key text primary key,
  value text not null
);
alter table app_secrets enable row level security;

-- Appelee par l'action serveur qui initie le Checkout Stripe (contexte
-- utilisateur authentifie, mais on passe par une RPC pour ne pas avoir a
-- ouvrir de policy insert/update publique sur la table).
create function public.upsert_subscription_customer(p_org_id uuid, p_stripe_customer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_org_member(p_org_id) then
    raise exception 'not a member of this organization';
  end if;

  insert into subscriptions (org_id, stripe_customer_id)
  values (p_org_id, p_stripe_customer_id)
  on conflict (org_id) do update set stripe_customer_id = excluded.stripe_customer_id;
end;
$$;

-- Appelee uniquement par le webhook Stripe. Aucune session utilisateur dans ce
-- contexte (Stripe appelle notre serveur directement) : sans cle
-- service_role disponible dans ce projet, cette fonction SECURITY DEFINER
-- serait sinon appelable par n'importe qui via la cle anon publique et
-- permettrait de forger un statut d'abonnement "active" gratuitement.
-- Protection : un secret partage (stocke dans app_secrets, connu aussi de
-- l'app via SUPABASE_RPC_SHARED_SECRET) doit correspondre, sinon rejet.
create function public.sync_subscription_status(
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_status subscription_status,
  p_current_period_end timestamptz,
  p_shared_secret text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_shared_secret is distinct from (
    select value from app_secrets where key = 'stripe_webhook_shared_secret'
  ) then
    raise exception 'unauthorized';
  end if;

  update subscriptions
  set stripe_subscription_id = p_stripe_subscription_id,
      status = p_status,
      current_period_end = p_current_period_end,
      updated_at = now()
  where stripe_customer_id = p_stripe_customer_id;
end;
$$;
