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
    }
    Enums: {
      member_role: MemberRole
      member_status: MemberStatus
      chantier_status: ChantierStatus
      devis_status: DevisStatus
      subscription_status: SubscriptionStatus
    }
  }
}
