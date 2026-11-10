/**
 * Smart EDU Frontend API Client
 * Gọi các endpoint phía Server (Express / Vercel API)
 */

import { FunctionItem } from '../types/smartEduData';

export interface UserAccessResponse {
  authenticated: boolean;
  user_id: string | null;
  display_name: string;
  roles: string[];
  primary_role: string;
  is_demo_role?: boolean;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      sessionStorage.setItem('smart_edu_token', token);
    } else {
      sessionStorage.removeItem('smart_edu_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('smart_edu_token');
    }
    return this.token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const t = this.getToken();
    if (t) {
      headers['Authorization'] = `Bearer ${t}`;
    }
    return headers;
  }

  async getCurrentAccess(): Promise<UserAccessResponse> {
    const res = await fetch('/api/access/current', {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      throw new Error(`Lỗi tải quyền truy cập: ${res.statusText}`);
    }
    return res.json();
  }

  async getFunctionsCatalog(params?: { group?: string; board?: string; search?: string }): Promise<{
    platform: string;
    version: string;
    scope: string;
    totalFunctions: number;
    functions: FunctionItem[];
  }> {
    const query = new URLSearchParams();
    if (params?.group) query.set('group', params.group);
    if (params?.board) query.set('board', params.board);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/functions?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Lỗi tải danh mục chức năng: ${res.statusText}`);
    }
    return res.json();
  }

  async getDatabaseSchema(): Promise<any> {
    const res = await fetch('/api/database/schema');
    if (!res.ok) {
      throw new Error(`Lỗi tải cấu trúc CSDL và 13 bảng: ${res.statusText}`);
    }
    return res.json();
  }

  async invokePrivilegedFunction(code: string): Promise<{ success: boolean; code: string; message: string }> {
    const res = await fetch('/api/privileged/mutate', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ code })
    });
    return res.json();
  }
}

export const apiClient = new ApiClient();
