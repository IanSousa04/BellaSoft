export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          name: string
          role: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id: string
          name: string
          role: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          role?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          tenant_id: string
          name: string
          email: string | null
          phone: string | null
          last_visit: string | null
          total_visits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email?: string | null
          phone?: string | null
          last_visit?: string | null
          total_visits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          last_visit?: string | null
          total_visits?: number
          created_at?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          tenant_id: string
          name: string
          email: string | null
          phone: string | null
          specialization: string | null
          status: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          email?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          specialization?: string | null
          status?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          duration: number
          price: number
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          duration: number
          price: number
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          stock: number
          category: string | null
          brand: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          stock?: number
          category?: string | null
          brand?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          category?: string | null
          brand?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          tenant_id: string
          name: string
          state: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          state: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          state?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      professional_cities: {
        Row: {
          id: string
          tenant_id: string
          professional_id: string
          city_id: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          professional_id: string
          city_id: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          professional_id?: string
          city_id?: string
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          tenant_id: string
          client_id: string
          professional_id: string
          service_id: string
          city_id: string
          date: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          client_id: string
          professional_id: string
          service_id: string
          city_id: string
          date: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          client_id?: string
          professional_id?: string
          service_id?: string
          city_id?: string
          date?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}