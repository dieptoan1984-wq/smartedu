/**
 * Privileged Mutation Controller
 * Tuân thủ nguyên tắc:
 * "Chức năng chưa có ghi rõ Chưa triển khai; không giả thành công, không tự tuyên bố RLS an toàn hoặc chức năng đã nghiệm thu."
 */

import { ServerRequest, ServerResponse } from '../types';
import { SMART_EDU_78_FUNCTIONS, FunctionItem } from '../../../src/types/smartEduData';

export async function handlePrivilegedMutation(req: ServerRequest): Promise<ServerResponse> {
  const body = req.body as { code?: string; action?: string } | undefined;
  const functionCode = body?.code?.toUpperCase();

  const matchingFn = SMART_EDU_78_FUNCTIONS.find((f: FunctionItem) => f.code === functionCode);

  return {
    status: 422,
    headers: { 'Content-Type': 'application/json' },
    data: {
      success: false,
      code: 'CHUA_TRIEN_KHAI',
      message: matchingFn
        ? `Chức năng [${matchingFn.code}] ${matchingFn.title} hiện đang ở trạng thái "Chưa triển khai". Không tạo kết quả thành công giả.`
        : 'Chức năng chưa được triển khai trong bước sửa khung hiện tại.'
    }
  };
}
