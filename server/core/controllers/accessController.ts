/**
 * Access Controller: Trả về trạng thái xác thực và vai trò người dùng
 */

import { ServerRequest, ServerResponse } from '../types';
import { authenticateRequest } from '../auth';

export async function handleGetCurrentAccess(req: ServerRequest): Promise<ServerResponse> {
  const access = await authenticateRequest(req);
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    data: access
  };
}
