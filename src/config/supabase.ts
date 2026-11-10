/**
 * Client-Side Supabase Configuration - Smart EDU THCS
 * Tuân thủ nghiêm ngặt quy định:
 * - CHỈ dùng VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY
 * - Tuyệt đối KHÔNG đưa Service Role Key, Database Secret hay khóa quản trị vào frontend bundle
 * - Kiểm tra tính hợp lệ của biến môi trường, báo lỗi rõ ràng nếu thiếu hoặc sai định dạng
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'smart_edu_custom_supabase_url';
const STORAGE_ANON_KEY = 'smart_edu_custom_supabase_anon_key';

function getRawEnvUrl(): string {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    ''
  ).trim();
}

function getRawEnvKey(): string {
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
}

export function getActiveSupabaseConfig(): {
  url: string;
  publishableKey: string;
  source: 'env' | 'storage' | 'none';
  isValidUrl: boolean;
  error: string | null;
} {
  const envUrl = getRawEnvUrl();
  const envKey = getRawEnvKey();

  let activeUrl = envUrl;
  let activeKey = envKey;
  let source: 'env' | 'storage' | 'none' = 'none';

  if (envUrl && envKey) {
    source = 'env';
  } else {
    // Nếu biến môi trường chưa có, kiểm tra cấu hình người dùng nhập trong phiên
    const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) : null) || '';
    const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) : null) || '';
    if (storedUrl && storedKey) {
      activeUrl = storedUrl.trim();
      activeKey = storedKey.trim();
      source = 'storage';
    }
  }

  let isValidUrl = false;
  let error: string | null = null;

  if (!activeUrl && !activeKey) {
    error = 'Chưa cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY.';
  } else if (!activeUrl) {
    error = 'Thiếu biến VITE_SUPABASE_URL (URL dự án Supabase).';
  } else if (!activeKey) {
    error = 'Thiếu biến VITE_SUPABASE_PUBLISHABLE_KEY (Publishable/Anon key).';
  } else {
    try {
      const parsed = new URL(activeUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        error = 'VITE_SUPABASE_URL phải bắt đầu bằng https:// hoặc http://';
      } else {
        isValidUrl = true;
      }
    } catch {
      error = 'VITE_SUPABASE_URL không phải định dạng URL hợp lệ (ví dụ: https://xyz.supabase.co).';
    }
  }

  return {
    url: activeUrl,
    publishableKey: activeKey,
    source,
    isValidUrl,
    error
  };
}

let cachedClient: SupabaseClient | null = null;
let cachedKeySignature = '';

export function getClientSupabase(): SupabaseClient | null {
  const config = getActiveSupabaseConfig();
  if (!config.isValidUrl || !config.publishableKey) {
    return null;
  }

  const sig = `${config.url}::${config.publishableKey}`;
  if (cachedClient && cachedKeySignature === sig) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'smart_edu_thcs_auth'
      }
    });
    cachedKeySignature = sig;
    return cachedClient;
  } catch (err) {
    console.error('Lỗi khởi tạo Supabase Client:', err);
    return null;
  }
}

export const supabase = getClientSupabase();

export function isClientSupabaseConfigured(): boolean {
  const config = getActiveSupabaseConfig();
  return config.isValidUrl && Boolean(config.publishableKey);
}

export function getClientConfigStatus() {
  const config = getActiveSupabaseConfig();
  let domain = 'Chưa thiết lập';
  if (config.url) {
    try {
      domain = new URL(config.url).hostname;
    } catch {
      domain = 'URL không hợp lệ';
    }
  }

  return {
    hasUrl: Boolean(config.url),
    hasPublishableKey: Boolean(config.publishableKey),
    urlDomain: domain,
    fullUrl: config.url,
    source: config.source,
    isValid: config.isValidUrl && Boolean(config.publishableKey),
    error: config.error
  };
}

export function setCustomSupabaseConfig(url: string, publishableKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_ANON_KEY, publishableKey.trim());
  }
  cachedClient = null;
  cachedKeySignature = '';
}

export function clearCustomSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  }
  cachedClient = null;
  cachedKeySignature = '';
}
