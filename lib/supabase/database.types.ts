export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: 'buyer' | 'seller';
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'buyer' | 'seller';
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id'>>;
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['categories']['Row'], 'id'>>;
      };
      products: {
        Row: {
          id: number;
          seller_id: string;
          category_id: number | null;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          stock: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          seller_id: string;
          category_id?: number | null;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          stock: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['products']['Row'], 'id' | 'seller_id'>>;
      };
      product_images: {
        Row: {
          id: number;
          product_id: number;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['product_images']['Row'], 'id'>>;
      };
      carts: {
        Row: {
          id: number;
          user_id: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['carts']['Row'], 'id' | 'user_id'>>;
      };
      cart_items: {
        Row: {
          id: number;
          cart_id: number;
          product_id: number;
          qty: number;
          price_snapshot: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          cart_id: number;
          product_id: number;
          qty: number;
          price_snapshot: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['cart_items']['Row'], 'id'>>;
      };
      addresses: {
        Row: {
          id: number;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string;
          address_line: string;
          province: string;
          city: string;
          district: string;
          postal_code: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string;
          address_line: string;
          province: string;
          city: string;
          district: string;
          postal_code: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'user_id'>>;
      };
      orders: {
        Row: {
          id: string;
          code: string;
          buyer_id: string;
          seller_id: string;
          total_amount: number;
          shipping_cost: number;
          status:
            | 'pending'
            | 'awaiting_payment'
            | 'paid'
            | 'processing'
            | 'shipped'
            | 'completed'
            | 'cancelled';
          payment_driver: string;
          payment_ref: string | null;
          payment_meta: Json | null;
          created_at: string;
        };
        Insert: {
          id: string;
          code: string;
          buyer_id: string;
          seller_id: string;
          total_amount: number;
          shipping_cost?: number;
          status?: Database['public']['Tables']['orders']['Row']['status'];
          payment_driver: string;
          payment_ref?: string | null;
          payment_meta?: Json | null;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'code'>>;
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: number;
          product_name_snapshot: string;
          price: number;
          qty: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: string;
          product_id: number;
          product_name_snapshot: string;
          price: number;
          qty: number;
          subtotal: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database['public']['Tables']['order_items']['Row'], 'id'>>;
      };
    };
    Enums: {
      order_status: 'pending' | 'awaiting_payment' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled';
      user_role: 'buyer' | 'seller';
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
