/**
 * Vercel Serverless Adapter for Smart EDU Core API
 * Cho phép triển khai trực tiếp lên Vercel Edge / Node Functions mà không cần sửa Core logic
 */

import { ServerRequest, ServerResponse } from '../core/types';
import { handleGetCurrentAccess } from '../core/controllers/accessController';
import { handleGetFunctionsCatalog, handleGetFunctionDetails } from '../core/controllers/functionsController';
import { handleHealthCheck } from '../core/controllers/healthController';
import { handlePrivilegedMutation } from '../core/controllers/privilegedController';
import { handleGetDatabaseSchema } from '../core/controllers/schemaController';

export interface VercelLikeRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelLikeResponse {
  status: (code: number) => VercelLikeResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => VercelLikeResponse;
}

export async function dispatchVercelRequest(
  req: VercelLikeRequest,
  res: VercelLikeResponse
): Promise<void> {
  const method = req.method || 'GET';
  const url = req.url || '/api/health';
  const parsedUrl = new URL(url, 'http://localhost');
  const path = parsedUrl.pathname.replace(/^\/api/, '');

  const serverReq: ServerRequest = {
    method,
    url,
    path,
    headers: req.headers,
    query: req.query || Object.fromEntries(parsedUrl.searchParams),
    body: req.body
  };

  let response: ServerResponse;

  if (path === '/health' && method === 'GET') {
    response = await handleHealthCheck(serverReq);
  } else if (path === '/access/current' && method === 'GET') {
    response = await handleGetCurrentAccess(serverReq);
  } else if (path === '/functions' && method === 'GET') {
    response = await handleGetFunctionsCatalog(serverReq);
  } else if (path.startsWith('/functions/') && method === 'GET') {
    response = await handleGetFunctionDetails(serverReq);
  } else if (path === '/database/schema' && method === 'GET') {
    response = await handleGetDatabaseSchema(serverReq);
  } else if (path === '/privileged/mutate' && method === 'POST') {
    response = await handlePrivilegedMutation(serverReq);
  } else {
    response = {
      status: 404,
      data: { error: `Không tìm thấy endpoint API: ${path}` }
    };
  }

  res.status(response.status).json(response.data);
}
