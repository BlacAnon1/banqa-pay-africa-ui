export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: {
          card_number: string
          card_status: Database["public"]["Enums"]["card_status"] | null
          card_type: Database["public"]["Enums"]["card_type"]
          created_at: string | null
          cvv_encrypted: string | null
          daily_limit: number | null
          expiry_month: number
          expiry_year: number
          id: string
          is_contactless: boolean | null
          is_international: boolean | null
          last_used_at: string | null
          masked_pan: string
          monthly_limit: number | null
          pin_set: boolean | null
          spending_limit: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          card_number: string
          card_status?: Database["public"]["Enums"]["card_status"] | null
          card_type: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv_encrypted?: string | null
          daily_limit?: number | null
          expiry_month: number
          expiry_year: number
          id?: string
          is_contactless?: boolean | null
          is_international?: boolean | null
          last_used_at?: string | null
          masked_pan: string
          monthly_limit?: number | null
          pin_set?: boolean | null
          spending_limit?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          card_number?: string
          card_status?: Database["public"]["Enums"]["card_status"] | null
          card_type?: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv_encrypted?: string | null
          daily_limit?: number | null
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_contactless?: boolean | null
          is_international?: boolean | null
          last_used_at?: string | null
          masked_pan?: string
          monthly_limit?: number | null
          pin_set?: boolean | null
          spending_limit?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          private_key_encrypted: string
          public_key: string
          updated_at: string | null
          user_id: string
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          private_key_encrypted: string
          public_key: string
          updated_at?: string | null
          user_id: string
          wallet_address: string
          wallet_type: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          private_key_encrypted?: string
          public_key?: string
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crypto_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_number: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          expiry_date: string | null
          id: string
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["kyc_status"] | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_number?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          expiry_date?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          document_url?: string
          expiry_date?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["kyc_status"] | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_verification: {
        Row: {
          address_verified: boolean | null
          created_at: string | null
          id: string
          identity_verified: boolean | null
          income_verified: boolean | null
          last_review_date: string | null
          next_review_date: string | null
          overall_status: Database["public"]["Enums"]["kyc_status"] | null
          reviewer_notes: string | null
          risk_assessment_score: number | null
          updated_at: string | null
          user_id: string
          verification_tier: number | null
        }
        Insert: {
          address_verified?: boolean | null
          created_at?: string | null
          id?: string
          identity_verified?: boolean | null
          income_verified?: boolean | null
          last_review_date?: string | null
          next_review_date?: string | null
          overall_status?: Database["public"]["Enums"]["kyc_status"] | null
          reviewer_notes?: string | null
          risk_assessment_score?: number | null
          updated_at?: string | null
          user_id: string
          verification_tier?: number | null
        }
        Update: {
          address_verified?: boolean | null
          created_at?: string | null
          id?: string
          identity_verified?: boolean | null
          income_verified?: boolean | null
          last_review_date?: string | null
          next_review_date?: string | null
          overall_status?: Database["public"]["Enums"]["kyc_status"] | null
          reviewer_notes?: string | null
          risk_assessment_score?: number | null
          updated_at?: string | null
          user_id?: string
          verification_tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean
          last4: string | null
          metadata: Json | null
          provider_name: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean
          last4?: string | null
          metadata?: Json | null
          provider_name: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean
          last4?: string | null
          metadata?: Json | null
          provider_name?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          avatar_url: string | null
          city: string | null
          country_of_residence: string
          created_at: string | null
          date_of_birth: string | null
          email: string
          employer: string | null
          full_name: string
          gender: string | null
          id: string
          marketing_consent: boolean | null
          monthly_income: number | null
          nationality: string | null
          occupation: string | null
          phone_number: string | null
          postal_code: string | null
          privacy_policy_accepted: boolean | null
          profile_completed: boolean | null
          source_of_funds: string | null
          state_province: string | null
          terms_accepted: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_role: string | null
          user_status: Database["public"]["Enums"]["user_status"] | null
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          city?: string | null
          country_of_residence: string
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          employer?: string | null
          full_name: string
          gender?: string | null
          id: string
          marketing_consent?: boolean | null
          monthly_income?: number | null
          nationality?: string | null
          occupation?: string | null
          phone_number?: string | null
          postal_code?: string | null
          privacy_policy_accepted?: boolean | null
          profile_completed?: boolean | null
          source_of_funds?: string | null
          state_province?: string | null
          terms_accepted?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_role?: string | null
          user_status?: Database["public"]["Enums"]["user_status"] | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          avatar_url?: string | null
          city?: string | null
          country_of_residence?: string
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          employer?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          marketing_consent?: boolean | null
          monthly_income?: number | null
          nationality?: string | null
          occupation?: string | null
          phone_number?: string | null
          postal_code?: string | null
          privacy_policy_accepted?: boolean | null
          profile_completed?: boolean | null
          source_of_funds?: string | null
          state_province?: string | null
          terms_accepted?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_role?: string | null
          user_status?: Database["public"]["Enums"]["user_status"] | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Relationships: []
      }
      receipts: {
        Row: {
          file_url: string
          id: string
          transaction_id: string
          uploaded_at: string | null
        }
        Insert: {
          file_url: string
          id?: string
          transaction_id: string
          uploaded_at?: string | null
        }
        Update: {
          file_url?: string
          id?: string
          transaction_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          api_endpoint: string | null
          country: string
          created_at: string | null
          id: string
          input_fields: Json
          is_active: boolean
          provider_name: string
          service_type: string
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          country: string
          created_at?: string | null
          id?: string
          input_fields?: Json
          is_active?: boolean
          provider_name: string
          service_type: string
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          country?: string
          created_at?: string | null
          id?: string
          input_fields?: Json
          is_active?: boolean
          provider_name?: string
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          message: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          external_reference: string | null
          id: string
          metadata: Json | null
          provider_name: string | null
          reference_number: string
          service_type: string | null
          status: string
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          description?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          provider_name?: string | null
          reference_number: string
          service_type?: string | null
          status?: string
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          external_reference?: string | null
          id?: string
          metadata?: Json | null
          provider_name?: string | null
          reference_number?: string
          service_type?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"]
          balance: number | null
          bank_code: string
          bank_name: string
          created_at: string | null
          currency: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"]
          balance?: number | null
          bank_code: string
          bank_name: string
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: Database["public"]["Enums"]["account_type"]
          balance?: number | null
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          currency: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "savings" | "current" | "crypto_wallet"
      card_status: "pending" | "active" | "blocked" | "expired" | "cancelled"
      card_type:
        | "virtual_debit"
        | "physical_debit"
        | "virtual_credit"
        | "physical_credit"
      document_type:
        | "national_id"
        | "passport"
        | "drivers_license"
        | "utility_bill"
        | "bank_statement"
        | "selfie"
      kyc_status:
        | "not_started"
        | "in_progress"
        | "under_review"
        | "approved"
        | "rejected"
        | "expired"
      notification_type: "transaction" | "payment" | "system" | "promotional"
      payment_method_type: "card" | "mobile_money" | "bank_transfer"
      service_type:
        | "electricity"
        | "water"
        | "internet"
        | "cable_tv"
        | "mobile_airtime"
        | "mobile_data"
        | "insurance"
        | "school_fees"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      user_status: "pending" | "active" | "suspended" | "deactivated"
      verification_level: "unverified" | "basic" | "enhanced" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["savings", "current", "crypto_wallet"],
      card_status: ["pending", "active", "blocked", "expired", "cancelled"],
      card_type: [
        "virtual_debit",
        "physical_debit",
        "virtual_credit",
        "physical_credit",
      ],
      document_type: [
        "national_id",
        "passport",
        "drivers_license",
        "utility_bill",
        "bank_statement",
        "selfie",
      ],
      kyc_status: [
        "not_started",
        "in_progress",
        "under_review",
        "approved",
        "rejected",
        "expired",
      ],
      notification_type: ["transaction", "payment", "system", "promotional"],
      payment_method_type: ["card", "mobile_money", "bank_transfer"],
      service_type: [
        "electricity",
        "water",
        "internet",
        "cable_tv",
        "mobile_airtime",
        "mobile_data",
        "insurance",
        "school_fees",
      ],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      user_status: ["pending", "active", "suspended", "deactivated"],
      verification_level: ["unverified", "basic", "enhanced", "premium"],
    },
  },
} as const
