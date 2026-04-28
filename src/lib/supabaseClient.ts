import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

const looksLikePlaceholder =
  !url ||
  !anonKey ||
  url.includes('YOUR_PROJECT_REF') ||
  anonKey === 'your_anon_key' ||
  anonKey.startsWith('your_')

export const isSupabaseConfigured = Boolean(url && anonKey && !looksLikePlaceholder)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
