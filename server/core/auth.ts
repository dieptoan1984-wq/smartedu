/**
 * Server Core Authentication & Current Access
 * Vai trò chuẩn THCS theo 001_nen_tang.sql:
 * - student: Học sinh
 * - teacher: Giáo viên
 * - reviewer: Người duyệt
 * - admin: Quản trị
 * - researcher: Nghiên cứu
 * - guest: Khách
 */

import { ServerRequest } from './types';
import { UserRole } from '../../src/types/smartEduData';

export interface THCSUserAccess {
  authenticated: boolean;
  user_id: string | null;
  display_name: string;
  email?: string;
  roles: UserRole[];
  primary_role: UserRole;
  is_demo_role?: boolean;
  auth_source?: 'supabase' | 'demo' | 'none';
}

export const DEMO_PRESET_USERS: Record<string, THCSUserAccess> = {
  student: {
    authenticated: true,
    user_id: 'u-demo-student',
    display_name: 'Tài khoản Học sinh mẫu (Demo)',
    roles: ['student'],
    primary_role: 'student',
    is_demo_role: true,
    auth_source: 'demo'
  },
  teacher: {
    authenticated: true,
    user_id: 'u-demo-teacher',
    display_name: 'Tài khoản Giáo viên mẫu (Demo)',
    roles: ['teacher'],
    primary_role: 'teacher',
    is_demo_role: true,
    auth_source: 'demo'
  },
  reviewer: {
    authenticated: true,
    user_id: 'u-demo-reviewer',
    display_name: 'Tài khoản Người duyệt mẫu (Demo)',
    roles: ['reviewer'],
    primary_role: 'reviewer',
    is_demo_role: true,
    auth_source: 'demo'
  },
  admin: {
    authenticated: true,
    user_id: 'u-demo-admin',
    display_name: 'Tài khoản Quản trị mẫu (Demo)',
    roles: ['admin'],
    primary_role: 'admin',
    is_demo_role: true,
    auth_source: 'demo'
  },
  researcher: {
    authenticated: true,
    user_id: 'u-demo-researcher',
    display_name: 'Tài khoản Nghiên cứu viên mẫu (Demo)',
    roles: ['researcher'],
    primary_role: 'researcher',
    is_demo_role: true,
    auth_source: 'demo'
  }
};

/**
 * Phân tích token Supabase JWT an toàn (không dùng thư viện ngoài)
 */
function parseSupabaseJwtPayload(token: string): { sub?: string; email?: string; role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: ServerRequest): Promise<THCSUserAccess> {
  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return {
      authenticated: false,
      user_id: null,
      display_name: 'Khách vãng lai',
      roles: ['guest'],
      primary_role: 'guest',
      auth_source: 'none'
    };
  }

  // Token kiểm thử vai trò (chỉ dùng trong khu vực Demo được dán nhãn rõ)
  if (token.startsWith('demo-')) {
    const roleKey = token.replace('demo-', '').toLowerCase();
    if (DEMO_PRESET_USERS[roleKey]) {
      return DEMO_PRESET_USERS[roleKey];
    }
  }

  // Token thật từ Supabase Auth (JWT)
  const payload = parseSupabaseJwtPayload(token);
  if (payload && payload.sub) {
    return {
      authenticated: true,
      user_id: payload.sub,
      email: payload.email || '',
      display_name: payload.email ? payload.email.split('@')[0] : `Người dùng (${payload.sub.slice(0, 8)})`,
      // Lưu ý: Phía backend khi cần kiểm tra quyền mutation chi tiết phải truy vấn private.user_roles
      roles: ['student'], // Mặc định theo trigger smart_edu_signup
      primary_role: 'student',
      is_demo_role: false,
      auth_source: 'supabase'
    };
  }

  return {
    authenticated: false,
    user_id: null,
    display_name: 'Chưa xác thực',
    roles: ['guest'],
    primary_role: 'guest',
    auth_source: 'none'
  };
}
