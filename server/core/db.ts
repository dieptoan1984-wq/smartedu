/**
 * Server-Side Database & Supabase Service Role Client
 * QUY TẮC AN NINH:
 * - Module này CHỈ chạy trên Server (Node.js/Vercel)
 * - Tuyệt đối không import module này vào bundle React client
 * - SUPABASE_SERVICE_ROLE_KEY không bao giờ được gửi về trình duyệt
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let serverSupabase: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (serverSupabase) return serverSupabase;

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    serverSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    return serverSupabase;
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && (SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY));
}

export function getDatabaseDiagnostics() {
  return {
    supabaseUrlConfigured: Boolean(SUPABASE_URL),
    serviceRoleConfigured: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    isProductionTarget: process.env.NODE_ENV === 'production',
    databaseTarget: 'PostgreSQL (Supabase)'
  };
}
