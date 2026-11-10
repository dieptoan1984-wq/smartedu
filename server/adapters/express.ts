/**
 * Express Adapter for Smart EDU Core API
 * Dùng cho môi trường AI Studio (Node.js Express dev/production server)
 */

import { Router, Request, Response } from 'express';
import { ServerRequest } from '../core/types';
import { handleGetCurrentAccess } from '../core/controllers/accessController';
import { handleGetFunctionsCatalog, handleGetFunctionDetails } from '../core/controllers/functionsController';
import { handleHealthCheck } from '../core/controllers/healthController';
import { handlePrivilegedMutation } from '../core/controllers/privilegedController';
import { handleGetDatabaseSchema } from '../core/controllers/schemaController';

export function createExpressApiRouter(): Router {
  const router = Router();

  // Helper chuyển đổi Express Request -> ServerRequest
  function toServerRequest(req: Request): ServerRequest {
    return {
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      headers: req.headers as Record<string, string | string[] | undefined>,
      query: req.query as Record<string, string | string[] | undefined>,
      body: req.body,
      clientIp: req.ip
    };
  }

  // 1. Health check & Diagnostics
  router.get('/health', async (req: Request, res: Response) => {
    const response = await handleHealthCheck(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  // 2. Current Access / Role Verification
  router.get('/access/current', async (req: Request, res: Response) => {
    const response = await handleGetCurrentAccess(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  // 3. Catalog 78 functions
  router.get('/functions', async (req: Request, res: Response) => {
    const response = await handleGetFunctionsCatalog(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  router.get('/functions/:code', async (req: Request, res: Response) => {
    const response = await handleGetFunctionDetails(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  // 4. Database Schema 13 tables
  router.get('/database/schema', async (req: Request, res: Response) => {
    const response = await handleGetDatabaseSchema(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  // 5. Privileged Mutation (Scope verified)
  router.post('/privileged/mutate', async (req: Request, res: Response) => {
    const response = await handlePrivilegedMutation(toServerRequest(req));
    res.status(response.status).json(response.data);
  });

  return router;
}
