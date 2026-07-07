// Maintenu à la main d'après supabase/migrations/*.sql (reflète le schéma réel).
// `supabase gen types` nécessite Docker/Podman (non disponible dans cet
// environnement) pour introspecter le schéma — si un jour Docker est
// disponible, on peut basculer sur :
//   npx supabase gen types typescript --db-url '<connection-string>' --schema public
// D'ici là, mettre à jour ce fichier à chaque nouvelle migration.

export type MemberRole = "owner" | "admin" | "member"
export type MemberStatus = "invited" | "active"
export type ChantierStatus = "a_venir" | "en_cours" | "termine" | "archive"
export type DevisStatus = "brouillon" | "envoye" | "accepte" | "refuse" | "expire"
export type SubscriptionStatus =
  | "incomplete"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete_expired"
  | "paused"
export type FactureStatus =
  | "brouillon"
  | "envoyee"
  | "payee_partielle"
  | "payee"
  | "en_retard"
  | "annulee"
export type PaiementMethod = "virement" | "cheque" | "especes" | "cb" | "autre"
export type RelanceTargetType = "devis" | "facture"
export type RelanceStatus = "planifiee" | "envoyee" | "echec" | "annulee"
export type RelanceTrigger = "devis_sans_reponse" | "facture_en_retard"

type OrganizationRow = {
  id: string
  name: string
  slug: string
  siret: string | null
  created_at: string
}

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  created_at: string
}

type OrganizationMemberRow = {
  id: string
  org_id: string
  user_id: string | null
  invited_email: string | null
  role: MemberRole
  status: MemberStatus
  invited_by: string | null
  created_at: string
}

type ClientRow = {
  id: string
  org_id: string
  name: string
  company_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  siret: string | null
  notes: string | null
  created_at: string
}

type ChantierRow = {
  id: string
  org_id: string
  client_id: string | null
  name: string
  address: string | null
  status: ChantierStatus
  start_date: string | null
  end_date_estimated: string | null
  end_date_actual: string | null
  budget_estimated: number | null
  description: string | null
  created_at: string
}

type ChantierUpdateRow = {
  id: string
  org_id: string
  chantier_id: string
  author_id: string | null
  progress_percent: number | null
  note: string | null
  photo_urls: string[]
  created_at: string
}

type DevisRow = {
  id: string
  org_id: string
  client_id: string
  chantier_id: string | null
  number: string
  status: DevisStatus
  amount_ht: number
  tva_rate: number
  amount_ttc: number
  issued_date: string
  valid_until: string | null
  sent_at: string | null
  responded_at: string | null
  notes: string | null
  created_at: string
}

type DevisLineRow = {
  id: string
  devis_id: string
  position: number
  description: string
  quantity: number
  unit: string | null
  unit_price: number
  total: number
}

type SubscriptionRow = {
  id: string
  org_id: string
  stripe_customer_id: string
  stripe_subscription_id: string | null
  status: SubscriptionStatus
  current_period_end: string | null
  created_at: string
  updated_at: string
}

type FactureRow = {
  id: string
  org_id: string
  client_id: string
  chantier_id: string | null
  devis_id: string | null
  number: string
  status: FactureStatus
  amount_ht: number
  tva_rate: number
  amount_ttc: number
  issued_date: string
  due_date: string | null
  sent_at: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
}

type FactureLineRow = {
  id: string
  facture_id: string
  position: number
  description: string
  quantity: number
  unit: string | null
  unit_price: number
  total: number
}

type PaiementRow = {
  id: string
  org_id: string
  facture_id: string
  amount: number
  method: PaiementMethod
  paid_at: string
  created_at: string
}

type RelanceRow = {
  id: string
  org_id: string
  target_type: RelanceTargetType
  target_id: string
  recipient_email: string
  status: RelanceStatus
  scheduled_for: string
  sent_at: string | null
  message_content: string | null
  error_message: string | null
  created_at: string
}

type RelanceRuleRow = {
  id: string
  org_id: string
  trigger: RelanceTrigger
  delay_days: number
  active: boolean
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: OrganizationRow
        Insert: Partial<OrganizationRow> & Pick<OrganizationRow, "name" | "slug">
        Update: Partial<OrganizationRow>
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & Pick<ProfileRow, "id">
        Update: Partial<ProfileRow>
        Relationships: []
      }
      organization_members: {
        Row: OrganizationMemberRow
        Insert: Partial<OrganizationMemberRow> & Pick<OrganizationMemberRow, "org_id">
        Update: Partial<OrganizationMemberRow>
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: ClientRow
        Insert: Partial<ClientRow> & Pick<ClientRow, "org_id" | "name">
        Update: Partial<ClientRow>
        Relationships: [
          {
            foreignKeyName: "clients_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      chantiers: {
        Row: ChantierRow
        Insert: Partial<ChantierRow> & Pick<ChantierRow, "org_id" | "name">
        Update: Partial<ChantierRow>
        Relationships: [
          {
            foreignKeyName: "chantiers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chantiers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      chantier_updates: {
        Row: ChantierUpdateRow
        Insert: Partial<ChantierUpdateRow> &
          Pick<ChantierUpdateRow, "org_id" | "chantier_id">
        Update: Partial<ChantierUpdateRow>
        Relationships: [
          {
            foreignKeyName: "chantier_updates_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantiers"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: DevisRow
        Insert: Partial<DevisRow> & Pick<DevisRow, "org_id" | "client_id" | "number">
        Update: Partial<DevisRow>
        Relationships: [
          {
            foreignKeyName: "devis_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantiers"
            referencedColumns: ["id"]
          },
        ]
      }
      devis_lines: {
        Row: DevisLineRow
        Insert: Partial<DevisLineRow> & Pick<DevisLineRow, "devis_id" | "description">
        Update: Partial<DevisLineRow>
        Relationships: [
          {
            foreignKeyName: "devis_lines_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: SubscriptionRow
        Insert: Partial<SubscriptionRow> & Pick<SubscriptionRow, "org_id" | "stripe_customer_id">
        Update: Partial<SubscriptionRow>
        Relationships: [
          {
            foreignKeyName: "subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: FactureRow
        Insert: Partial<FactureRow> & Pick<FactureRow, "org_id" | "client_id" | "number">
        Update: Partial<FactureRow>
        Relationships: [
          {
            foreignKeyName: "factures_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_chantier_id_fkey"
            columns: ["chantier_id"]
            isOneToOne: false
            referencedRelation: "chantiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      facture_lines: {
        Row: FactureLineRow
        Insert: Partial<FactureLineRow> & Pick<FactureLineRow, "facture_id" | "description">
        Update: Partial<FactureLineRow>
        Relationships: [
          {
            foreignKeyName: "facture_lines_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      paiements: {
        Row: PaiementRow
        Insert: Partial<PaiementRow> & Pick<PaiementRow, "org_id" | "facture_id" | "amount">
        Update: Partial<PaiementRow>
        Relationships: [
          {
            foreignKeyName: "paiements_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
        ]
      }
      relances: {
        Row: RelanceRow
        Insert: Partial<RelanceRow> &
          Pick<RelanceRow, "org_id" | "target_type" | "target_id" | "recipient_email">
        Update: Partial<RelanceRow>
        Relationships: [
          {
            foreignKeyName: "relances_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      relance_rules: {
        Row: RelanceRuleRow
        Insert: Partial<RelanceRuleRow> & Pick<RelanceRuleRow, "org_id" | "trigger" | "delay_days">
        Update: Partial<RelanceRuleRow>
        Relationships: [
          {
            foreignKeyName: "relance_rules_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      create_organization: {
        Args: { org_name: string; org_slug: string }
        Returns: string
      }
      is_org_member: {
        Args: { target_org: string }
        Returns: boolean
      }
      is_org_admin: {
        Args: { target_org: string }
        Returns: boolean
      }
      upsert_subscription_customer: {
        Args: { p_org_id: string; p_stripe_customer_id: string }
        Returns: undefined
      }
      sync_subscription_status: {
        Args: {
          p_stripe_customer_id: string
          p_stripe_subscription_id: string | null
          p_status: SubscriptionStatus
          p_current_period_end: string | null
          p_shared_secret: string
        }
        Returns: undefined
      }
      get_devis_relances_dues: {
        Args: { p_shared_secret: string; p_org_id?: string | null }
        Returns: {
          devis_id: string
          org_id: string
          client_email: string | null
          client_name: string
          number: string
          amount_ttc: number
          sent_at: string | null
        }[]
      }
      get_factures_relances_dues: {
        Args: { p_shared_secret: string; p_org_id?: string | null }
        Returns: {
          facture_id: string
          org_id: string
          client_email: string | null
          client_name: string
          number: string
          amount_ttc: number
          due_date: string | null
        }[]
      }
      record_relance: {
        Args: {
          p_shared_secret: string
          p_org_id: string
          p_target_type: RelanceTargetType
          p_target_id: string
          p_recipient_email: string
          p_status: RelanceStatus
          p_message_content: string | null
          p_error_message?: string | null
        }
        Returns: string
      }
    }
    Enums: {
      member_role: MemberRole
      member_status: MemberStatus
      chantier_status: ChantierStatus
      devis_status: DevisStatus
      subscription_status: SubscriptionStatus
      facture_status: FactureStatus
      paiement_method: PaiementMethod
      relance_target_type: RelanceTargetType
      relance_status: RelanceStatus
      relance_trigger: RelanceTrigger
    }
  }
}
