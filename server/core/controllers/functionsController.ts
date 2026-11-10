/**
 * Functions Controller: Quản lý danh mục 78 chức năng đặc tả Smart EDU THCS 1.0
 * 6 nhóm nghiệp vụ (HS01-HS21, GV01-GV15, KT01-KT16, TC01-TC10, QT01-QT10, NC01-NC06)
 * và 13 bảng giao diện
 */

import { ServerRequest, ServerResponse } from '../types';
import { 
  SMART_EDU_78_FUNCTIONS, 
  SMART_EDU_GROUPS, 
  UI_BOARDS, 
  FunctionItem 
} from '../../../src/types/smartEduData';

export async function handleGetFunctionsCatalog(req: ServerRequest): Promise<ServerResponse> {
  const { group, board, search } = req.query;

  let filtered = [...SMART_EDU_78_FUNCTIONS];

  if (typeof group === 'string' && group && group !== 'ALL') {
    filtered = filtered.filter((f: FunctionItem) => f.groupId.toLowerCase() === group.toLowerCase());
  }

  if (typeof board === 'string' && board && board !== 'ALL') {
    filtered = filtered.filter((f: FunctionItem) => f.board === board);
  }

  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((f: FunctionItem) => 
      f.code.toLowerCase().includes(q) ||
      f.title.toLowerCase().includes(q) ||
      f.dauVao.toLowerCase().includes(q) ||
      f.xuLi.toLowerCase().includes(q) ||
      f.dauRa.toLowerCase().includes(q)
    );
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    data: {
      platform: 'Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS',
      version: '1.0 — Bản đề xuất trình duyệt (09/11/2026)',
      scope: 'Học sinh và giáo viên lớp 6–9, tất cả các môn THCS',
      totalFunctions: 78,
      statusDiscipline: 'Tất cả chức năng chưa có ghi rõ Chưa triển khai; không giả thành công',
      groups: SMART_EDU_GROUPS,
      boards: UI_BOARDS,
      functions: filtered
    }
  };
}

export async function handleGetFunctionDetails(req: ServerRequest): Promise<ServerResponse> {
  const urlParts = req.path.split('/');
  const code = urlParts[urlParts.length - 1]?.toUpperCase();

  const fn = SMART_EDU_78_FUNCTIONS.find((f: FunctionItem) => f.code === code);
  if (!fn) {
    return {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
      data: { error: `Không tìm thấy chức năng có mã ${code}` }
    };
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    data: fn
  };
}
