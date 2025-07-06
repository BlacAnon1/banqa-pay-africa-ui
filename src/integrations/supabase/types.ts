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
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bill_forecasts: {
        Row: {
          confidence_score: number
          created_at: string
          due_date: string
          factors: Json | null
          id: string
          predicted_amount: number
          provider_name: string
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number
          created_at?: string
          due_date: string
          factors?: Json | null
          id?: string
          predicted_amount: number
          provider_name: string
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          due_date?: string
          factors?: Json | null
          id?: string
          predicted_amount?: number
          provider_name?: string
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bill_share_participants: {
        Row: {
          assigned_amount: number
          banqa_id: string | null
          bill_share_id: string | null
          created_at: string
          email: string | null
          id: string
          paid_at: string | null
          payment_status: string | null
          phone_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_amount: number
          banqa_id?: string | null
          bill_share_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          paid_at?: string | null
          payment_status?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_amount?: number
          banqa_id?: string | null
          bill_share_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          paid_at?: string | null
          payment_status?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_share_participants_bill_share_id_fkey"
            columns: ["bill_share_id"]
            isOneToOne: false
            referencedRelation: "bill_shares"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_shares: {
        Row: {
          bill_description: string
          created_at: string
          creator_id: string
          due_date: string | null
          id: string
          status: string | null
          total_amount: number
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          bill_description: string
          created_at?: string
          creator_id: string
          due_date?: string | null
          id?: string
          status?: string | null
          total_amount: number
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          bill_description?: string
          created_at?: string
          creator_id?: string
          due_date?: string | null
          id?: string
          status?: string | null
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_shares_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      credit_scores: {
        Row: {
          created_at: string | null
          expires_at: string | null
          factors: Json | null
          grade: string
          id: string
          last_updated: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          factors?: Json | null
          grade: string
          id?: string
          last_updated?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          factors?: Json | null
          grade?: string
          id?: string
          last_updated?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
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
      currencies: {
        Row: {
          code: string
          country: string
          created_at: string
          exchange_rate_to_base: number
          id: string
          is_active: boolean
          name: string
          symbol: string
          updated_at: string
        }
        Insert: {
          code: string
          country: string
          created_at?: string
          exchange_rate_to_base?: number
          id?: string
          is_active?: boolean
          name: string
          symbol: string
          updated_at?: string
        }
        Update: {
          code?: string
          country?: string
          created_at?: string
          exchange_rate_to_base?: number
          id?: string
          is_active?: boolean
          name?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
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
      loan_applications: {
        Row: {
          amount: number
          application_data: Json | null
          approval_date: string | null
          created_at: string | null
          disbursement_date: string | null
          employment_status: string
          id: string
          interest_rate: number
          monthly_income: number
          monthly_payment: number
          provider_id: string | null
          provider_reference: string | null
          purpose: string
          rejection_reason: string | null
          status: string | null
          tenure_months: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          application_data?: Json | null
          approval_date?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          employment_status: string
          id?: string
          interest_rate: number
          monthly_income: number
          monthly_payment: number
          provider_id?: string | null
          provider_reference?: string | null
          purpose: string
          rejection_reason?: string | null
          status?: string | null
          tenure_months: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          application_data?: Json | null
          approval_date?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          employment_status?: string
          id?: string
          interest_rate?: number
          monthly_income?: number
          monthly_payment?: number
          provider_id?: string | null
          provider_reference?: string | null
          purpose?: string
          rejection_reason?: string | null
          status?: string | null
          tenure_months?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "loan_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          loan_id: string | null
          payment_date: string | null
          payment_method: string | null
          reference_number: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          loan_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reference_number: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          loan_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reference_number?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_payments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_providers: {
        Row: {
          api_endpoint: string | null
          api_key_required: boolean | null
          countries_supported: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          kyc_requirements: Json | null
          max_interest_rate: number | null
          max_loan_amount: number | null
          max_tenure_months: number | null
          min_interest_rate: number | null
          min_loan_amount: number | null
          min_tenure_months: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key_required?: boolean | null
          countries_supported?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kyc_requirements?: Json | null
          max_interest_rate?: number | null
          max_loan_amount?: number | null
          max_tenure_months?: number | null
          min_interest_rate?: number | null
          min_loan_amount?: number | null
          min_tenure_months?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key_required?: boolean | null
          countries_supported?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kyc_requirements?: Json | null
          max_interest_rate?: number | null
          max_loan_amount?: number | null
          max_tenure_months?: number | null
          min_interest_rate?: number | null
          min_loan_amount?: number | null
          min_tenure_months?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loans: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          interest_rate: number
          loan_end_date: string
          loan_start_date: string
          monthly_payment: number
          next_payment_date: string
          outstanding_balance: number
          payments_made: number | null
          principal_amount: number
          provider_id: string | null
          provider_loan_id: string | null
          status: string | null
          tenure_months: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          interest_rate: number
          loan_end_date: string
          loan_start_date: string
          monthly_payment: number
          next_payment_date: string
          outstanding_balance: number
          payments_made?: number | null
          principal_amount: number
          provider_id?: string | null
          provider_loan_id?: string | null
          status?: string | null
          tenure_months: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          interest_rate?: number
          loan_end_date?: string
          loan_start_date?: string
          monthly_payment?: number
          next_payment_date?: string
          outstanding_balance?: number
          payments_made?: number | null
          principal_amount?: number
          provider_id?: string | null
          provider_loan_id?: string | null
          status?: string | null
          tenure_months?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "loan_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      money_transfers: {
        Row: {
          amount_received: number
          amount_sent: number
          created_at: string
          description: string | null
          exchange_rate: number
          id: string
          processed_at: string | null
          recipient_currency: string
          recipient_id: string
          reference_number: string
          sender_currency: string
          sender_id: string
          status: string
          transfer_fee: number
          updated_at: string
        }
        Insert: {
          amount_received: number
          amount_sent: number
          created_at?: string
          description?: string | null
          exchange_rate?: number
          id?: string
          processed_at?: string | null
          recipient_currency?: string
          recipient_id: string
          reference_number: string
          sender_currency?: string
          sender_id: string
          status?: string
          transfer_fee?: number
          updated_at?: string
        }
        Update: {
          amount_received?: number
          amount_sent?: number
          created_at?: string
          description?: string | null
          exchange_rate?: number
          id?: string
          processed_at?: string | null
          recipient_currency?: string
          recipient_id?: string
          reference_number?: string
          sender_currency?: string
          sender_id?: string
          status?: string
          transfer_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      multi_country_wallets: {
        Row: {
          balance: number
          country_code: string
          country_name: string
          created_at: string
          currency_code: string
          currency_symbol: string
          exchange_rate: number
          id: string
          is_active: boolean | null
          is_default: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          country_code: string
          country_name: string
          created_at?: string
          currency_code: string
          currency_symbol: string
          exchange_rate?: number
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          country_code?: string
          country_name?: string
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          exchange_rate?: number
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          banqa_id: string
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
          banqa_id: string
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
          banqa_id?: string
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
      reward_items: {
        Row: {
          category: string
          cost_points: number
          country_restrictions: Json | null
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          value_amount: number | null
        }
        Insert: {
          category: string
          cost_points: number
          country_restrictions?: Json | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          value_amount?: number | null
        }
        Update: {
          category?: string
          cost_points?: number
          country_restrictions?: Json | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          value_amount?: number | null
        }
        Relationships: []
      }
      reward_transactions: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          reference_transaction_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          reference_transaction_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          reference_transaction_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
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
      user_insights: {
        Row: {
          amount_spent: number
          created_at: string
          id: string
          month_year: string
          service_type: string
          updated_at: string
          usage_type: string | null
          usage_units: number | null
          user_id: string
        }
        Insert: {
          amount_spent?: number
          created_at?: string
          id?: string
          month_year: string
          service_type: string
          updated_at?: string
          usage_type?: string | null
          usage_units?: number | null
          user_id: string
        }
        Update: {
          amount_spent?: number
          created_at?: string
          id?: string
          month_year?: string
          service_type?: string
          updated_at?: string
          usage_type?: string | null
          usage_units?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_quick_pay_preferences: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          service_color: string
          service_icon: string
          service_name: string
          service_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          service_color: string
          service_icon: string
          service_name: string
          service_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          service_color?: string
          service_icon?: string
          service_name?: string
          service_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          current_tier: string
          id: string
          lifetime_points: number
          redeemed_points: number
          tier_progress: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_tier?: string
          id?: string
          lifetime_points?: number
          redeemed_points?: number
          tier_progress?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_tier?: string
          id?: string
          lifetime_points?: number
          redeemed_points?: number
          tier_progress?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      virtual_cards: {
        Row: {
          auto_topup_amount: number | null
          auto_topup_enabled: boolean | null
          auto_topup_threshold: number | null
          balance: number
          card_name: string
          card_number_encrypted: string
          created_at: string
          cvv_encrypted: string
          daily_limit: number
          expiry_month: number
          expiry_year: number
          id: string
          is_active: boolean | null
          masked_card_number: string
          monthly_limit: number
          spending_limit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_threshold?: number | null
          balance?: number
          card_name: string
          card_number_encrypted: string
          created_at?: string
          cvv_encrypted: string
          daily_limit?: number
          expiry_month: number
          expiry_year: number
          id?: string
          is_active?: boolean | null
          masked_card_number: string
          monthly_limit?: number
          spending_limit?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_topup_amount?: number | null
          auto_topup_enabled?: boolean | null
          auto_topup_threshold?: number | null
          balance?: number
          card_name?: string
          card_number_encrypted?: string
          created_at?: string
          cvv_encrypted?: string
          daily_limit?: number
          expiry_month?: number
          expiry_year?: number
          id?: string
          is_active?: boolean | null
          masked_card_number?: string
          monthly_limit?: number
          spending_limit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      withdrawal_otps: {
        Row: {
          bank_account_id: string
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          otp_code: string
          user_id: string
          withdrawal_amount: number
        }
        Insert: {
          bank_account_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          otp_code: string
          user_id: string
          withdrawal_amount: number
        }
        Update: {
          bank_account_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          otp_code?: string
          user_id?: string
          withdrawal_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_otps_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_pins: {
        Row: {
          created_at: string | null
          id: string
          pin_hash: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pin_hash: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pin_hash?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          bank_account_id: string
          created_at: string | null
          id: string
          otp_verified: boolean | null
          pin_verified: boolean | null
          processed_at: string | null
          reference_number: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id: string
          created_at?: string | null
          id?: string
          otp_verified?: boolean | null
          pin_verified?: boolean | null
          processed_at?: string | null
          reference_number: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string
          created_at?: string | null
          id?: string
          otp_verified?: boolean | null
          pin_verified?: boolean | null
          processed_at?: string | null
          reference_number?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_credit_score: {
        Args: { user_id_param: string }
        Returns: {
          score: number
          grade: string
        }[]
      }
      calculate_reward_points: {
        Args: { amount: number; transaction_type: string }
        Returns: number
      }
      generate_banqa_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_currency_exchange_rate: {
        Args: { currency_code: string; new_rate: number }
        Returns: boolean
      }
      update_user_tier: {
        Args: { user_id_param: string }
        Returns: string
      }
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
