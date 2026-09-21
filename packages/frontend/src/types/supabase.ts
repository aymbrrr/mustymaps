/**
 * Database types.
 *
 * Hand-written to match supabase/migrations. Once the schema is pushed you can
 * regenerate this instead of editing by hand:
 *
 *   supabase gen types typescript --project-id <ref> > src/types/supabase.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Category = 'dining' | 'study' | 'recreation' | 'other';
export type OpenSeats = 'none' | 'few' | 'many';

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: Category;
          lat: number;
          lng: number;
          building: string | null;
          hours: Json;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category: Category;
          lat: number;
          lng: number;
          building?: string | null;
          hours?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: Category;
          lat?: number;
          lng?: number;
          building?: string | null;
          hours?: Json;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          location_id: string;
          user_id: string;
          busyness: number;
          wait_minutes: number | null;
          open_seats: OpenSeats | null;
          free_food: boolean;
          note: string | null;
          is_flagged: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          user_id: string;
          busyness: number;
          wait_minutes?: number | null;
          open_seats?: OpenSeats | null;
          free_food?: boolean;
          note?: string | null;
          is_flagged?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          user_id?: string;
          busyness?: number;
          wait_minutes?: number | null;
          open_seats?: OpenSeats | null;
          free_food?: boolean;
          note?: string | null;
          is_flagged?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_location_id_fkey';
            columns: ['location_id'];
            referencedRelation: 'locations';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      location_live_status: {
        Row: {
          location_id: string | null;
          slug: string | null;
          name: string | null;
          category: Category | null;
          lat: number | null;
          lng: number | null;
          building: string | null;
          hours: Json | null;
          busyness: number | null;
          wait_minutes: number | null;
          open_seats: OpenSeats | null;
          free_food: boolean | null;
          report_count: number | null;
          last_report_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
