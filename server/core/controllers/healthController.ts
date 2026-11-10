/**
 * Health & Diagnostics Controller
 */

import { ServerRequest, ServerResponse } from '../types';

export async function handleHealthCheck(req: ServerRequest): Promise<ServerResponse> {
  const hasUrl = Boolean(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
  const hasPublishableKey = Boolean(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    data: {
      status: 'ok',
      service: 'Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS',
      version: '1.0-THCS-0911',
      scope: 'Lớp 6, 7, 8, 9 và tất cả các môn THCS',
      functionsCount: 78,
      groupsCount: 6,
      boardsCount: 13,
      currentStep: 'Khung giao diện, menu, danh mục 78 chức năng và màn hình đăng nhập',
      implementationNote: 'Các chức năng chưa lập trình được ghi rõ "Chưa triển khai", không tạo kết quả thành công giả.',
      environment: {
        hasSupabaseUrl: hasUrl,
        hasPublishableKey: hasPublishableKey
      }
    }
  };
}
